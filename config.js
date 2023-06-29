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
];

const examples = {
  repoUrl: 'https://github.com/stackbit-themes/stackbit-examples',
  directories: [
    'ab-testing',
    'airtable-content-source',
    'algolia-search',
    'angular-contentful',
    'auto-annotated-portfolio',
    'chakra-ui',
    'cloudinary-contentful',
    'cloudinary-unpic',
    'contentlayer',
    'documentation',
    'gatsby-contentful',
    'hydrogen-contentful-demo-store',
    'i18n-nextjs-contentful',
    'ninetailed-personalization',
    'nuxt3-preview',
    'onboarding-webapp',
    'sveltekit-contentful',
    'tutorial-gatsby-contentful',
    'tutorial-html-contentful',
    'tutorial-html-json',
    'tutorial-nextjs-contentful',
    'tutorial-nextjs-files',
    'unsplash-asset-source',
  ],
};

export default {
  defaults: { dirName: 'my-stackbit-site', starter: starters[0] },
  minGitVersion: '2.25.0',
  examples,
  starters,
};
