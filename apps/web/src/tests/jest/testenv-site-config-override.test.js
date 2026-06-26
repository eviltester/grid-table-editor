import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import storybookConfig, { resolveStorybookSiteConfigModulePath } from '../../../../../.storybook/main.js';
import {
  createSiteConfigOverrideBuildEnv,
  createTestEnvSiteConfigInput,
  writeGeneratedTestEnvSiteConfigOverride,
} from '../../../../../scripts/create-testenv.mjs';

describe('testenv site-config override generation', () => {
  test('builds testenv site-config input with repo-base pages and nested site docs/blog paths', () => {
    const siteConfigInput = createTestEnvSiteConfigInput({
      repositoryName: 'grid-table-editor',
    });

    expect(siteConfigInput.pageHrefs.app).toBe('/grid-table-editor/app.html');
    expect(siteConfigInput.pageHrefs.webmcp).toBe('/grid-table-editor/webmcp.html');
    expect(siteConfigInput.docsIntroHref).toBe('/grid-table-editor/site/docs/intro');
    expect(siteConfigInput.blogHref).toBe('/grid-table-editor/site/blog');
    expect(siteConfigInput.docsBaseUrl).toBe('https://eviltester.github.io/grid-table-editor/site/docs');
  });

  test('writes an override module that bakes in the expected built link values', async () => {
    const overridePath = path.join(process.cwd(), 'testenv-site-config.override.test.mjs');

    try {
      await writeGeneratedTestEnvSiteConfigOverride(overridePath, {
        repositoryName: 'grid-table-editor',
      });

      const source = await readFile(overridePath, 'utf8');
      expect(source).toContain('/grid-table-editor/app.html');
      expect(source).toContain('/grid-table-editor/site/docs/intro');
      expect(source).toContain('https://eviltester.github.io/grid-table-editor/site/docs');
    } finally {
      await rm(overridePath, { force: true });
    }
  });

  test('exposes the site-config override env used by testenv app and storybook builds', () => {
    const overridePath = path.join(process.cwd(), 'testenv', '_site-config.override.mjs');

    expect(createSiteConfigOverrideBuildEnv(overridePath)).toEqual({
      ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH: overridePath,
    });
  });

  test('storybook resolves the same site-config override alias as the main app build', async () => {
    const originalOverridePath = process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH;
    const overridePath = path.join(process.cwd(), 'testenv', '_site-config.override.mjs');

    try {
      delete process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH;
      expect(resolveStorybookSiteConfigModulePath()).toBe(
        path.resolve(process.cwd(), 'packages/core-ui/js/site/site-config.production.js')
      );

      process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH = overridePath;
      expect(resolveStorybookSiteConfigModulePath()).toBe(overridePath);

      const viteConfig = await storybookConfig.viteFinal({});
      expect(viteConfig.resolve.alias['@anywaydata/site-config']).toBe(overridePath);
    } finally {
      if (originalOverridePath === undefined) {
        delete process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH;
      } else {
        process.env.ANYWAYDATA_SITE_CONFIG_OVERRIDE_PATH = originalOverridePath;
      }
    }
  });
});
