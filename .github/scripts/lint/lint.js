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
const CH_RESET = "\x1b[39m";

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

  console.log(`\n${filename}\n`);

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
      for (const { actual, expected, message, type } of results) {
        const indent = `${" ".repeat(`${i}`.length)}  `;
        const color = type === "warn" ? CH_YELLOW : CH_RED;
        console.log(
          `L${i}: ${message}\n${indent}${color}${actual}\n${indent}${CH_GREEN}${expected}${CH_RESET}`
        );
      }
    }
    i++;
  });
}

main();
