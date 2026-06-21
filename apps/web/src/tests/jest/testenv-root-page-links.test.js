import { rewriteTestEnvRootPageLinks } from '../../../../../scripts/create-testenv.mjs';

describe('testenv root page link rewriting', () => {
  test('rewrites docs and blog links to the nested site path', () => {
    const html = `
      <div class="header">
        <a href="docs/intro">Docs</a>
        <a href="/blog">Blog</a>
      </div>
    `;

    const rewritten = rewriteTestEnvRootPageLinks(html);

    expect(rewritten).toContain('href="./site/docs/intro"');
    expect(rewritten).toContain('href="./site/blog"');
  });

  test('rewrites anywaydata site links to the nested site path', () => {
    const html =
      '<p class="live-link">Access docs at <a href="https://anywaydata.com/docs/intro">Docs</a> and <a href="https://anywaydata.com">Home</a>.</p>';

    const rewritten = rewriteTestEnvRootPageLinks(html);

    expect(rewritten).toContain('href="./site/docs/intro"');
    expect(rewritten).toContain('href="./site/"');
  });
});
