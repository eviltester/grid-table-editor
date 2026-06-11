import {
  ROOT_CANONICAL_URL,
  TESTENV_CANONICAL_SITE_URL,
  applySeoDirectivesToHtml,
  createLlmsTxt,
  createSiteRobotsTxt,
  createTestenvRobotsTxt,
  renderIndexPage,
} from '../../scripts/create-testenv.mjs';

describe('create-testenv SEO helpers', () => {
  test('renders root robots.txt with blocked test subareas', () => {
    const robotsTxt = createTestenvRobotsTxt();

    expect(robotsTxt).toContain('Disallow: /app.html');
    expect(robotsTxt).toContain('Disallow: /generator.html');
    expect(robotsTxt).toContain('Disallow: /combinatorial.html');
    expect(robotsTxt).toContain('Disallow: /webmcp.html');
    expect(robotsTxt).toContain('Disallow: /storybook/');
    expect(robotsTxt).toContain('Disallow: /site/');
  });

  test('renders site robots.txt as fully disallowed', () => {
    expect(createSiteRobotsTxt()).toContain('Disallow: /');
  });

  test('renders llms.txt with production canonical guidance', () => {
    const llmsTxt = createLlmsTxt();

    expect(llmsTxt).toContain('non-production review and test deployment');
    expect(llmsTxt).toContain(ROOT_CANONICAL_URL);
    expect(llmsTxt).toContain(`${TESTENV_CANONICAL_SITE_URL}/docs/`);
  });

  test('renders landing page with noindex directives and production canonical', () => {
    const html = renderIndexPage({
      branchName: 'feature/test-seo',
      commitSha: 'abc123def456',
      buildTimestamp: '2026-06-09T10:00:00.000Z',
    });

    expect(html).toContain('<meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />');
    expect(html).toContain('<meta name="googlebot" content="noindex,nofollow,noarchive,nosnippet" />');
    expect(html).toContain('<link rel="canonical" href="https://anywaydata.com/" />');
    expect(html).toContain('content: "Test Environment"');
    expect(html).toContain('Open webmcp.html');
  });

  test('injects the test environment indicator into rewritten html pages', () => {
    const html = applySeoDirectivesToHtml('<!doctype html><html><head><title>Storybook</title></head><body></body></html>');

    expect(html).toContain('data-testenv-indicator');
    expect(html).toContain('content: "Test Environment"');
    expect(html).toContain('top: 0;');
    expect(html).toContain('left: 0;');
    expect(html).toContain('border: 0;');
    expect(html).toContain('box-shadow: none;');
    expect(html).toContain('font: 700 6px/1.2 Arial, Helvetica, sans-serif;');
  });
});
