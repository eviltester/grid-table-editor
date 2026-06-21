import {
  resolveRuntimeDocsUrl,
  resolveRuntimeSiteUrl,
  rewriteRuntimeSiteLinksHtml,
} from '../../../js/gui_components/shared/test-data/help/runtime-docs-url.js';
import { JSDOM } from 'jsdom';

describe('runtime site url helpers', () => {
  test('keeps production docs links on the production host', () => {
    const resolved = resolveRuntimeDocsUrl('https://anywaydata.com/docs/test-data/domain/number', {
      windowObj: {
        location: {
          origin: 'https://anywaydata.com',
          hostname: 'anywaydata.com',
          pathname: '/app.html',
        },
      },
    });

    expect(resolved).toBe('https://anywaydata.com/docs/test-data/domain/number');
  });

  test('rewrites docs links into the nested site path for github pages root pages', () => {
    const resolved = resolveRuntimeDocsUrl('/docs/test-data/domain/number', {
      windowObj: {
        location: {
          origin: 'https://eviltester.github.io',
          hostname: 'eviltester.github.io',
          pathname: '/grid-table-editor/generator.html',
        },
      },
    });

    expect(resolved).toBe('https://eviltester.github.io/grid-table-editor/site/docs/test-data/domain/number');
  });

  test('rewrites blog links into the nested site path for github pages root pages', () => {
    const resolved = resolveRuntimeSiteUrl('blog', {
      windowObj: {
        location: {
          origin: 'https://eviltester.github.io',
          hostname: 'eviltester.github.io',
          pathname: '/grid-table-editor/app.html',
        },
      },
    });

    expect(resolved).toBe('https://eviltester.github.io/grid-table-editor/site/blog');
  });

  test('keeps nested github pages site links inside the site path', () => {
    const resolved = resolveRuntimeSiteUrl('https://anywaydata.com/docs/intro', {
      windowObj: {
        location: {
          origin: 'https://eviltester.github.io',
          hostname: 'eviltester.github.io',
          pathname: '/grid-table-editor/site/docs/intro',
        },
      },
    });

    expect(resolved).toBe('https://eviltester.github.io/grid-table-editor/site/docs/intro');
  });

  test('leaves non-site urls unchanged', () => {
    expect(
      resolveRuntimeSiteUrl('https://developer.chrome.com/docs/ai/webmcp', {
        windowObj: {
          location: {
            origin: 'https://eviltester.github.io',
            hostname: 'eviltester.github.io',
            pathname: '/grid-table-editor/webmcp.html',
          },
        },
      })
    ).toBe('https://developer.chrome.com/docs/ai/webmcp');
  });

  test('rewrites owned links inside rendered html snippets', () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'https://eviltester.github.io/grid-table-editor/app.html',
    });

    const rewritten = rewriteRuntimeSiteLinksHtml(
      '<p><a href="/docs/intro">Docs</a> and <a href="blog">Blog</a> and <a href="https://example.com">External</a></p>',
      {
        documentObj: dom.window.document,
        windowObj: dom.window,
      }
    );

    expect(rewritten).toContain('https://eviltester.github.io/grid-table-editor/site/docs/intro');
    expect(rewritten).toContain('https://eviltester.github.io/grid-table-editor/site/blog');
    expect(rewritten).toContain('https://example.com');
    dom.window.close();
  });
});
