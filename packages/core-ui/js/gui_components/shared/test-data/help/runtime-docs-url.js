const PRODUCTION_SITE_ORIGIN = 'https://anywaydata.com';

function getGithubPagesRepoBasePath(pathname = '/') {
  const segments = String(pathname || '/')
    .split('/')
    .filter(Boolean);
  if (segments.length === 0) {
    return '';
  }
  return `/${segments[0]}`;
}

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/u, '');
}

function normaliseOwnedSitePath(url) {
  const value = String(url || '').trim();
  if (!value) {
    return '';
  }

  if (value === PRODUCTION_SITE_ORIGIN || value === `${PRODUCTION_SITE_ORIGIN}/`) {
    return '/';
  }

  if (value.startsWith('/docs/')) {
    return value;
  }

  if (value.startsWith('docs/')) {
    return `/${value}`;
  }

  if (value === '/blog' || value.startsWith('/blog/')) {
    return value;
  }

  if (value === 'blog' || value.startsWith('blog/')) {
    return `/${value}`;
  }

  try {
    const parsed = new URL(value);
    if (trimTrailingSlash(parsed.origin).toLowerCase() !== PRODUCTION_SITE_ORIGIN) {
      return '';
    }
    if (
      parsed.pathname === '/' ||
      parsed.pathname.startsWith('/docs/') ||
      parsed.pathname === '/blog' ||
      parsed.pathname.startsWith('/blog/')
    ) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return '';
  }

  return '';
}

function resolveRuntimeSiteUrl(url, { windowObj } = {}) {
  const value = String(url || '').trim();
  if (!value) {
    return '';
  }

  const sitePath = normaliseOwnedSitePath(value);
  if (!sitePath) {
    return value;
  }

  const location = windowObj?.location;
  if (!location?.origin) {
    return value;
  }
  if (!/^https?:\/\//i.test(String(location.origin || '').trim())) {
    return value;
  }

  const hostname = String(location.hostname || '').toLowerCase();
  if (hostname === 'github.io' || hostname.endsWith('.github.io')) {
    const repoBasePath = getGithubPagesRepoBasePath(location.pathname || '/');
    const siteBasePath = `${repoBasePath}/site`;
    return `${location.origin}${siteBasePath}${sitePath === '/' ? '/' : sitePath}`;
  }

  return `${location.origin}${sitePath}`;
}

function resolveRuntimeDocsUrl(url, options = {}) {
  const value = String(url || '').trim();
  if (!value) {
    return '';
  }

  const sitePath = normaliseOwnedSitePath(value);
  if (!sitePath || (!sitePath.startsWith('/docs/') && sitePath !== '/docs')) {
    return value;
  }

  return resolveRuntimeSiteUrl(value, options);
}

function rewriteRuntimeSiteLinksHtml(html, { documentObj, windowObj } = {}) {
  const value = String(html || '');
  if (!value || !documentObj?.createElement) {
    return value;
  }

  const wrapper = documentObj.createElement('div');
  wrapper.innerHTML = value;

  wrapper.querySelectorAll('a[href]').forEach((anchor) => {
    const resolvedHref = resolveRuntimeSiteUrl(anchor.getAttribute('href') || '', { windowObj });
    if (resolvedHref) {
      anchor.setAttribute('href', resolvedHref);
    }
  });

  return wrapper.innerHTML;
}

export { resolveRuntimeDocsUrl, resolveRuntimeSiteUrl, rewriteRuntimeSiteLinksHtml };
