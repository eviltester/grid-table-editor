import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import { resolveBuildVersion } from '../packages/core-ui/js/build-metadata/build-metadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultSiteConfigModulePath = path.resolve(__dirname, '../packages/core-ui/js/site/site-config.production.js');

function resolveStorybookSiteConfigModulePath(env = process.env) {
  return env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH
    ? path.resolve(env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH)
    : defaultSiteConfigModulePath;
}

function resolveStorybookBuildVersion(env = process.env, date = new Date()) {
  return resolveBuildVersion({
    configuredVersion: env.ANYWAYDATA_BUILD_VERSION,
    date,
  });
}

export default {
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  stories: ['../apps/web/src/stories/**/*.stories.js'],
  staticDirs: [{ from: '../apps/web/images', to: '/images' }],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    const siteConfigModulePath = resolveStorybookSiteConfigModulePath();
    const buildVersion = resolveStorybookBuildVersion();
    return mergeConfig(config, {
      define: {
        'globalThis.__ANYWAYDATA_BUILD_VERSION__': JSON.stringify(buildVersion),
      },
      resolve: {
        alias: {
          'https://cdn.skypack.dev/@faker-js/faker@v9.7.0': '@faker-js/faker',
          '@storybook-stories': path.resolve(__dirname, '../apps/web/src/stories'),
          '@anywaydata/core/data_formats': path.resolve(__dirname, '../packages/core/js/data_formats'),
          '@anywaydata/core/data_generation': path.resolve(__dirname, '../packages/core/js/data_generation'),
          '@anywaydata/core/grid': path.resolve(__dirname, '../packages/core/js/grid'),
          '@anywaydata/core/utils': path.resolve(__dirname, '../packages/core/js/utils'),
          '@anywaydata/core/faker': path.resolve(__dirname, '../packages/core/js/faker'),
          '@anywaydata/core/domain': path.resolve(__dirname, '../packages/core/js/domain'),
          '@anywaydata/core/command-help': path.resolve(__dirname, '../packages/core/js/command-help'),
          '@anywaydata/core/libs': path.resolve(__dirname, '../packages/core/js/libs'),
          '@anywaydata/core': path.resolve(__dirname, '../packages/core/src/index.js'),
          '@anywaydata/site-config': siteConfigModulePath,
        },
      },
    });
  },
};

export { resolveStorybookBuildVersion, resolveStorybookSiteConfigModulePath };
