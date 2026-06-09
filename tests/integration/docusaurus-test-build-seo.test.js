import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const helperModulePath = require.resolve('../../docs-src/test-build-seo.cjs');
const configModulePath = require.resolve('../../docs-src/docusaurus.config.js');

function loadFresh(modulePath) {
  delete require.cache[modulePath];
  return require(modulePath);
}

function loadFreshConfig() {
  delete require.cache[helperModulePath];
  delete require.cache[configModulePath];
  return require(configModulePath);
}

describe('Docusaurus test build SEO', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    delete require.cache[helperModulePath];
    delete require.cache[configModulePath];
  });

  test('test-build plugin injects noindex tags and rewrites canonical URLs', async () => {
    const {
      TEST_BUILD_ROBOTS_DIRECTIVES,
      applyTestBuildSeoToHtml,
      createTestBuildSeoPlugin,
    } = loadFresh(helperModulePath);

    const transformedHtml = applyTestBuildSeoToHtml(
      `<!doctype html><html><head>
<meta property="og:url" content="https://eviltester.github.io/site/docs/intro">
<link rel="canonical" href="https://eviltester.github.io/site/docs/intro">
<link rel="alternate" href="https://eviltester.github.io/site/docs/intro" hreflang="en">
</head><body></body></html>`,
      {
        canonicalSiteUrl: 'https://anywaydata.com',
        docsBaseUrl: '/site/',
      },
    );

    expect(transformedHtml).toContain('<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">');
    expect(transformedHtml).toContain('<meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet">');
    expect(transformedHtml).toContain('<meta name="bingbot" content="noindex,nofollow,noarchive,nosnippet">');
    expect(transformedHtml).toContain('content="https://anywaydata.com/docs/intro"');
    expect(transformedHtml).toContain('href="https://anywaydata.com/docs/intro"');

    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docusaurus-test-build-seo-'));
    const htmlPath = path.join(outDir, 'index.html');
    const sitemapPath = path.join(outDir, 'sitemap.xml');

    fs.writeFileSync(
      htmlPath,
      '<!doctype html><html><head><link rel="canonical" href="https://eviltester.github.io/site/"></head><body></body></html>',
      'utf8',
    );
    fs.writeFileSync(sitemapPath, '<xml></xml>', 'utf8');

    const pluginFactory = createTestBuildSeoPlugin({
      canonicalSiteUrl: 'https://anywaydata.com',
      docsBaseUrl: '/site/',
    });
    const plugin = pluginFactory();

    await plugin.postBuild({ outDir });

    const nextHtml = fs.readFileSync(htmlPath, 'utf8');
    expect(nextHtml).toContain('href="https://anywaydata.com/"');
    expect(fs.existsSync(sitemapPath)).toBe(false);
  });

  test('docusaurus config enables plugin for test builds', () => {
    process.env.DOCS_TEST_BUILD = 'true';
    const config = loadFreshConfig();

    expect(config.noIndex).toBe(true);
    expect(config.plugins).toHaveLength(1);
    expect(typeof config.plugins[0]).toBe('function');
  });

  test('test-build detection defaults to disabled when env flag is absent', () => {
    const { isDocsTestBuild } = loadFresh(helperModulePath);

    expect(isDocsTestBuild({})).toBe(false);
    expect(isDocsTestBuild({ DOCS_TEST_BUILD: 'false' })).toBe(false);
  });
});
