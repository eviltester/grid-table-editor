import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import {
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
});
