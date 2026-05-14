const path = require('node:path');

/** @type {import('@storybook/react-vite').StorybookConfig} */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    '../../../packages/react/src/**/*.stories.@(ts|tsx)',
  ],

  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@ds/tokens': path.resolve(__dirname, '../../../packages/tokens/src'),
      '@ds/react': path.resolve(__dirname, '../../../packages/react/src'),
    };

    return viteConfig;
  },

  docs: {
    autodocs: 'tag',
  },
};

module.exports = config;