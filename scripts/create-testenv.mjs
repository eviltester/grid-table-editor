import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputDir = path.join(repoRoot, 'testenv');
const storybookDir = path.join(outputDir, 'storybook');

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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
    </style>
  </head>
  <body>
    <main>
      <h1>Test Environment</h1>
      <p>Static build for GitHub Pages-style review, including the main app, generator, and Storybook.</p>
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
          <h2>Storybook</h2>
          <p>UI review environment with schema editor and export format stories.</p>
          <a href="./storybook/index.html">Open Storybook</a>
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

async function hideTopHeaderInBuiltPage(pagePath) {
  const html = await readFile(pagePath, 'utf8');
  if (html.includes('data-testenv-hide-header')) {
    return;
  }

  const nextHtml = html.replace('</head>', `${TESTENV_HIDE_HEADER_STYLE}\n  </head>`);
  await writeFile(pagePath, nextHtml, 'utf8');
}

await clearDirectoryContents(outputDir);

const buildMetadata = resolveBuildMetadata();

runCommand('pnpm', [
  'exec',
  'vite',
  'build',
  '--config',
  path.join(repoRoot, 'apps', 'web', 'vite.config.mjs'),
  '--base',
  './',
  '--outDir',
  outputDir,
]);

runCommand('pnpm', ['exec', 'storybook', 'build', '--output-dir', storybookDir]);

await hideTopHeaderInBuiltPage(path.join(outputDir, 'app.html'));
await hideTopHeaderInBuiltPage(path.join(outputDir, 'generator.html'));

await writeFile(path.join(outputDir, 'index.html'), renderIndexPage(buildMetadata), 'utf8');

console.log(`Created test environment in ${outputDir}`);
