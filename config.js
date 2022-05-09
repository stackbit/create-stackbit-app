const starters = [
  {
    name: "nextjs",
    repoUrl: "https://github.com/stackbit-themes/nextjs-starter",
  },
  {
    name: "ts-mui-nextjs",
    repoUrl: "https://github.com/stackbit-themes/ts-mui-nextjs-starter",
  },
];

export default {
  defaults: { dirName: "my-stackbit-site", starter: starters[0] },
  starters,
};
