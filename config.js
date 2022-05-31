const starters = [
  {
    name: "nextjs",
    repoUrl: "https://github.com/stackbit-themes/nextjs-starter",
  },
  {
    name: "ts-nextjs",
    repoUrl: "https://github.com/stackbit-themes/ts-mui-nextjs-starter",
  },
  {
    name: "contentful",
    repoUrl: "https://github.com/stackbit-themes/contentful-starter",
  },
];

const examples = {
  repoUrl: "https://github.com/stackbit-themes/stackbit-examples",
  directories: [
    "algolia-search",
    "dynamic-app",
    "sb-countdown",
    "sb-typist",
    "tutorial-contentful",
  ],
};

export default {
  defaults: { dirName: "my-stackbit-site", starter: starters[0] },
  minGitVersion: "2.25.0",
  examples,
  starters,
};
