import { createSiteConfig } from '../../../js/site/site-config-core.js';
import productionSiteConfigModule, {
  buildDocsUrl,
  resolveOwnedSiteUrl,
} from '../../../js/site/site-config.production.js';

describe('site config', () => {
  test('production config returns the current live urls', () => {
    expect(productionSiteConfigModule.rootedSiteHrefs.app).toBe('/app.html');
    expect(productionSiteConfigModule.rootedSiteHrefs.docsIntro).toBe('/docs/intro');
    expect(productionSiteConfigModule.rootedSiteHrefs.blog).toBe('/blog');
    expect(buildDocsUrl('test-data/domain/number')).toBe('https://anywaydata.com/docs/test-data/domain/number');
  });

  test('override config returns repo-base page links and nested site docs links', () => {
    const siteConfig = createSiteConfig({
      siteOrigin: 'https://eviltester.github.io/grid-table-editor',
      pageHrefs: {
        landing: '/grid-table-editor/',
        app: '/grid-table-editor/app.html',
        generator: '/grid-table-editor/generator.html',
        combinatorial: '/grid-table-editor/combinatorial.html',
        webmcp: '/grid-table-editor/webmcp.html',
        writerSchema: '/grid-table-editor/writer-schema.html',
      },
      docsIntroHref: '/grid-table-editor/site/docs/intro',
      blogHref: '/grid-table-editor/site/blog',
      docsBaseUrl: 'https://eviltester.github.io/grid-table-editor/site/docs',
      blogBaseUrl: 'https://eviltester.github.io/grid-table-editor/site/blog',
    });

    expect(siteConfig.rootedSiteHrefs.landing).toBe('/grid-table-editor/');
    expect(siteConfig.rootedSiteHrefs.generator).toBe('/grid-table-editor/generator.html');
    expect(siteConfig.rootedSiteHrefs.docsIntro).toBe('/grid-table-editor/site/docs/intro');
    expect(siteConfig.rootedSiteHrefs.blog).toBe('/grid-table-editor/site/blog');
  });

  test('help docs builders resolve production and testenv owned urls', () => {
    const testEnvConfig = createSiteConfig({
      siteOrigin: 'https://eviltester.github.io/grid-table-editor',
      docsBaseUrl: 'https://eviltester.github.io/grid-table-editor/site/docs',
      blogBaseUrl: 'https://eviltester.github.io/grid-table-editor/site/blog',
    });

    expect(resolveOwnedSiteUrl('https://anywaydata.com/docs/test-data/domain/number')).toBe(
      'https://anywaydata.com/docs/test-data/domain/number'
    );
    expect(testEnvConfig.resolveOwnedSiteUrl('https://anywaydata.com/docs/test-data/domain/number')).toBe(
      'https://eviltester.github.io/grid-table-editor/site/docs/test-data/domain/number'
    );
    expect(testEnvConfig.resolveOwnedSiteUrl('/blog')).toBe('https://eviltester.github.io/grid-table-editor/site/blog');
  });
});
