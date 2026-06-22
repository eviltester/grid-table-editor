const PRODUCTION_SITE_ORIGIN = 'https://anywaydata.com';

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/u, '');
}

function ensureLeadingSlash(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return '/';
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeRootedHref(value, fallback = '/') {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return fallback;
  }
  if (trimmed === '/') {
    return '/';
  }
  const rooted = ensureLeadingSlash(trimmed);
  return rooted.endsWith('/') && rooted.length > 1 ? rooted.slice(0, -1) : rooted;
}

function normalizeLandingHref(value, fallback = '/') {
  const trimmed = String(value || '').trim();
  if (!trimmed || trimmed === '/') {
    return fallback;
  }
  const rooted = ensureLeadingSlash(trimmed);
  return rooted.endsWith('/') ? rooted : `${rooted}/`;
}

function normalizeUrlBase(value, fallback) {
  const trimmed = trimTrailingSlash(value);
  return trimmed || trimTrailingSlash(fallback);
}

function normalizeDocsPath(path = '') {
  const trimmed = String(path || '')
    .trim()
    .replace(/^\/+/u, '');
  if (!trimmed) {
    return '';
  }
  if (trimmed === 'docs') {
    return '';
  }
  return trimmed.startsWith('docs/') ? trimmed.slice('docs/'.length) : trimmed;
}

function normalizeBlogPath(path = '') {
  const trimmed = String(path || '')
    .trim()
    .replace(/^\/+/u, '');
  if (!trimmed) {
    return '';
  }
  if (trimmed === 'blog') {
    return '';
  }
  return trimmed.startsWith('blog/') ? trimmed.slice('blog/'.length) : trimmed;
}

function buildUrl(baseUrl, path = '') {
  const normalizedBaseUrl = normalizeUrlBase(baseUrl, PRODUCTION_SITE_ORIGIN);
  const normalizedPath = String(path || '')
    .trim()
    .replace(/^\/+/u, '');
  if (!normalizedPath) {
    return normalizedBaseUrl;
  }
  return `${normalizedBaseUrl}/${normalizedPath}`;
}

function resolveOwnedSiteUrl(value, siteConfig) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return '';
  }

  if (
    trimmed.startsWith(siteConfig.docsBaseUrl) ||
    trimmed.startsWith(siteConfig.blogBaseUrl) ||
    trimmed === siteConfig.siteOrigin ||
    trimmed.startsWith(`${siteConfig.siteOrigin}/`)
  ) {
    return trimmed;
  }

  if (trimmed === PRODUCTION_SITE_ORIGIN || trimmed === `${PRODUCTION_SITE_ORIGIN}/`) {
    return siteConfig.siteOrigin;
  }

  if (trimmed === '/docs' || trimmed === 'docs') {
    return siteConfig.buildDocsUrl();
  }
  if (trimmed.startsWith('/docs/') || trimmed.startsWith('docs/')) {
    return siteConfig.buildDocsUrl(trimmed);
  }

  if (trimmed === '/blog' || trimmed === 'blog') {
    return siteConfig.buildBlogUrl();
  }
  if (trimmed.startsWith('/blog/') || trimmed.startsWith('blog/')) {
    return siteConfig.buildBlogUrl(trimmed);
  }

  if (trimmed.startsWith(`${PRODUCTION_SITE_ORIGIN}/docs`)) {
    const url = new URL(trimmed);
    const relativePath = `${url.pathname}${url.search}${url.hash}`;
    return siteConfig.buildDocsUrl(relativePath);
  }

  if (trimmed.startsWith(`${PRODUCTION_SITE_ORIGIN}/blog`)) {
    const url = new URL(trimmed);
    const relativePath = `${url.pathname}${url.search}${url.hash}`;
    return siteConfig.buildBlogUrl(relativePath);
  }

  return trimmed;
}

function createSiteConfig({
  siteOrigin = PRODUCTION_SITE_ORIGIN,
  pageHrefs = {},
  docsIntroHref = '/docs/intro',
  blogHref = '/blog',
  docsBaseUrl,
  blogBaseUrl,
} = {}) {
  const normalizedSiteOrigin = normalizeUrlBase(siteOrigin, PRODUCTION_SITE_ORIGIN);
  const normalizedPageHrefs = Object.freeze({
    landing: normalizeLandingHref(pageHrefs.landing, '/'),
    app: normalizeRootedHref(pageHrefs.app, '/app.html'),
    generator: normalizeRootedHref(pageHrefs.generator, '/generator.html'),
    combinatorial: normalizeRootedHref(pageHrefs.combinatorial, '/combinatorial.html'),
    webmcp: normalizeRootedHref(pageHrefs.webmcp, '/webmcp.html'),
    writerSchema: normalizeRootedHref(pageHrefs.writerSchema, '/writer-schema.html'),
  });
  const normalizedDocsBaseUrl = normalizeUrlBase(docsBaseUrl, `${normalizedSiteOrigin}/docs`);
  const normalizedBlogBaseUrl = normalizeUrlBase(blogBaseUrl, `${normalizedSiteOrigin}/blog`);
  const normalizedDocsIntroHref = normalizeRootedHref(docsIntroHref, '/docs/intro');
  const normalizedBlogHref = normalizeRootedHref(blogHref, '/blog');

  const siteConfig = {
    siteOrigin: normalizedSiteOrigin,
    pageHrefs: normalizedPageHrefs,
    rootedSiteHrefs: Object.freeze({
      ...normalizedPageHrefs,
      docsIntro: normalizedDocsIntroHref,
      blog: normalizedBlogHref,
    }),
    docsIntroHref: normalizedDocsIntroHref,
    blogHref: normalizedBlogHref,
    docsBaseUrl: normalizedDocsBaseUrl,
    blogBaseUrl: normalizedBlogBaseUrl,
    buildDocsUrl(path = '') {
      return buildUrl(normalizedDocsBaseUrl, normalizeDocsPath(path));
    },
    buildBlogUrl(path = '') {
      return buildUrl(normalizedBlogBaseUrl, normalizeBlogPath(path));
    },
    resolveOwnedSiteUrl(value) {
      return resolveOwnedSiteUrl(value, siteConfig);
    },
  };

  return Object.freeze(siteConfig);
}

function serializeSiteConfigModuleSource(siteConfigInput, { coreModuleUrl }) {
  return `import { createSiteConfig } from ${JSON.stringify(coreModuleUrl)};

const siteConfig = createSiteConfig(${JSON.stringify(siteConfigInput, null, 2)});
const pageHrefs = siteConfig.pageHrefs;
const rootedSiteHrefs = siteConfig.rootedSiteHrefs;
const buildDocsUrl = (...args) => siteConfig.buildDocsUrl(...args);
const buildBlogUrl = (...args) => siteConfig.buildBlogUrl(...args);
const resolveOwnedSiteUrl = (...args) => siteConfig.resolveOwnedSiteUrl(...args);

export { siteConfig, pageHrefs, rootedSiteHrefs, buildDocsUrl, buildBlogUrl, resolveOwnedSiteUrl };
export default siteConfig;
`;
}

export { PRODUCTION_SITE_ORIGIN, createSiteConfig, resolveOwnedSiteUrl, serializeSiteConfigModuleSource };
