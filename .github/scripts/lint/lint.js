import { readFile } from "fs/promises";
import { createReadStream } from "fs";
import { load } from "js-yaml";
import path from "path";
import readline from "readline";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const CH_RED = "\x1b[31m";
const CH_GREEN = "\x1b[32m";
const CH_YELLOW = "\x1b[33m";
const CH_BLUE = "\x1b[34m";
const CH_RESET = "\x1b[0m";
const CH_BOLD = "\x1b[1m";
const CH_LOW_CONTRAST = "\x1b[2m";

async function loadYamlFile(filename) {
  const yamlText = await readFile(filename, "utf8");
  return load(yamlText);
}

function makeRegexps(rules) {
  return rules.map(({ pattern, ...rest }) => {
    return {
      regexp: new RegExp(pattern, "g"),
      ...rest,
    };
  });
}

function type2Color(type) {
  switch (type) {
    case 'recommended':
      return CH_BLUE;
    case 'warn':
      return CH_YELLOW;
    case 'error':
      return CH_RED;
    default:
      return CH_RESET;
  }
}

function check(regexps, line) {
  return regexps.flatMap(({ regexp, expected, ...rest }) => {
    let result;
    const array = [];
    while (null != (result = regexp.exec(line))) {
      const lastIndex = regexp.lastIndex;
      const expectedExample = line.replace(regexp, expected);
      regexp.lastIndex = lastIndex;
      array.push({
        index: lastIndex,
        actual: line,
        expected: expectedExample,
        ...rest,
      });
    }
    return array;
  });
}

if (process.argv.length <= 2) {
  throw new Error("ファイル名を指定してください");
}

async function main() {
  const data = await loadYamlFile(path.join(__dirname, "./rules.yml"));
  const regexps = makeRegexps(data.rules);

  const filename = process.argv[2];

  const stream = createReadStream(filename);
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false,
  });

  let i = 1;
  rl.on("line", (line) => {
    const results = check(regexps, line);
    if (results.length) {
      for (const { actual, expected, message, type, ref } of results) {
        const indent = `    `;
        const color = type2Color(type);
        console.log(
          `${CH_LOW_CONTRAST}${filename}${CH_RESET}:${i}\n` +
          `${indent}${color}${type}${CH_RESET} ${message}\n` +
          `${indent}${color}- ${actual}\n` +
          `${indent}${CH_GREEN}+ ${expected}${CH_RESET}\n` +
          `${indent}${CH_LOW_CONTRAST}参考: ${ref}${CH_RESET}`
        );
      }
    }
    i++;
  });
}

main();
