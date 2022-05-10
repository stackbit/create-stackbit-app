#!/usr/bin/env node

import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import { nanoid } from "nanoid";
import path from "path";
import readline from "readline";
import util from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import config from "./config.js";

/* --- Helpers --- */

const run = util.promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question, defaultAnswer) {
  return new Promise((resolve) => {
    rl.question(question, (input) => resolve(input || defaultAnswer));
  });
}

/* --- Parse CLI Arguments */

const args = yargs(hideBin(process.argv))
  .option("starter", {
    alias: "s",
    describe: "Choose a starter",
    choices: config.starters.map((s) => s.name),
  })
  .help()
  .parse();

/* --- References --- */

const starter = config.starters.find(
  (s) => s.name === (args.starter ?? config.defaults.starter.name)
);
const dirName =
  args._[0] ?? `${config.defaults.dirName}-${nanoid(8).toLowerCase()}`;

/* --- New Project --- */

async function cloneStarter() {
  // Clone repo
  const cloneCommand = `git clone --depth=1 ${starter.repoUrl} ${dirName}`;
  console.log(`\nCreating new project in ${dirName} ...`);
  await run(cloneCommand);

  // Install dependencies
  console.log(`Installing dependencies ...`);
  await run(`cd ${dirName} && npm install`);

  // Set up git
  console.log(`Setting up Git ...`);
  await run(`rm -rf ${dirName}/.git`);
  await run(
    `cd ${dirName} && git init && git add . && git commit -m "New Stackbit project"`
  );

  // Output next steps:
  console.log(`
🎉 ${chalk.bold("Welcome to Stackbit!")} 🎉

Follow the instructions for getting Started here:

    ${starter.repoUrl}#readme
  `);
}

/* --- Existing Project --- */

async function integrateStackbit() {
  return new Promise(async (resolve) => {
    const integrate = await prompt(`
  This looks like an existing project.
  ${chalk.bold("Would you like to install Stackbit in this project?")} [Y/n] `);

    if (!["yes", "y"].includes(integrate?.toLowerCase())) return resolve(false);

    console.log(`
Visit the following URL to learn more about the integration process:

    https://docs.stackbit.com/how-to-guides/site-management/integrate-stackbit/
`);
    return resolve(true);
  });
}

/* --- Run --- */

const packageJsonFilePath = path.join(process.cwd(), "package.json");
const hasPackageJson = fs.existsSync(packageJsonFilePath);
const runFunc = hasPackageJson ? integrateStackbit : cloneStarter;
await runFunc();

rl.close();
