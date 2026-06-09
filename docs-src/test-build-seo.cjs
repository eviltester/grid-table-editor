const fs = require('node:fs');
const path = require('node:path');

const TEST_BUILD_ROBOTS_DIRECTIVES = 'noindex,nofollow,noarchive,nosnippet';
const TEST_BUILD_BOT_NAMES = ['robots', 'googlebot', 'bingbot'];

function isDocsTestBuild(env = process.env) {
  return String(env.DOCS_TEST_BUILD || '').toLowerCase() === 'true';
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertMetaTag(html, name, content) {
  const metaPattern = new RegExp(`<meta[^>]+name=["']${escapeRegExp(name)}["'][^>]*>`, 'i');
  const tag = `<meta name="${name}" content="${content}">`;

  if (metaPattern.test(html)) {
    return html.replace(metaPattern, tag);
  }

  return html.replace('</head>', `${tag}\n</head>`);
}

function stripBasePathFromPathname(pathname, docsBaseUrl = '/') {
  const normalizedBasePath = `/${String(docsBaseUrl || '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

  if (normalizedBasePath !== '/' && pathname.startsWith(normalizedBasePath)) {
    const stripped = pathname.slice(normalizedBasePath.length - 1);
    return stripped.startsWith('/') ? stripped : `/${stripped}`;
  }

  return pathname || '/';
}

function toProductionCanonicalUrl(sourceUrl, canonicalSiteUrl, docsBaseUrl = '/') {
  const currentUrl = new URL(sourceUrl);
  const canonicalPath = stripBasePathFromPathname(currentUrl.pathname, docsBaseUrl);
  return new URL(canonicalPath, canonicalSiteUrl).toString();
}

function replaceUrlAttributeValues(html, attributePattern, transformUrl) {
  return html.replace(attributePattern, (match, prefix, quote, urlValue, suffix = '') => {
    try {
      const nextUrl = transformUrl(urlValue);
      return `${prefix}${quote}${nextUrl}${quote}${suffix}`;
    } catch {
      return match;
    }
  });
}

function applyTestBuildSeoToHtml(
  html,
  {
    canonicalSiteUrl = 'https://anywaydata.com',
    docsBaseUrl = '/',
    robotsDirectives = TEST_BUILD_ROBOTS_DIRECTIVES,
  } = {},
) {
  let nextHtml = html;

  for (const botName of TEST_BUILD_BOT_NAMES) {
    nextHtml = upsertMetaTag(nextHtml, botName, robotsDirectives);
  }

  nextHtml = replaceUrlAttributeValues(
    nextHtml,
    /(<meta[^>]+property=["']og:url["'][^>]+content=)(["'])([^"']+)\2([^>]*>)/gi,
    (urlValue) => toProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
  );

  nextHtml = replaceUrlAttributeValues(
    nextHtml,
    /(<link[^>]+rel=["']canonical["'][^>]+href=)(["'])([^"']+)\2([^>]*>)/gi,
    (urlValue) => toProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
  );

  nextHtml = replaceUrlAttributeValues(
    nextHtml,
    /(<link[^>]+rel=["']alternate["'][^>]+href=)(["'])([^"']+)\2([^>]*>)/gi,
    (urlValue) => toProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
  );

  return nextHtml;
}

function collectHtmlFiles(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const htmlFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      htmlFiles.push(...collectHtmlFiles(fullPath));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }

  return htmlFiles;
}

function createTestBuildSeoPlugin({
  canonicalSiteUrl = 'https://anywaydata.com',
  docsBaseUrl = '/',
  robotsDirectives = TEST_BUILD_ROBOTS_DIRECTIVES,
} = {}) {
  return function testBuildSeoPlugin() {
    return {
      name: 'test-build-seo-plugin',
      async postBuild({ outDir }) {
        for (const htmlFile of collectHtmlFiles(outDir)) {
          const html = fs.readFileSync(htmlFile, 'utf8');
          const nextHtml = applyTestBuildSeoToHtml(html, {
            canonicalSiteUrl,
            docsBaseUrl,
            robotsDirectives,
          });
          fs.writeFileSync(htmlFile, nextHtml, 'utf8');
        }

        const sitemapPath = path.join(outDir, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
          fs.rmSync(sitemapPath, { force: true });
        }
      },
    };
  };
}

module.exports = {
  TEST_BUILD_BOT_NAMES,
  TEST_BUILD_ROBOTS_DIRECTIVES,
  applyTestBuildSeoToHtml,
  createTestBuildSeoPlugin,
  isDocsTestBuild,
  toProductionCanonicalUrl,
};
