#!/usr/bin/env node

import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
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

async function installDependencies() {
  console.log(`Installing dependencies ...`);
  await run(`cd ${dirName} && npm install`);
}

async function initGit() {
  console.log(`Setting up Git ...`);
  await run(`rm -rf ${dirName}/.git`);
  await run(
    `cd ${dirName} && git init && git add . && git commit -m "New Stackbit project"`
  );
}

/* --- Parse CLI Arguments */

const args = yargs(hideBin(process.argv))
  .option("starter", {
    alias: "s",
    describe: "Choose a starter",
    choices: config.starters.map((s) => s.name),
  })
  .option("example", {
    alias: "e",
    describe: "Start from an example",
    choices: config.examples.directories,
  })
  .help()
  .parse();

/* --- References --- */

const starter = config.starters.find(
  (s) => s.name === (args.starter ?? config.defaults.starter.name)
);

// Current time in seconds.
const timestamp = Math.round(new Date().getTime() / 1000);

const dirName = args._[0] ?? `${config.defaults.dirName}-${timestamp}`;

/* --- New Project from Starter --- */

async function cloneStarter() {
  // Clone repo
  const cloneCommand = `git clone --depth=1 ${starter.repoUrl} ${dirName}`;
  console.log(`\nCreating new project in ${dirName} ...`);
  await run(cloneCommand);

  // Project Setup
  await installDependencies();
  await initGit();

  // Output next steps:
  console.log(`
🎉 ${chalk.bold("Welcome to Stackbit!")} 🎉

Follow the instructions for getting Started here:

    ${starter.repoUrl}#readme
  `);
}

/* --- New Project from Example --- */

async function cloneExample() {
  const tmpDir = `examples-sparse-${timestamp}`;
  console.log(`\nCreating new project in ${dirName} ...`);

  try {
    // Sparse clone the monorepo.
    await run(
      `git clone --depth 1 --filter=blob:none --sparse ${config.examples.repoUrl} ${tmpDir}`
    );
    // Checkout just the example dir.
    await run(`cd ${tmpDir} && git sparse-checkout set ${args.example}`);
    // Copy out into a new directory within current working directory.
    await run(`cp -R ${tmpDir}/${args.example} ${dirName}`);
    // Delete the clone.
    await run(`rm -rf ${tmpDir}`);

    // Project Setup
    await installDependencies();
    await initGit();
  } catch (err) {
    console.error(err);
    if (fs.existsSync(dirName)) await run(`rm -rf ${dirName}`);
    if (fs.existsSync(tmpDir)) await run(`rm -rf ${tmpDir}`);
    process.exit(1);
  }

  // Output next steps:
  console.log(`
🎉 ${chalk.bold("Your example project is ready!")} 🎉

Follow the instructions and learn more about the example here:

    ${config.examples.repoUrl}/tree/main/${args.example}#readme
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

async function doCreate() {
  // If the current directory has a package.json file, we assume we're in an
  // active project, and will not create a  new project.
  const packageJsonFilePath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonFilePath)) return integrateStackbit();
  // If both starter and example were specified, throw an error message.
  if (args.starter && args.example) {
    console.error("[ERROR] Cannot specify a starter and an example.");
    process.exit(1);
  }
  // Start from an example if specified.
  if (args.example) return cloneExample();
  // Otherwise, use a starter, which falls back to the default if not set.
  return cloneStarter();
}

await doCreate();

rl.close();
