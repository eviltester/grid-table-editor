import siteConfig from '../../../../../packages/core-ui/js/site/site-config.production.js';
import { createSiteConfig } from '../../../../../packages/core-ui/js/site/site-config-core.js';
import { createSiteLinkPlaceholderMap, transformStandaloneHtmlWithSiteConfig } from '../../../site-config-html.mjs';

describe('site config html transform', () => {
  test('creates placeholder map from production config', () => {
    const placeholderMap = createSiteLinkPlaceholderMap(siteConfig);

    expect(placeholderMap['%ANYWAYDATA_APP_HREF%']).toBe('/app.html');
    expect(placeholderMap['%ANYWAYDATA_DOCS_INTRO_HREF%']).toBe('/docs/intro');
  });

  test('transforms standalone html placeholders with config-authored links', () => {
    const overrideConfig = createSiteConfig({
      siteOrigin: 'https://eviltester.github.io/grid-table-editor',
      pageHrefs: {
        landing: '/grid-table-editor/',
        app: '/grid-table-editor/app.html',
      },
      docsIntroHref: '/grid-table-editor/site/docs/intro',
      blogHref: '/grid-table-editor/site/blog',
    });

    const html = `
      <div class="header">
        <a href="%ANYWAYDATA_HOME_HREF%">Home</a>
        <a href="%ANYWAYDATA_APP_HREF%">App</a>
        <a href="%ANYWAYDATA_DOCS_INTRO_HREF%">Docs</a>
        <a href="%ANYWAYDATA_BLOG_HREF%">Blog</a>
      </div>
    `;

    const transformed = transformStandaloneHtmlWithSiteConfig(html, overrideConfig);

    expect(transformed).toContain('href="/grid-table-editor/"');
    expect(transformed).toContain('href="/grid-table-editor/app.html"');
    expect(transformed).toContain('href="/grid-table-editor/site/docs/intro"');
    expect(transformed).toContain('href="/grid-table-editor/site/blog"');
  });
});
