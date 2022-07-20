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
  -s, --starter  Choose a starter
  [choices: "nextjs", "ts-nextjs", "contentful", "full-nextjs", "small-biz-nextj
                                                          s", "personal-nextjs"]
  -e, --example  Start from an example
  [choices: "algolia-search", "chakra-next", "dynamic-app", "sb-countdown", "sb-
                                                 typist", "tutorial-contentful"]
      --help     Show help                                             [boolean]
```

### Choosing a Starter

Use the `--starter` option for specifying a starter. Run the command with the `--help` flag to see a full list of available starters.

```txt
npx create-stackbit-app --starter ts-nextjs
```

If no starter option is provided, [the default starter](https://github.com/stackbit-themes/nextjs-starter) is used.

### Starting from an Example (🧪 Experimental)

Use the `--example` option to start a project from an example. Run the command with the `--help` flag to see a full list of available starters.

```txt
npx create-stackbit-app --example algolia-search
```

This will create a new project matching the name of the example, unless overridden (see below). [See here for a full list of starters](https://github.com/stackbit-themes/stackbit-examples).

_Note: This is an experimental feature. Please [report issues](https://github.com/stackbit/create-stackbit-app/issues/new)._

### Setting Project Directory

Pass a directory name as the only argument when running the command. For example, if you wanted your directory to be name `my-site`, the command would look something like this:

```txt
npx create-stackbit-app my-site
```

If no name is provided, the directory will be `my-stackbit-site` for starters or will match the name of the example if starting from an example. If the directory already exists, a timestamp value will be appended to the directory name to ensure uniqueness.

## Adding Stackbit to Existing Projects

The script detects when you may be working with an existing project (it looks for a `package.json` file in the working directory).

If in an existing project, the script asks if you'd like to add Stackbit to the project. Today, this only prints a resource URL. If you choose _no_, the command exits.
