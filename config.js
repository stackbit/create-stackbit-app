const starters = [
  {
    name: 'nextjs',
    repoUrl: 'https://github.com/stackbit-themes/nextjs-starter',
  },
  {
    name: 'ts-nextjs',
    repoUrl: 'https://github.com/stackbit-themes/ts-mui-nextjs-starter',
  },
  {
    name: 'contentful',
    repoUrl: 'https://github.com/stackbit-themes/nextjs-contentful-starter',
  },
  {
    name: 'full-nextjs',
    repoUrl: 'https://github.com/stackbit-themes/starter-nextjs-theme',
  },
  {
    name: 'small-biz-nextjs',
    repoUrl: 'https://github.com/stackbit-themes/small-business-nextjs-theme',
  },
  {
    name: 'personal-nextjs',
    repoUrl: 'https://github.com/stackbit-themes/personal-nextjs-theme',
  },
];

const examples = {
  repoUrl: 'https://github.com/stackbit-themes/stackbit-examples',
  directories: [
    'airtable-content-source',
    'algolia-search',
    'angular-contentful',
    'chakra-ui',
    'cloudinary-contentful',
    'contentlayer',
    'documentation',
    'hydrogen-contentful-demo-store',
    'ninetailed-personalization',
    'onboarding-webapp',
    'sveltekit-contentful',
    'tutorial-html-contentful',
    'tutorial-html-json',
    'tutorial-nextjs-contentful',
    'tutorial-nextjs-files',
  ],
};

export default {
  defaults: { dirName: 'my-stackbit-site', starter: starters[0] },
  minGitVersion: '2.25.0',
  examples,
  starters,
};
