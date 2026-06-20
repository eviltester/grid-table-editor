function getGithubPagesRepoBasePath(pathname = '/') {
  const segments = String(pathname || '/')
    .split('/')
    .filter(Boolean);
  if (segments.length === 0) {
    return '';
  }
  return `/${segments[0]}`;
}

function toDocsPath(url) {
  const value = String(url || '').trim();
  if (!value) {
    return '';
  }

  if (value.startsWith('/docs/')) {
    return value;
  }

  if (value.startsWith('docs/')) {
    return `/${value}`;
  }

  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith('/docs/')) {
      return parsed.pathname;
    }
  } catch {
    return '';
  }

  return '';
}

function resolveRuntimeDocsUrl(url, { windowObj } = {}) {
  const value = String(url || '').trim();
  if (!value) {
    return '';
  }

  const docsPath = toDocsPath(value);
  if (!docsPath) {
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
  if (hostname.endsWith('github.io')) {
    const repoBasePath = getGithubPagesRepoBasePath(location.pathname || '/');
    return `${location.origin}${repoBasePath}/site${docsPath}`;
  }

  return `${location.origin}${docsPath}`;
}

export { resolveRuntimeDocsUrl };
