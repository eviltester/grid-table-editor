import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputDir = path.join(repoRoot, 'testenv');
const storybookDir = path.join(outputDir, 'storybook');
const fullSiteDir = path.join(outputDir, 'site');
const tempWebDir = path.join(outputDir, '_web-build');
const tempWebIndex = path.join(tempWebDir, 'index.html');
const docsStaticDir = path.join(repoRoot, 'docs-src', 'static');
const docsAppPlaceholderPath = path.join(docsStaticDir, 'app.html');
const webImagesDir = path.join(repoRoot, 'apps', 'web', 'images');
const webLibsDir = path.join(repoRoot, 'apps', 'web', 'libs');
const docsAppPlaceholderHtml =
  '<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>App build placeholder</title></head><body></body></html>';
const TESTENV_ROBOTS_DIRECTIVES = 'noindex,nofollow,noarchive,nosnippet';
const TESTENV_BOT_NAMES = ['robots', 'googlebot', 'bingbot'];
const TESTENV_CANONICAL_SITE_URL = 'https://anywaydata.com';
const ROOT_CANONICAL_URL = `${TESTENV_CANONICAL_SITE_URL}/`;
const ROOT_PAGE_CANONICALS = {
  'app.html': `${TESTENV_CANONICAL_SITE_URL}/app.html`,
  'generator.html': `${TESTENV_CANONICAL_SITE_URL}/generator.html`,
  'combinatorial.html': `${TESTENV_CANONICAL_SITE_URL}/combinatorial.html`,
};
const TESTENV_INDICATOR_STYLE = `<style data-testenv-indicator>
      body::before {
        content: "Test Environment";
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2147483647;
        margin: 0;
        padding: 0.225rem 0.375rem;
        border: 0;
        border-radius: 0;
        background: rgba(255, 244, 214, 0.96);
        color: #6e230c;
        box-shadow: none;
        font: 700 6px/1.2 Arial, Helvetica, sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }
    </style>`;

function isMainModule() {
  return process.argv[1] ? fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) : false;
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: {
      ...process.env,
      ...options.env,
    },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    throw new Error(
      `Command failed: ${command} ${args.join(' ')} (status ${result.status ?? 1}${result.signal ? `, signal ${result.signal}` : ''})`,
    );
  }
}

async function clearDirectoryContents(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
  const entries = await readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    await rm(fullPath, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  }
}

function readCommandOutput(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    return '';
  }

  return String(result.stdout || '').trim();
}

function resolveBuildMetadata() {
  const branchName =
    process.env.TESTENV_BRANCH_NAME ||
    process.env.GITHUB_REF_NAME ||
    readCommandOutput('git', ['rev-parse', '--abbrev-ref', 'HEAD']) ||
    'local';

  const commitSha =
    process.env.TESTENV_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    readCommandOutput('git', ['rev-parse', '--short', 'HEAD']) ||
    'unknown';

  const buildTimestamp = process.env.TESTENV_BUILD_TIME || new Date().toISOString();

  return {
    branchName,
    commitSha: commitSha.slice(0, 12),
    buildTimestamp,
  };
}

function resolveFullSiteBaseUrl() {
  if (process.env.TESTENV_FULL_SITE_BASE_URL) {
    return process.env.TESTENV_FULL_SITE_BASE_URL;
  }

  const repositoryName = String(process.env.GITHUB_REPOSITORY || '')
    .split('/')
    .at(-1);

  if (repositoryName) {
    return `/${repositoryName}/site/`;
  }

  return '/site/';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function createMetaTag(name, content) {
  return `<meta name="${name}" content="${content}" />`;
}

function createRobotsMetaTags(robotsDirectives = TESTENV_ROBOTS_DIRECTIVES) {
  return TESTENV_BOT_NAMES.map((name) => createMetaTag(name, robotsDirectives)).join('\n    ');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertMetaTag(html, name, content) {
  const tagPattern = new RegExp(`<meta[^>]+name=["']${escapeRegExp(name)}["'][^>]*>`, 'i');
  const tag = createMetaTag(name, content);

  if (tagPattern.test(html)) {
    return html.replace(tagPattern, tag);
  }

  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertCanonicalLink(html, canonicalUrl) {
  const linkPattern = /<link[^>]+rel=["']canonical["'][^>]*>/i;
  const tag = `<link rel="canonical" href="${canonicalUrl}" />`;

  if (linkPattern.test(html)) {
    return html.replace(linkPattern, tag);
  }

  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertHeadStyle(html, markerAttribute, styleTag) {
  const stylePattern = new RegExp(`<style[^>]*${escapeRegExp(markerAttribute)}[^>]*>[\\s\\S]*?<\\/style>`, 'i');

  if (stylePattern.test(html)) {
    return html.replace(stylePattern, styleTag);
  }

  return html.replace('</head>', `${styleTag}\n  </head>`);
}

function applySeoDirectivesToHtml(
  html,
  {
    canonicalUrl = ROOT_CANONICAL_URL,
    robotsDirectives = TESTENV_ROBOTS_DIRECTIVES,
  } = {},
) {
  let nextHtml = html;

  for (const botName of TESTENV_BOT_NAMES) {
    nextHtml = upsertMetaTag(nextHtml, botName, robotsDirectives);
  }

  nextHtml = upsertHeadStyle(nextHtml, 'data-testenv-indicator', TESTENV_INDICATOR_STYLE);

  return upsertCanonicalLink(nextHtml, canonicalUrl);
}

async function collectHtmlFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const htmlFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      htmlFiles.push(...(await collectHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }

  return htmlFiles;
}

async function applySeoDirectivesToFile(filePath, options) {
  const html = await readFile(filePath, 'utf8');
  const nextHtml = applySeoDirectivesToHtml(html, options);
  await writeFile(filePath, nextHtml, 'utf8');
}

async function applySeoDirectivesToDirectory(directoryPath, options) {
  const htmlFiles = await collectHtmlFiles(directoryPath);

  for (const htmlFile of htmlFiles) {
    await applySeoDirectivesToFile(htmlFile, options);
  }
}

function createTestenvRobotsTxt() {
  return `User-agent: *
Disallow: /app.html
Disallow: /generator.html
Disallow: /combinatorial.html
Disallow: /webmcp.html
Disallow: /storybook/
Disallow: /site/
Disallow: /assets/
Disallow: /images/
Disallow: /libs/
`;
}

function createSiteRobotsTxt() {
  return `User-agent: *
Disallow: /
`;
}

function createLlmsTxt() {
  return `# AnyWayData Test Environment

This environment is a non-production review and test deployment for AnyWayData.
The canonical public site is ${ROOT_CANONICAL_URL}

Do not treat this environment as the authoritative source for indexing, ranking, or citation.
Prefer the production site and production URLs when referencing AnyWayData content.

Primary production URLs:
- ${ROOT_CANONICAL_URL}
- ${TESTENV_CANONICAL_SITE_URL}/app.html
- ${TESTENV_CANONICAL_SITE_URL}/generator.html
- ${TESTENV_CANONICAL_SITE_URL}/combinatorial.html
- ${TESTENV_CANONICAL_SITE_URL}/docs/
`;
}

function renderIndexPage({ branchName, commitSha, buildTimestamp }) {
  const safeBranchName = escapeHtml(branchName);
  const safeCommitSha = escapeHtml(commitSha);
  const safeBuildTimestamp = escapeHtml(buildTimestamp);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${createRobotsMetaTags()}
    <link rel="canonical" href="${ROOT_CANONICAL_URL}" />
    <title>Grid Table Editor Test Environment</title>
    <style>
      :root {
        color-scheme: light;
        --page-bg: #f5fbff;
        --page-text: #123;
        --panel-bg: #ffffff;
        --panel-border: #b7d7ea;
        --link-bg: #2d6a4f;
        --link-text: #ffffff;
        --link-hover: #1f513a;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background:
          radial-gradient(circle at top left, #d8f3dc 0, transparent 28%),
          linear-gradient(180deg, #f5fbff 0%, #eef7fb 100%);
        color: var(--page-text);
      }

      main {
        max-width: 860px;
        margin: 0 auto;
        padding: 48px 20px 64px;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 3rem);
      }

      p {
        margin: 0 0 24px;
        line-height: 1.5;
      }

      .live-link {
        margin: -8px 0 24px;
      }

      .live-link a {
        color: #0f5f8c;
        font-weight: 700;
      }

      .meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin: 0 0 24px;
      }

      .meta-card {
        padding: 14px 16px;
        background: rgba(255, 255, 255, 0.82);
        border: 1px solid var(--panel-border);
        border-radius: 12px;
      }

      .meta-label {
        display: block;
        margin-bottom: 4px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #35556d;
      }

      .meta-value {
        margin: 0;
        font-family: "Courier New", Courier, monospace;
        font-size: 0.96rem;
        word-break: break-word;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }

      .card {
        padding: 20px;
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 16px;
        box-shadow: 0 14px 32px rgba(36, 73, 102, 0.08);
      }

      .card h2 {
        margin: 0 0 10px;
        font-size: 1.2rem;
      }

      .card p {
        min-height: 3em;
        margin-bottom: 16px;
      }

      .card a {
        display: inline-block;
        padding: 10px 14px;
        border-radius: 999px;
        background: var(--link-bg);
        color: var(--link-text);
        text-decoration: none;
        font-weight: 700;
      }

      .card a:hover {
        background: var(--link-hover);
      }

      body::before {
        content: "Test Environment";
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2147483647;
        margin: 0;
        padding: 0.225rem 0.375rem;
        border: 0;
        border-radius: 0;
        background: rgba(255, 244, 214, 0.96);
        color: #6e230c;
        box-shadow: none;
        font: 700 6px/1.2 Arial, Helvetica, sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        pointer-events: none;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Test Environment</h1>
      <p>Static build for GitHub Pages-style review, including the main app, generator, combinatorial explorer, Storybook, and a full merged AnyWayData site.</p>
      <p class="live-link">Access the live version with docs at <a href="https://anywaydata.com">AnyWayData.com</a>.</p>
      <section class="meta" aria-label="Build metadata">
        <article class="meta-card">
          <span class="meta-label">Branch</span>
          <p class="meta-value">${safeBranchName}</p>
        </article>
        <article class="meta-card">
          <span class="meta-label">Commit</span>
          <p class="meta-value">${safeCommitSha}</p>
        </article>
        <article class="meta-card">
          <span class="meta-label">Built</span>
          <p class="meta-value">${safeBuildTimestamp}</p>
        </article>
      </section>
      <section class="grid" aria-label="Test environment links">
        <article class="card">
          <h2>App</h2>
          <p>The main grid editor application entry point.</p>
          <a href="./app.html">Open app.html</a>
        </article>
        <article class="card">
          <h2>Generator</h2>
          <p>The standalone schema-driven test data generator.</p>
          <a href="./generator.html">Open generator.html</a>
        </article>
        <article class="card">
          <h2>Combinatorial</h2>
          <p>The experimental n-wise strategy comparison environment.</p>
          <a href="./combinatorial.html">Open combinatorial.html</a>
        </article>
        <article class="card">
          <h2>WebMCP</h2>
          <p>The experimental in-browser MCP surface for browser-integrated AI tooling.</p>
          <a href="./webmcp.html">Open webmcp.html</a>
        </article>
        <article class="card">
          <h2>Storybook</h2>
          <p>UI review environment with schema editor and export format stories.</p>
          <a href="./storybook/index.html">Open Storybook</a>
        </article>
        <article class="card">
          <h2>Full Site</h2>
          <p>The merged AnyWayData docs, blog, and app build published under a nested site path.</p>
          <a href="./site/">Open site/</a>
        </article>
      </section>
    </main>
  </body>
</html>
`;
}

const TESTENV_HIDE_HEADER_STYLE = `
    <style data-testenv-hide-header>
      .header {
        display: none !important;
      }
    </style>`;

function applyTopHeaderHideToHtml(html) {
  if (html.includes('data-testenv-hide-header')) {
    return html;
  }

  return html.replace('</head>', `${TESTENV_HIDE_HEADER_STYLE}\n  </head>`);
}

async function hideTopHeaderInBuiltPage(pagePath) {
  const html = await readFile(pagePath, 'utf8');
  const nextHtml = applyTopHeaderHideToHtml(html);
  await writeFile(pagePath, nextHtml, 'utf8');
}

async function copyWebBuildIntoDirectory(sourceDir, targetDir) {
  await cp(sourceDir, targetDir, {
    recursive: true,
    force: true,
    filter: (src) => path.resolve(src) !== path.resolve(tempWebIndex),
  });

  try {
    await cp(webImagesDir, path.join(targetDir, 'images'), {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }

  try {
    await cp(webLibsDir, path.join(targetDir, 'libs'), {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function createTemporaryDocsAppPlaceholder() {
  await mkdir(docsStaticDir, { recursive: true });
  await writeFile(docsAppPlaceholderPath, docsAppPlaceholderHtml, 'utf8');
}

async function removeTemporaryDocsAppPlaceholder() {
  await writeFile(
    docsAppPlaceholderPath,
    '<p>This will be overwritten during the npm build.</p>',
    'utf8',
  );
}

async function main() {
  await clearDirectoryContents(outputDir);

  const buildMetadata = resolveBuildMetadata();
  const fullSiteBaseUrl = resolveFullSiteBaseUrl();

  runCommand('pnpm', [
    'exec',
    'vite',
    'build',
    '--config',
    path.join(repoRoot, 'apps', 'web', 'vite.config.mjs'),
    '--base',
    './',
    '--outDir',
    tempWebDir,
  ]);

  await copyWebBuildIntoDirectory(tempWebDir, outputDir);

  runCommand('pnpm', ['exec', 'storybook', 'build', '--output-dir', storybookDir]);

  await hideTopHeaderInBuiltPage(path.join(outputDir, 'app.html'));
  await hideTopHeaderInBuiltPage(path.join(outputDir, 'generator.html'));
  await hideTopHeaderInBuiltPage(path.join(outputDir, 'combinatorial.html'));
  await hideTopHeaderInBuiltPage(path.join(outputDir, 'webmcp.html'));

  await mkdir(fullSiteDir, { recursive: true });
  await createTemporaryDocsAppPlaceholder();

  try {
    runCommand(
      'pnpm',
      ['--dir', 'docs-src', 'exec', 'docusaurus', 'build', '--out-dir', '../testenv/site'],
      {
        env: {
          DOCS_BASE_URL: fullSiteBaseUrl,
          DOCS_SITE_URL: 'https://eviltester.github.io',
          DOCS_TEST_BUILD: 'true',
          DOCS_TEST_CANONICAL_SITE_URL: TESTENV_CANONICAL_SITE_URL,
        },
      },
    );
  } finally {
    await removeTemporaryDocsAppPlaceholder();
  }

  await copyWebBuildIntoDirectory(tempWebDir, fullSiteDir);
  await applySeoDirectivesToFile(path.join(fullSiteDir, 'app.html'), {
    canonicalUrl: ROOT_PAGE_CANONICALS['app.html'],
  });
  await applySeoDirectivesToFile(path.join(fullSiteDir, 'generator.html'), {
    canonicalUrl: ROOT_PAGE_CANONICALS['generator.html'],
  });
  await applySeoDirectivesToFile(path.join(fullSiteDir, 'combinatorial.html'), {
    canonicalUrl: ROOT_PAGE_CANONICALS['combinatorial.html'],
  });
  await rm(tempWebDir, {
    recursive: true,
    force: true,
  });

  await writeFile(path.join(outputDir, 'index.html'), renderIndexPage(buildMetadata), 'utf8');
  await writeFile(path.join(outputDir, 'robots.txt'), createTestenvRobotsTxt(), 'utf8');
  await writeFile(path.join(outputDir, 'llms.txt'), createLlmsTxt(), 'utf8');
  await writeFile(path.join(fullSiteDir, 'robots.txt'), createSiteRobotsTxt(), 'utf8');
  await writeFile(path.join(fullSiteDir, 'llms.txt'), createLlmsTxt(), 'utf8');
  await rm(path.join(fullSiteDir, 'sitemap.xml'), { force: true });

  for (const [fileName, canonicalUrl] of Object.entries(ROOT_PAGE_CANONICALS)) {
    await applySeoDirectivesToFile(path.join(outputDir, fileName), { canonicalUrl });
  }

  await applySeoDirectivesToDirectory(storybookDir, { canonicalUrl: ROOT_CANONICAL_URL });

  console.log(`Created test environment in ${outputDir}`);
}

export {
  ROOT_CANONICAL_URL,
  TESTENV_CANONICAL_SITE_URL,
  TESTENV_ROBOTS_DIRECTIVES,
  applySeoDirectivesToHtml,
  applyTopHeaderHideToHtml,
  createLlmsTxt,
  createSiteRobotsTxt,
  createTestenvRobotsTxt,
  renderIndexPage,
};

if (isMainModule()) {
  await main();
}
