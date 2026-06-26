import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transformStandaloneHtmlWithSiteConfig } from './site-config-html.mjs';
import { resolveBuildVersion } from '../../packages/core-ui/js/build-metadata/build-metadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultSiteConfigModulePath = path.resolve(__dirname, '../../packages/core-ui/js/site/site-config.production.js');

function resolveSiteConfigModulePath() {
  return process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH
    ? path.resolve(process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH)
    : defaultSiteConfigModulePath;
}

function resolveWebBuildVersion(env = process.env, date = new Date()) {
  return resolveBuildVersion({
    configuredVersion: env.ANYWAYDATA_BUILD_VERSION,
    date,
  });
}

export default defineConfig(async () => {
  const siteConfigModulePath = resolveSiteConfigModulePath();
  const siteConfigModule = await import(pathToFileURL(siteConfigModulePath).href);
  const siteConfig = siteConfigModule.siteConfig || siteConfigModule.default;
  const buildVersion = resolveWebBuildVersion();

  return {
    root: __dirname,
    define: {
      'globalThis.__ANYWAYDATA_BUILD_VERSION__': JSON.stringify(buildVersion),
    },
    resolve: {
      alias: [
        { find: /^@anywaydata\/core$/, replacement: path.resolve(__dirname, '../../packages/core/src/index.js') },
        {
          find: /^@anywaydata\/core\/mcp\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/mcp/$1'),
        },
        {
          find: /^@anywaydata\/core\/faker\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/faker/$1'),
        },
        {
          find: /^@anywaydata\/core\/domain\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/domain/$1'),
        },
        {
          find: /^@anywaydata\/core\/command-help\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/command-help/$1'),
        },
        {
          find: /^@anywaydata\/core\/data_formats\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/data_formats/$1'),
        },
        {
          find: /^@anywaydata\/core\/data_generation\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/data_generation/$1'),
        },
        {
          find: /^@anywaydata\/core\/grid\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/grid/$1'),
        },
        {
          find: /^@anywaydata\/core\/utils\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/utils/$1'),
        },
        {
          find: /^@anywaydata\/core\/libs\/(.*)$/,
          replacement: path.resolve(__dirname, '../../packages/core/js/libs/$1'),
        },
        {
          find: /^@anywaydata\/site-config$/,
          replacement: siteConfigModulePath,
        },
      ],
    },
    plugins: [
      {
        name: 'anywaydata-site-config-html-transform',
        transformIndexHtml(html) {
          return transformStandaloneHtmlWithSiteConfig(html, siteConfig);
        },
      },
    ],
    server: {
      host: '127.0.0.1',
      port: 4173,
      strictPort: true,
    },
    preview: {
      host: '127.0.0.1',
      port: 4173,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          app: path.resolve(__dirname, 'app.html'),
          generator: path.resolve(__dirname, 'generator.html'),
          webmcp: path.resolve(__dirname, 'webmcp.html'),
          combinatorial: path.resolve(__dirname, 'combinatorial.html'),
          writerSchema: path.resolve(__dirname, 'writer-schema.html'),
        },
      },
    },
  };
});

export { resolveSiteConfigModulePath, resolveWebBuildVersion };
