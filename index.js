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

function getDirName(defaultDirName) {
  let dirName = args._[0] ?? defaultDirName;
  if (fs.existsSync(dirName)) dirName += `-${timestamp}`;
  return dirName;
}

async function installDependencies(dirName) {
  console.log(`Installing dependencies ...`);
  await run(`cd ${dirName} && npm install`);
}

async function initGit(dirName) {
  console.log(`Setting up Git ...`);
  await run(`rm -rf ${dirName}/.git`);
  await run(
    `cd ${dirName} && git init && git add . && git commit -m "New Stackbit project"`
  );
}

/**
 * Given a version string, compare it to a control version. Returns:
 *
 *  -1: version is less than (older) than control
 *   0: version and control are identical
 *   1: version is greater than (newer) than control
 *
 * @param {string} version Version string that is being compared
 * @param {string} control Version that is being compared against
 */
function compareVersion(version, control) {
  // References
  let returnValue = 0;
  // Return 0 if the versions match.
  if (version === control) return returnValue;
  // Break the versions into arrays of integers.
  const getVersionParts = (str) => str.split(".").map((v) => parseInt(v));
  const versionParts = getVersionParts(version);
  const controlParts = getVersionParts(control);
  // Loop and compare each item.
  controlParts.every((controlPart, idx) => {
    // If the versions are equal at this part, we move on to the next part.
    if (versionParts[idx] === controlPart) return true;
    // Otherwise, set the return value, then break out of the loop.
    returnValue = versionParts[idx] > controlPart ? 1 : -1;
    return false;
  });
  return returnValue;
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

/* --- New Project from Starter --- */

async function cloneStarter() {
  // Set references
  const dirName = getDirName(config.defaults.dirName);

  // Clone repo
  const cloneCommand = `git clone --depth=1 ${starter.repoUrl} ${dirName}`;
  console.log(`\nCreating new project in ${dirName} ...`);
  await run(cloneCommand);

  // Project Setup
  await installDependencies(dirName);
  await initGit(dirName);

  // Output next steps:
  console.log(`
🎉 ${chalk.bold("Welcome to Stackbit!")} 🎉

Follow the instructions for getting Started here:

    ${starter.repoUrl}#readme
  `);
}

/* --- New Project from Example --- */

async function cloneExample() {
  const gitResult = await run("git --version");
  const gitVersionMatch = gitResult.stdout.match(/\d+\.\d+\.\d+/);
  if (!gitVersionMatch || !gitVersionMatch[0]) {
    console.error(
      `Cannot determine git version, which is required for starting from an example.`,
      `\nPlease report this:`,
      chalk.underline(
        "https://github.com/stackbit/create-stackbit-app/issues/new"
      )
    );
    process.exit(1);
  }
  if (compareVersion(gitVersionMatch[0], config.minGitVersion) < 0) {
    console.error(
      `Starting from an example requires git version ${config.minGitVersion} or later.`,
      "Please upgrade"
    );
    process.exit(1);
  }

  const dirName = getDirName(args.example);
  const tmpDir = `__tmp${timestamp}__`;
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
    await installDependencies(dirName);
    await initGit(dirName);
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
