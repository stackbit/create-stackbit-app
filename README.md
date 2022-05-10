# create-stackbit-app

Run `npx create-stackbit-app` in your terminal to create a new Stackbit application or add Stackbit into an existing site.

## Usage

To create a new Stackbit project from a starter, run the following command:

```txt
npx create-stackbit-app [dir]
```

To see a full list of options use the `--help` flag:

```txt
> npx create-stackbit-app --help

Options:
      --version  Show version number                                   [boolean]
  -s, --starter  Choose a starter           [choices: "nextjs", "ts-nextjs"]
      --help     Show help                                             [boolean]
```

### Choosing a Starter

Use the `--starter` option for specifying a starter. Run the command with the `--help` flag to see a full list of available starters.

```txt
npx create-stackbit-app --starter ts-nextjs
```

If no starter option is provided, [the default starter](https://github.com/stackbit-themes/nextjs-starter) is used.

### Setting Project Directory

Pass a directory name as the only argument when running the command. For example, if you wanted your directory to be name `my-site`, the command would look something like this:

```txt
npx create-stackbit-app my-site
```

If no name is provided, the directory will be `my-stackbit-site-[id]`, where `[id]` is a randomly-generated string used to avoid directory conflicts.

## Adding Stackbit to Existing Projects

The script detects when you may be working with an existing project (it looks for a `package.json` file in the working directory).

If in an existing project, the script asks if you'd like to add Stackbit to the project. Today, this only prints a resource URL. If you choose _no_, the command exits.
