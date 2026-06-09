const fs = require('node:fs');
const path = require('node:path');

const TEST_BUILD_ROBOTS_DIRECTIVES = 'noindex,nofollow,noarchive,nosnippet';
const TEST_BUILD_BOT_NAMES = ['robots', 'googlebot', 'bingbot'];
const TEST_BUILD_INDICATOR_STYLE = `<style data-testenv-indicator>
body::before {
  content: "Test Environment";
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 2147483647;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(110, 35, 12, 0.35);
  border-radius: 999px;
  background: rgba(255, 244, 214, 0.96);
  color: #6e230c;
  box-shadow: 0 10px 24px rgba(110, 35, 12, 0.18);
  font: 700 12px/1.2 Arial, Helvetica, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  pointer-events: none;
}
</style>`;

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

function upsertHeadStyle(html, markerAttribute, styleTag) {
  const stylePattern = new RegExp(`<style[^>]*${escapeRegExp(markerAttribute)}[^>]*>[\\s\\S]*?<\\/style>`, 'i');

  if (stylePattern.test(html)) {
    return html.replace(stylePattern, styleTag);
  }

  return html.replace('</head>', `${styleTag}\n</head>`);
}

function stripBasePathFromPathname(pathname, docsBaseUrl = '/') {
  const normalizedBasePath = `/${String(docsBaseUrl || '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

  if (normalizedBasePath !== '/' && pathname.startsWith(normalizedBasePath)) {
    const stripped = pathname.slice(normalizedBasePath.length - 1);
    return stripped.startsWith('/') ? stripped : `/${stripped}`;
  }

  return pathname || '/';
}

function hasDocsBasePath(pathname, docsBaseUrl = '/') {
  const normalizedPathname = pathname || '/';
  const normalizedBasePath = `/${String(docsBaseUrl || '/').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

  if (normalizedBasePath === '/') {
    return true;
  }

  return normalizedPathname === normalizedBasePath.slice(0, -1) || normalizedPathname.startsWith(normalizedBasePath);
}

function toProductionCanonicalUrl(sourceUrl, canonicalSiteUrl, docsBaseUrl = '/') {
  const currentUrl = new URL(sourceUrl);
  const canonicalPath = stripBasePathFromPathname(currentUrl.pathname, docsBaseUrl);
  return new URL(canonicalPath, canonicalSiteUrl).toString();
}

function maybeToProductionCanonicalUrl(sourceUrl, canonicalSiteUrl, docsBaseUrl = '/') {
  const currentUrl = new URL(sourceUrl);

  if (!hasDocsBasePath(currentUrl.pathname, docsBaseUrl)) {
    return sourceUrl;
  }

  return toProductionCanonicalUrl(sourceUrl, canonicalSiteUrl, docsBaseUrl);
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

function rewriteJsonLdUrls(jsonValue, transformUrl) {
  if (Array.isArray(jsonValue)) {
    return jsonValue.map((item) => rewriteJsonLdUrls(item, transformUrl));
  }

  if (!jsonValue || typeof jsonValue !== 'object') {
    if (typeof jsonValue !== 'string') {
      return jsonValue;
    }

    try {
      return transformUrl(jsonValue);
    } catch {
      return jsonValue;
    }
  }

  return Object.fromEntries(
    Object.entries(jsonValue).map(([key, value]) => [key, rewriteJsonLdUrls(value, transformUrl)]),
  );
}

function replaceJsonLdScriptUrls(html, transformUrl) {
  return html.replace(
    /(<script[^>]+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, prefix, jsonText, suffix) => {
      try {
        const parsedJson = JSON.parse(jsonText);
        const rewrittenJson = rewriteJsonLdUrls(parsedJson, transformUrl);
        return `${prefix}${JSON.stringify(rewrittenJson)}${suffix}`;
      } catch {
        return match;
      }
    },
  );
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

  nextHtml = upsertHeadStyle(nextHtml, 'data-testenv-indicator', TEST_BUILD_INDICATOR_STYLE);

  nextHtml = replaceUrlAttributeValues(
    nextHtml,
    /(<meta[^>]+property=["']og:url["'][^>]+content=)(["'])([^"']+)\2([^>]*>)/gi,
    (urlValue) => maybeToProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
  );

  nextHtml = replaceUrlAttributeValues(
    nextHtml,
    /(<link[^>]+rel=["']canonical["'][^>]+href=)(["'])([^"']+)\2([^>]*>)/gi,
    (urlValue) => maybeToProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
  );

  nextHtml = replaceUrlAttributeValues(
    nextHtml,
    /(<link[^>]+rel=["']alternate["'][^>]+href=)(["'])([^"']+)\2([^>]*>)/gi,
    (urlValue) => maybeToProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
  );

  nextHtml = replaceJsonLdScriptUrls(nextHtml, (urlValue) =>
    maybeToProductionCanonicalUrl(urlValue, canonicalSiteUrl, docsBaseUrl),
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
  TEST_BUILD_INDICATOR_STYLE,
  TEST_BUILD_ROBOTS_DIRECTIVES,
  applyTestBuildSeoToHtml,
  createTestBuildSeoPlugin,
  isDocsTestBuild,
  maybeToProductionCanonicalUrl,
  toProductionCanonicalUrl,
};
