#!/usr/bin/env node

import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import util from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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

const args = yargs(hideBin(process.argv)).parse();

/* --- New Project --- */

async function cloneStarter() {
  // Clone repo
  const projectName = args._[0] ?? "my-stackbit-site";
  const repoUrl = `https://github.com/stackbit/nextjs-starter`;
  const cloneCommand = `git clone --depth=1 ${repoUrl} ${projectName}`;
  console.log(`\nCloning into ${projectName} ...`);
  await run(cloneCommand);

  // Install dependencies
  console.log(`Installing dependencies ...`);
  await run(`cd ${projectName} && npm install`);

  // Output next steps:
  console.log(`
🎉 ${chalk.bold("Welcome to Stackbit!")} 🎉

Run the following commands:

  cd ${projectName}
  npm run dev

When your dev server boots, you'll see an ${chalk.bgYellow.black.bold(
    " app.stackbit.com "
  )} URL in the logs.
Open this URL in your browser and start building!
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
