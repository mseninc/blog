import sharp from "sharp"
import glob from "glob"
import imagemin from "imagemin"
import imageminMozjpeg from "imagemin-mozjpeg"
import imageminPngquant from "imagemin-pngquant"
import imageminGifsicle from "imagemin-gifsicle"
import imageminSvgo from "imagemin-svgo"
import path from "path"
import { promises as fs } from "fs"
import commander from "commander"

async function resizeImageIfNeeded(sourceFileName, destFileName, { width, height }) {
  const stream = sharp(sourceFileName)
  const info = await stream.metadata()
  if (info.width < width && info.height < height ) {
    await fs.copyFile(sourceFileName, destFileName)
    return false
  }
  stream.resize(width, height, { fit: 'inside' })
  await stream.toFile(destFileName)
  return true
}

async function resizeImages(sourceFiles, destDirPath, { maxResolution, ext }) {
  if (!sourceFiles.length) { return []; }
  const results = []
  for (const source of sourceFiles.filter(x => path.extname(x) === `.${ext}`)) {
    const filename = path.basename(source)
    const dest = path.join(destDirPath, filename)
    const resized = await resizeImageIfNeeded(source, dest, maxResolution)
    const statSource = await fs.stat(source)
    const statDest = await fs.stat(dest)
    results.push({
      sourcePath: source,
      sourceSize: statSource.size,
      destinationPath: dest,
      destinationSize: statDest.size,
      resized,
    })
  }
  return results
}

async function optimizeImages(sourceFiles, destDirPath) {
  if (!sourceFiles.length) { return []; }
  const imageMinResults = await imagemin(sourceFiles, {
    destination: destDirPath,
    plugins: [
      imageminMozjpeg({ quality: 70 }),
      imageminPngquant({ quality: [0.7, 0.9] }),
      imageminGifsicle(),
      imageminSvgo()
    ]
  })
  const results = []
  for (const { data, sourcePath, destinationPath } of imageMinResults) {
    const stat = await fs.stat(sourcePath)
    results.push({
      sourcePath,
      sourceSize: stat.size,
      destinationPath,
      destinationSize: data.length,
    })
  }
  return results
}

function makeResultSummary(results1, results2) {
  return results1.map(x =>{
    const filename = path.basename(x.sourcePath)
    const result1 = {
      filename,
      source: { path: x.sourcePath, size: x.sourceSize },
      optimized: { path: x.destinationPath, size: x.destinationSize },
      minimum: {
        path: x.destinationSize < x.sourceSize ? x.destinationPath : x.sourcePath,
        size: x.destinationSize < x.sourceSize ? x.destinationSize : x.sourceSize,
      },
      reducedSize: 0,
      percent: 1.0,
    }
    const resized = results2.find(x => path.basename(x.sourcePath) === filename)
    const result2 = resized ? {
      ...result1,
      resized: { path: resized?.destinationPath, size: resized?.destinationSize },
      minimum: {
        path: resized?.destinationSize < result1.minimum.size ? resized?.destinationPath : result1.minimum.path,
        size: resized?.destinationSize < result1.minimum.size ? resized?.destinationSize : result1.minimum.size,
      },
    } : result1
    return {
      ...result2,
      reducedSize: result2.source.size - result2.minimum.size,
      percent: result2.minimum.size / result2.source.size,
      status: '',
    }
  })
}

async function bulkMkdir(dirs) {
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true })
  }
}

async function bulkRmdir(dirs) {
  for (const dir of dirs) {
    await fs.rmdir(dir, { recursive: true })
  }
}

async function recoverOrginalFiles(filePaths) {
  for (const filePath of filePaths) {
    const backupFilename = `${filePath}.org`
    try {
      await fs.stat(backupFilename)
      try {
        await fs.copyFile(backupFilename, filePath)
      } catch (error) {
        console.error(`recover failed`, filePath)
      }
    } catch {
      // ignore if backup file does not exist
    }
  }
}

async function backupFiles(filePaths) {
  for (const filePath of filePaths) {
    const backupFilename = `${filePath}.org`
    try {
      await fs.stat(backupFilename)
    } catch {
      // backup if no file exists
      try {
        await fs.copyFile(filePath, backupFilename)
      } catch (error) {
        console.error(`backup failed`, filePath)
      }
    }
  }
}

async function writeFiles(resultSummary) {
  const reports = []
  for (const result of resultSummary) {
    let status = ''
    const { source: { path: source }, minimum: { path: min } } = result
    if (min === source) {
      status = 'sustained'
    } else {
      try {
        await fs.copyFile(min, source)
        status = 'minified'
      } catch (error) {
        console.error('writing file failure')
        status = 'failed'
      }
    }
    reports.push({
      ...result,
      status,
    })
  }
  return reports
}

function reportAll(reports) {
  const sizeText = (size) => `${Math.round(size / 1024).toLocaleString()}KB`
  let totalReducedSize = 0
  for (const { source, minimum, reducedSize, percent, status } of reports) {
    const percentText = `${Math.round(percent * 100)}%`
    console.log(`"${source.path}" [${status}] ${percentText} (${sizeText(source.size)} -> ${sizeText(minimum.size)}; -${sizeText(reducedSize)})`)
    totalReducedSize += reducedSize
  }
  console.log(`reduced: ${sizeText(totalReducedSize)}`)
}

commander
  .version('1.0.0')
  .usage('[options] <file ...>')
  .argument('<directory>', 'path to directory including source images')
  .option('-D, --dry-run', 'only show optimization results')
  .option('-d, --debug', 'show process details')
  .option('-k, --keep-temporary-files', 'keep temporary files')
  .option('-s, --silent', 'show no results')
  .option('-B, --no-backup', 'without backup for original files')
  .parse(process.argv)

const options = commander.opts()

async function main() {
  console.time('elapsed');

  const MAX_WIDTH = process.env.MAX_WIDTH || 1200
  const MAX_HEIGHT = process.env.MAX_HEIGHT || 1200
  const maxResolution = { width: MAX_WIDTH, height: MAX_HEIGHT }

  // source dir
  const dirPath = process.argv[2].replace(/\/$/, '')
  // check if source dir exists
  await fs.stat(dirPath)

  // working dirs
  const resizedDirPath = '.resized'
  const optimizedDirPath = '.optimized'
  const resizedOptimizedDirPath = '.resized-optimized'
  // prepare working dirs
  await bulkMkdir([resizedDirPath, optimizedDirPath, resizedOptimizedDirPath])

  const sourceGlob = `${dirPath}/**/*.{jpg,png,gif,svg}`
  const sourceFiles = glob.sync(sourceGlob)

  await recoverOrginalFiles(sourceFiles)

  // optimize only
  const optimizeResults = await optimizeImages(sourceFiles, optimizedDirPath)
  // optimize after resize
  const resizeResults = await resizeImages(sourceFiles, resizedDirPath, { maxResolution, ext: 'jpg' })
  const resizedFiles = resizeResults.map(x => x.destinationPath)
  const resizedOptimizeResults = await optimizeImages(resizedFiles, resizedOptimizedDirPath)

  // show results
  if (options.debug) {
    console.group('Optimize only:')
    console.debug(optimizeResults)
    console.groupEnd()
    console.group('Resized only:')
    console.debug(resizeResults)
    console.groupEnd()
    console.group('Optimize after resize:')
    console.debug(resizedOptimizeResults)
    console.groupEnd()
  }
  const resultSummary = makeResultSummary(optimizeResults, resizedOptimizeResults)
  if (options.debug) {
    console.group('Summary:')
    console.debug(resultSummary)
    console.groupEnd()
  }
  if (!options.dryRun) {
    // replace images
    if (!options.noBackup) {
      await backupFiles(resultSummary.map(x => x.source.path))
    }
    const reports = await writeFiles(resultSummary)
    if (!options.silent) {
      reportAll(reports)
    }
  }

  if (!options.keepTemporaryFiles) {
    await bulkRmdir([resizedDirPath, optimizedDirPath, resizedOptimizedDirPath])
  }
  console.timeEnd('elapsed');
}

  
if (process.argv.length < 2) {
  console.error('No dicrecotry specified')
  process.exit(1)
}

main()

