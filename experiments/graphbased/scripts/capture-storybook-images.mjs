import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { generateExperiment, writeExperimentOutputs } from './graphbased-lib.mjs';

const repoRoot = process.cwd();
const storybookDir = path.join(repoRoot, 'storybook-static');
const storybookIndexPath = path.join(storybookDir, 'index.json');
const outputDir = path.join(repoRoot, 'experiments', 'graphbased', 'output');
const captureDir = path.join(outputDir, 'storybook-captures');
const imageDir = path.join(captureDir, 'images');
const manifestPath = path.join(captureDir, 'manifest.json');
const port = Number(process.env.STORYBOOK_CAPTURE_PORT || 4187);
const endWaitMs = Number(process.env.STORYBOOK_CAPTURE_END_WAIT_MS || 2500);
const limit = Number(process.env.STORYBOOK_CAPTURE_LIMIT || 0);

if (!existsSync(storybookIndexPath)) {
  console.error('storybook-static/index.json was not found. Run `pnpm run build-storybook` first.');
  process.exit(1);
}

mkdirSync(imageDir, { recursive: true });

const storybookIndex = JSON.parse(readFileSync(storybookIndexPath, 'utf8'));
const stories = Object.values(storybookIndex.entries)
  .filter((entry) => entry.type === 'story')
  .sort((left, right) => storyKeyForIndexEntry(left).localeCompare(storyKeyForIndexEntry(right)));
const selectedStories = limit > 0 ? stories.slice(0, limit) : stories;
const server = createStaticServer({ rootDir: storybookDir, port });

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const captures = {};

try {
  for (const story of selectedStories) {
    const key = storyKeyForIndexEntry(story);
    const slug = slugify(key);
    const hasPlay = story.tags?.includes('play-fn') === true;
    const renderedImage = `storybook-captures/images/${slug}-rendered.png`;
    const startImage = `storybook-captures/images/${slug}-start.png`;
    const endImage = `storybook-captures/images/${slug}-end.png`;
    const storyUrl = `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;

    try {
      await page.goto(storyUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (hasPlay) {
        await page.screenshot({ path: path.join(outputDir, startImage), fullPage: true });
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(endWaitMs);
        await page.screenshot({ path: path.join(outputDir, endImage), fullPage: true });
        captures[key] = {
          status: 'captured',
          kind: 'play',
          storybookId: story.id,
          storybookUrl: storyUrl,
          startImage,
          endImage,
        };
      } else {
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outputDir, renderedImage), fullPage: true });
        captures[key] = {
          status: 'captured',
          kind: 'rendered',
          storybookId: story.id,
          storybookUrl: storyUrl,
          renderedImage,
        };
      }
      console.log(`captured ${key}`);
    } catch (error) {
      captures[key] = {
        status: 'failed',
        kind: hasPlay ? 'play' : 'rendered',
        storybookId: story.id,
        storybookUrl: storyUrl,
        error: error?.message || String(error),
      };
      console.warn(`failed ${key}: ${captures[key].error}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}

writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      source: {
        storybookIndexPath: 'storybook-static/index.json',
        endWaitMs,
        limit,
      },
      captures,
    },
    null,
    2
  )}\n`
);

const { validation, outputs } = generateExperiment();
writeExperimentOutputs(outputs);

if (!validation.ok) {
  console.error('Graph metadata validation failed after capture.');
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(`Captured ${Object.values(captures).filter((capture) => capture.status === 'captured').length} stories.`);
console.log('Regenerated graph report with Storybook screenshots.');

function createStaticServer({ rootDir }) {
  return createServer((request, response) => {
    const filePath = resolveStaticPath({ rootDir, requestUrl: request.url });
    const relativePath = path.relative(rootDir, filePath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath) || !existsSync(filePath)) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'content-type': contentTypeFor(filePath),
      'cache-control': 'no-store',
    });
    createReadStream(filePath).pipe(response);
  });
}

function resolveStaticPath({ rootDir, requestUrl = '/' }) {
  const parsedUrl = new URL(requestUrl, `http://127.0.0.1:${port}`);
  const requestedPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const normalizedPath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');
  return path.join(rootDir, normalizedPath);
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath);
  return (
    {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.svg': 'image/svg+xml; charset=utf-8',
      '.woff2': 'font/woff2',
    }[extension] || 'application/octet-stream'
  );
}

function storyKeyForIndexEntry(entry) {
  return `${entry.title}/${entry.exportName}`;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
