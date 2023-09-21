import sharp from "sharp";
import glob from "glob";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";
import path from "path";
import { promises as fs } from "fs";
import commander from "commander";
import { groupBy, sha256 } from "./lib/util.js";

async function resizeImageIfNeeded(
  sourceFileName,
  destFileName,
  { width, height }
) {
  const stream = sharp(sourceFileName);
  const info = await stream.metadata();
  if (info.width < width && info.height < height) {
    await fs.copyFile(sourceFileName, destFileName);
    return false;
  }
  stream.resize(width, height, { fit: "inside" });
  await stream.toFile(destFileName);
  return true;
}

/**
 * resize images
 * @param {{ path: string, fileId: string }[]} sourceFileInfos
 * @param {string} destDirPath
 * @param {{ maxResolution: { width: number, height: number }, ext: string }} param2
 * @returns {Promise<{ fileId: string, sourcePath: string, sourceSize: number, destinationPath: string, destinationSize: number, resized: boolean }[]>}
 */
async function resizeImages(
  sourceFileInfos,
  destDirPath,
  { maxResolution, ext }
) {
  if (!sourceFileInfos.length) {
    return [];
  }
  const results = [];
  for (const { fileId, path: filePath } of sourceFileInfos.filter(
    (x) => path.extname(x.path) === `.${ext}`
  )) {
    const dest = path.join(destDirPath, filePath);
    const destDir = path.dirname(dest);
    await fs.mkdir(destDir, { recursive: true });
    const resized = await resizeImageIfNeeded(filePath, dest, maxResolution);
    const statSource = await fs.stat(filePath);
    const statDest = await fs.stat(dest);
    results.push({
      fileId,
      sourcePath: filePath,
      sourceSize: statSource.size,
      destinationPath: dest,
      destinationSize: statDest.size,
      resized,
    });
  }
  return results;
}

/**
 * optimize images
 * @param {{ path: string, fileId: string }[]} sourceFileInfos
 * @param {string} destDirPath
 * @returns {Promise<{ fileId: string, sourcePath: string, sourceSize: number, destinationPath: string, destinationSize: number }[]>}
 */
async function optimizeImages(sourceFileInfos, destDirPath) {
  if (!sourceFileInfos.length) {
    return [];
  }
  const dirGrouped = groupBy(sourceFileInfos, (x) => path.dirname(x.path));
  const results = [];
  // optimize images in each dir
  for (const [dir, fileInfos] of dirGrouped) {
    const destDir = path.join(destDirPath, dir);
    await fs.mkdir(destDir, { recursive: true });
    const imageMinResults = await imagemin(
      fileInfos.map((x) => x.path),
      {
        destination: destDir,
        plugins: [
          imageminMozjpeg({ quality: 70 }),
          imageminPngquant({ quality: [0.7, 0.9] }),
          imageminGifsicle(),
          imageminSvgo(),
        ],
      }
    );
    for (const { data, sourcePath, destinationPath } of imageMinResults) {
      const stat = await fs.stat(sourcePath);
      const fileInfo = fileInfos.find((x) => x.path === sourcePath);
      results.push({
        fileId: fileInfo.fileId,
        sourcePath,
        sourceSize: stat.size,
        destinationPath,
        destinationSize: data.length,
      });
    }
  }
  return results;
}

function makeResultSummary(results1, results2) {
  return results1.map((x) => {
    const fileId = x.fileId;
    const filename = path.basename(x.sourcePath);
    const result1 = {
      fileId,
      filename,
      source: { path: x.sourcePath, size: x.sourceSize },
      optimized: { path: x.destinationPath, size: x.destinationSize },
      minimum: {
        path:
          x.destinationSize < x.sourceSize ? x.destinationPath : x.sourcePath,
        size:
          x.destinationSize < x.sourceSize ? x.destinationSize : x.sourceSize,
      },
      reducedSize: 0,
      percent: 1.0,
    };
    const resized = results2.find((x) => x.fileId === fileId);
    const result2 = resized
      ? {
          ...result1,
          resized: {
            path: resized?.destinationPath,
            size: resized?.destinationSize,
          },
          minimum: {
            path:
              resized?.destinationSize < result1.minimum.size
                ? resized?.destinationPath
                : result1.minimum.path,
            size:
              resized?.destinationSize < result1.minimum.size
                ? resized?.destinationSize
                : result1.minimum.size,
          },
        }
      : result1;
    return {
      ...result2,
      reducedSize: result2.source.size - result2.minimum.size,
      percent: result2.minimum.size / result2.source.size,
      status: "",
    };
  });
}

async function bulkMkdir(dirs) {
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function bulkRmdir(dirs) {
  for (const dir of dirs) {
    await fs.rm(dir, { recursive: true });
  }
}

async function recoverOriginalFiles(filePaths) {
  for (const filePath of filePaths) {
    const backupFilename = `${filePath}.org`;
    try {
      await fs.stat(backupFilename);
      try {
        await fs.copyFile(backupFilename, filePath);
      } catch (error) {
        console.error(`recover failed`, filePath);
      }
    } catch {
      // ignore if backup file does not exist
    }
  }
}

async function backupFiles(filePaths) {
  for (const filePath of filePaths) {
    const backupFilename = `${filePath}.org`;
    try {
      await fs.stat(backupFilename);
    } catch {
      // backup if no file exists
      try {
        await fs.copyFile(filePath, backupFilename);
      } catch (error) {
        console.error(`backup failed`, filePath);
      }
    }
  }
}

async function writeFiles(resultSummary) {
  const reports = [];
  for (const result of resultSummary) {
    let status = "";
    const {
      source: { path: source },
      minimum: { path: min },
    } = result;
    if (min === source) {
      status = "sustained";
    } else {
      try {
        await fs.copyFile(min, source);
        status = "minified";
      } catch (error) {
        console.error("writing file failure");
        status = "failed";
      }
    }
    reports.push({
      ...result,
      status,
    });
  }
  return reports;
}

function reportAll(reports) {
  const sizeText = (size) => `${Math.round(size / 1024).toLocaleString()}KB`;
  for (const { source, minimum, reducedSize, percent, status } of reports) {
    const percentText = `${Math.round(percent * 100)}%`;
    console.log(
      `"${source.path}" [${status}] ${percentText} (${sizeText(
        source.size
      )} -> ${sizeText(minimum.size)}; -${sizeText(reducedSize)})`
    );
  }
}

commander
  .version("1.1.0")
  .usage("[options] <file ...>")
  .argument("<directory>", "path to directory including source images")
  .option("-D, --dry-run", "only show optimization results")
  .option("-d, --debug", "show process details")
  .option("-k, --keep-temporary-files", "keep temporary files")
  .option("-s, --silent", "show no results")
  .option("-B, --no-backup", "without backup for original files")
  .option("-r, --recover", "recover original files before processing")
  .parse(process.argv);

const options = commander.opts();

async function main() {
  const MAX_WIDTH = Number(process.env.MAX_WIDTH) || 1200;
  const MAX_HEIGHT = Number(process.env.MAX_HEIGHT) || 1200;
  const maxResolution = { width: MAX_WIDTH, height: MAX_HEIGHT };

  // source dir
  const dirPath = process.argv[2].replace(/\/$/, "");
  // check if source dir exists
  await fs.stat(dirPath);

  // working dirs
  const resizedDirPath = ".resized";
  const optimizedDirPath = ".optimized";
  const resizedOptimizedDirPath = ".resized-optimized";
  // prepare working dirs
  await bulkMkdir([resizedDirPath, optimizedDirPath, resizedOptimizedDirPath]);

  const sourceGlob = `${dirPath}/**/*.{jpg,jpeg,png,gif,svg}`;
  const sourceFiles = glob.sync(sourceGlob);
  const sourceFileInfos = sourceFiles.map((path) => ({
    path,
    fileId: sha256(path),
  }));

  if (options.recover) {
    await recoverOriginalFiles(sourceFiles);
  }

  // optimize only
  const optimizeResults = await optimizeImages(
    sourceFileInfos,
    optimizedDirPath
  );
  // resize only (only jpg)
  const resizeResults = await resizeImages(sourceFileInfos, resizedDirPath, {
    maxResolution,
    ext: "jpg",
  });
  const resizedFileFileInfos = resizeResults.map((x) => ({
    path: x.destinationPath,
    fileId: x.fileId,
  }));
  // optimize after resize
  const resizedOptimizeResults = await optimizeImages(
    resizedFileFileInfos,
    resizedOptimizedDirPath
  );

  // show results
  if (options.debug) {
    console.group("Optimize only:");
    console.debug(optimizeResults);
    console.groupEnd();
    console.group("Resized only:");
    console.debug(resizeResults);
    console.groupEnd();
    console.group("Optimize after resize:");
    console.debug(resizedOptimizeResults);
    console.groupEnd();
  }
  let resultSummary = makeResultSummary(
    optimizeResults,
    resizedOptimizeResults
  );
  resultSummary = resultSummary.filter((x) => x.percent < 0.8);
  if (options.debug) {
    console.group("Summary:");
    console.debug(resultSummary);
    const reducedSize = resultSummary.reduce(
      (acc, x) => acc + x.reducedSize,
      0
    );
    console.debug(
      `Total reduced size: ${Math.round(reducedSize / 1024).toLocaleString()}KB`
    );
    console.groupEnd();
  }
  if (!options.dryRun) {
    // replace images
    if (!options.noBackup) {
      await backupFiles(resultSummary.map((x) => x.source.path));
    }
    const reports = await writeFiles(resultSummary);
    if (!options.silent) {
      reportAll(reports);
    }
  }

  if (!options.keepTemporaryFiles) {
    await bulkRmdir([
      resizedDirPath,
      optimizedDirPath,
      resizedOptimizedDirPath,
    ]);
  }
}

if (process.argv.length < 2) {
  console.error("No directory specified");
  process.exit(1);
}

main();
