#!/usr/bin/env node

import readline from "readline";
import { exec } from "child_process";
import util from "util";
import chalk from "chalk";

/* --- Helpers --- */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question, defaultAnswer) {
  return new Promise((resolve) => {
    const questionText = `${chalk.bold(question)} (${defaultAnswer}): `;
    rl.question(questionText, (input) => resolve(input || defaultAnswer));
  });
}

const run = util.promisify(exec);

/* --- User Input --- */

const projectName = await prompt("Project Name", "my-stackbit-site");
const repoName = await prompt("GitHub Repo", "stackbit/nextjs-starter");

/* --- Run --- */

// Clone repo
const repoUrl = `https://github.com/${repoName}`;
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

/* --- Clean Up --- */

rl.close();
