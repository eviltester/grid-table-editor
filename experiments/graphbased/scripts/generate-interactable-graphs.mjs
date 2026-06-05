import { createReadStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { generateExperiment, writeExperimentOutputs } from './graphbased-lib.mjs';

const repoRoot = process.cwd();
const storybookDir = path.join(repoRoot, 'storybook-static');
const storybookIndexPath = path.join(storybookDir, 'index.json');
const outputDir = path.join(repoRoot, 'experiments', 'graphbased', 'output');
const graphDir = path.join(outputDir, 'interactable-elements');
const storyGraphDir = path.join(graphDir, 'stories');
const manifestPath = path.join(graphDir, 'manifest.json');
const port = Number(process.env.INTERACTABLE_GRAPH_PORT || 4197);
const limit = Number(process.env.INTERACTABLE_GRAPH_LIMIT || 0);
const actionLimit = Number(process.env.INTERACTABLE_GRAPH_ACTION_LIMIT || 12);
const settleWaitMs = Number(process.env.INTERACTABLE_GRAPH_WAIT_MS || 650);
const verbose = process.env.INTERACTABLE_GRAPH_VERBOSE !== '0';

if (!existsSync(storybookIndexPath)) {
  console.error('storybook-static/index.json was not found. Run `pnpm run build-storybook` first.');
  process.exit(1);
}

mkdirSync(storyGraphDir, { recursive: true });
rmSync(storyGraphDir, { force: true, recursive: true });
mkdirSync(storyGraphDir, { recursive: true });

const storybookIndex = JSON.parse(readFileSync(storybookIndexPath, 'utf8'));
const stories = Object.values(storybookIndex.entries)
  .filter((entry) => entry.type === 'story')
  .sort((left, right) => storyKeyForIndexEntry(left).localeCompare(storyKeyForIndexEntry(right)));
const selectedStories = limit > 0 ? stories.slice(0, limit) : stories;
const server = createStaticServer({ rootDir: storybookDir, port });

log(`Loaded Storybook index from ${storybookIndexPath}`);
log(`Found ${stories.length} stories; crawling ${selectedStories.length}${limit > 0 ? ` because INTERACTABLE_GRAPH_LIMIT=${limit}` : ''}.`);
log(`Per-story action limit: ${actionLimit}; settle wait after each action: ${settleWaitMs}ms.`);
log(`Serving static Storybook from ${storybookDir} on http://127.0.0.1:${port}/`);
await listen(server, port);
log('Storybook static server is ready.');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const manifestStories = {};

try {
  for (const [storyIndex, story] of selectedStories.entries()) {
    const key = storyKeyForIndexEntry(story);
    const storyUrl = `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
    const slug = slugify(key);
    const mermaidFile = `stories/${slug}.mmd`;

    log('');
    log(`[${storyIndex + 1}/${selectedStories.length}] Crawling ${key}`);
    log(`  iframe: ${storyUrl}`);
    try {
      const entry = await inspectStory({ page, story, storyUrl, key });
      const mermaidSource = renderInteractableMermaid(entry);
      manifestStories[key] = {
        ...entry,
        storybookId: story.id,
        storybookUrl: storyUrl,
        mermaidFile,
        mermaidSource,
      };
      writeFileSync(path.join(graphDir, mermaidFile), mermaidSource);
      log(`  wrote Mermaid: output/interactable-elements/${mermaidFile}`);
      log(
        `  done: ${entry.initialElements.length} elements, ${entry.summary.passedActionCount} passed, ${entry.summary.skippedActionCount} skipped, ${entry.summary.failedActionCount} failed`
      );
    } catch (error) {
      const entry = {
        status: 'failed',
        storyKey: key,
        storybookId: story.id,
        storybookUrl: storyUrl,
        initialElements: [],
        actions: [],
        edges: [],
        screenshots: [],
        error: error?.message || String(error),
      };
      entry.mermaidFile = mermaidFile;
      entry.mermaidSource = renderInteractableMermaid(entry);
      manifestStories[key] = entry;
      writeFileSync(path.join(graphDir, mermaidFile), entry.mermaidSource);
      warn(`  failed story crawl: ${entry.error}`);
    }
  }
} finally {
  log('');
  log('Closing browser and static server.');
  await browser.close();
  server.close();
}

writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      version: 1,
      source: {
        storybookIndexPath: 'storybook-static/index.json',
        limit,
        actionLimit,
        settleWaitMs,
        selectedStoryCount: selectedStories.length,
        totalStoryCount: stories.length,
      },
      stories: manifestStories,
    },
    null,
    2
  )}\n`
);

const { validation, outputs } = generateExperiment();
writeExperimentOutputs(outputs);

if (!validation.ok) {
  console.error('Graph metadata validation failed after interactable graph generation.');
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(`Generated interactable element graphs for ${Object.keys(manifestStories).length} stories.`);
console.log('Regenerated graph report with interactable element graphs.');

async function inspectStory({ page, story, storyUrl, key }) {
  log('  loading initial story state...');
  await loadStory(page, storyUrl);
  const initialSnapshot = await capturePageState(page);
  const actionableElements = initialSnapshot.elements.filter((element) => !element.disabled);
  const actions = [];
  const edges = [];
  const screenshots = [];
  const elementsToExplore = actionableElements.slice(0, actionLimit);

  log(`  found ${initialSnapshot.elements.length} visible interactables (${actionableElements.length} enabled).`);
  if (initialSnapshot.elements.length > actionLimit) {
    log(`  exploring first ${actionLimit} enabled elements; ${initialSnapshot.elements.length - actionLimit} visible elements are beyond the action limit.`);
  }
  elementsToExplore.forEach((element, index) => {
    log(`    element ${index + 1}: ${element.label} [${element.selectorHint}]`);
  });

  for (const [elementIndex, element] of elementsToExplore.entries()) {
    const safety = classifySafety(element);
    const action = {
      id: `action-${actions.length + 1}`,
      elementId: element.id,
      elementLabel: element.label,
      actionType: inferActionType(element),
      status: safety.safe ? 'attempted' : 'skipped',
      reason: safety.safe ? null : safety.reason,
    };

    if (!safety.safe) {
      log(`    skip ${elementIndex + 1}/${elementsToExplore.length}: ${element.label} (${safety.reason})`);
      actions.push(action);
      edges.push({
        from: element.id,
        actionId: action.id,
        to: 'skipped',
        status: 'skipped',
        label: safety.reason,
      });
      continue;
    }

    try {
      log(`    try ${elementIndex + 1}/${elementsToExplore.length}: ${action.actionType} ${element.label}`);
      await loadStory(page, storyUrl);
      const before = await capturePageState(page);
      await performAction(page, element, action.actionType);
      await page.waitForTimeout(settleWaitMs);
      const after = await capturePageState(page);
      const result = summarizeStateChange(before, after);
      action.status = 'passed';
      action.result = result.summary;
      actions.push(action);
      log(`      result: ${result.summary}; elements ${before.elements.length} -> ${after.elements.length}`);
      edges.push({
        from: element.id,
        actionId: action.id,
        to: result.stateId,
        status: 'passed',
        label: result.summary,
        beforeElementCount: before.elements.length,
        afterElementCount: after.elements.length,
        addedElements: result.added,
        removedElements: result.removed,
      });
    } catch (error) {
      action.status = 'failed';
      action.error = cleanErrorMessage(error);
      actions.push(action);
      warn(`      failed: ${action.error}`);
      edges.push({
        from: element.id,
        actionId: action.id,
        to: 'failed',
        status: 'failed',
        label: action.error,
      });
    }
  }

  return {
    status: 'captured',
    storyKey: key,
    title: story.title,
    exportName: story.exportName,
    initialElements: initialSnapshot.elements,
    initialState: initialSnapshot.state,
    actions,
    edges,
    screenshots,
    summary: {
      initialElementCount: initialSnapshot.elements.length,
      attemptedActionCount: actions.filter((action) => action.status === 'passed' || action.status === 'failed').length,
      passedActionCount: actions.filter((action) => action.status === 'passed').length,
      skippedActionCount: actions.filter((action) => action.status === 'skipped').length,
      failedActionCount: actions.filter((action) => action.status === 'failed').length,
      edgeCount: edges.length,
    },
  };
}

async function loadStory(page, storyUrl) {
  await page.goto(storyUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(300);
}

async function capturePageState(page) {
  return page.evaluate(() => {
    const actionableRoles = new Set([
      'button',
      'checkbox',
      'combobox',
      'link',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'radio',
      'searchbox',
      'slider',
      'spinbutton',
      'switch',
      'tab',
      'textbox',
    ]);
    const selector = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      'summary',
      '[role]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const elements = [...document.querySelectorAll(selector)]
      .filter((element) => isVisible(element))
      .filter((element) => isNativeControl(element) || actionableRoles.has(roleFor(element)))
      .map((element, index) => summarizeElement(element, index));
    const text = normalizeText(document.body?.innerText || '').slice(0, 1200);

    return {
      elements,
      state: {
        visibleTextSample: text,
        visibleTextLength: text.length,
        elementSignature: elements.map((element) => element.signature).join('|'),
      },
    };

    function summarizeElement(element, index) {
      const role = roleFor(element);
      const type = element.getAttribute('type') || element.tagName.toLowerCase();
      const value = valueFor(element);
      const label = accessibleNameFor(element) || `${role} ${index + 1}`;
      const selectorHint = selectorFor(element);
      const disabled = Boolean(element.disabled) || element.getAttribute('aria-disabled') === 'true';
      const href = element.href || '';
      const target = element.getAttribute('target') || '';
      const download = element.hasAttribute('download');
      const id = `el-${index + 1}-${slugify(`${role}-${label}-${type}`)}`;
      return {
        id,
        role,
        name: label,
        label: `${role}: ${label}`,
        tagName: element.tagName.toLowerCase(),
        type,
        value,
        disabled,
        href,
        target,
        download,
        selectorHint,
        signature: `${role}:${label}:${type}:${value}:${disabled}`,
      };
    }

    function isNativeControl(element) {
      return ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(element.tagName);
    }

    function isVisible(element) {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        rect.width > 0 &&
        rect.height > 0
      );
    }

    function roleFor(element) {
      const explicitRole = normalizeText(element.getAttribute('role')).toLowerCase();
      if (explicitRole) {
        return explicitRole;
      }
      const tagName = element.tagName.toLowerCase();
      const type = (element.getAttribute('type') || '').toLowerCase();
      if (tagName === 'a') {
        return 'link';
      }
      if (tagName === 'button' || tagName === 'summary') {
        return 'button';
      }
      if (tagName === 'select') {
        return 'combobox';
      }
      if (tagName === 'textarea') {
        return 'textbox';
      }
      if (tagName === 'input') {
        if (type === 'checkbox') {
          return 'checkbox';
        }
        if (type === 'radio') {
          return 'radio';
        }
        if (type === 'range') {
          return 'slider';
        }
        if (type === 'number') {
          return 'spinbutton';
        }
        if (type === 'search') {
          return 'searchbox';
        }
        return 'textbox';
      }
      return explicitRole || tagName;
    }

    function valueFor(element) {
      if ('checked' in element && (element.type === 'checkbox' || element.type === 'radio')) {
        return element.checked ? 'checked' : 'unchecked';
      }
      if ('value' in element) {
        return normalizeText(element.value).slice(0, 80);
      }
      return '';
    }

    function accessibleNameFor(element) {
      const labelledBy = element.getAttribute('aria-labelledby');
      const labelledText = labelledBy
        ? labelledBy
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.innerText || '')
            .join(' ')
        : '';
      const labelText =
        element.id && document.querySelector(`label[for="${CSS.escape(element.id)}"]`)
          ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`).innerText
          : '';
      return normalizeText(
        element.getAttribute('aria-label') ||
          labelledText ||
          labelText ||
          element.getAttribute('placeholder') ||
          element.getAttribute('title') ||
          element.getAttribute('alt') ||
          element.innerText ||
          element.value ||
          element.name ||
          element.id
      ).slice(0, 120);
    }

    function selectorFor(element) {
      if (element.id) {
        return `#${CSS.escape(element.id)}`;
      }

      for (const attribute of ['data-testid', 'data-test', 'data-role', 'data-action', 'aria-label', 'name']) {
        const value = element.getAttribute(attribute);
        if (value) {
          return `${element.tagName.toLowerCase()}[${attribute}="${cssAttributeEscape(value)}"]`;
        }
      }

      const parts = [];
      let current = element;
      while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
        const tagName = current.tagName.toLowerCase();
        const siblings = [...current.parentElement.children].filter((sibling) => sibling.tagName === current.tagName);
        const index = siblings.indexOf(current) + 1;
        parts.unshift(`${tagName}:nth-of-type(${index})`);
        current = current.parentElement;
      }
      return `body > ${parts.join(' > ')}`;
    }

    function cssAttributeEscape(value) {
      return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function normalizeText(value) {
      return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function slugify(value) {
      return normalizeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
    }
  });
}

async function performAction(page, element, actionType) {
  const target = page.locator(element.selectorHint).first();
  await target.waitFor({ state: 'visible', timeout: 5000 });

  if (actionType === 'fill-number') {
    await target.fill('2');
    return;
  }

  if (actionType === 'fill-text') {
    await target.fill('graph-test');
    return;
  }

  if (actionType === 'select-option') {
    const optionValue = await target.evaluate((select) => {
      const options = [...select.options].filter((option) => !option.disabled);
      const nextOption = options.find((option) => option.value !== select.value) || options[0];
      return nextOption?.value ?? null;
    });
    if (optionValue !== null) {
      await target.selectOption(optionValue);
    }
    return;
  }

  await target.click({ timeout: 5000 });
}

function classifySafety(element) {
  const text = `${element.role} ${element.name} ${element.type} ${element.value}`.toLowerCase();
  const riskyWords = [
    'delete',
    'remove',
    'clear',
    'reset',
    'download',
    'export',
    'upload',
    'import',
    'browse',
    'file',
    'open external',
  ];

  if (element.type === 'file') {
    return { safe: false, reason: 'file upload control' };
  }

  if (element.download) {
    return { safe: false, reason: 'download link' };
  }

  if (element.role === 'link' && element.target === '_blank') {
    return { safe: false, reason: 'new-window link' };
  }

  if (element.role === 'link' && /^https?:\/\//.test(element.href || '')) {
    try {
      const linkUrl = new URL(element.href);
      if (!['127.0.0.1', 'localhost'].includes(linkUrl.hostname)) {
        return { safe: false, reason: 'external link' };
      }
    } catch {
      return { safe: false, reason: 'unparseable link' };
    }
  }

  if (riskyWords.some((word) => text.includes(word))) {
    return { safe: false, reason: 'risky label or control type' };
  }

  return { safe: true };
}

function inferActionType(element) {
  if (['checkbox', 'radio', 'switch'].includes(element.role) || ['checkbox', 'radio'].includes(element.type)) {
    return 'click';
  }
  if (element.tagName === 'select' || element.role === 'combobox') {
    return 'select-option';
  }
  if (element.type === 'number' || element.role === 'spinbutton') {
    return 'fill-number';
  }
  if (element.tagName === 'input' || element.tagName === 'textarea' || element.role === 'textbox' || element.role === 'searchbox') {
    return 'fill-text';
  }
  return 'click';
}

function summarizeStateChange(before, after) {
  const beforeSignatures = new Set(before.elements.map((element) => element.signature));
  const afterSignatures = new Set(after.elements.map((element) => element.signature));
  const added = after.elements
    .filter((element) => !beforeSignatures.has(element.signature))
    .map((element) => element.label)
    .slice(0, 8);
  const removed = before.elements
    .filter((element) => !afterSignatures.has(element.signature))
    .map((element) => element.label)
    .slice(0, 8);
  const textChanged = before.state.visibleTextSample !== after.state.visibleTextSample;
  const changed = added.length > 0 || removed.length > 0 || textChanged;
  const summaryParts = [];

  if (added.length > 0) {
    summaryParts.push(`adds ${added.length}`);
  }
  if (removed.length > 0) {
    summaryParts.push(`removes ${removed.length}`);
  }
  if (textChanged) {
    summaryParts.push('changes visible text');
  }
  if (summaryParts.length === 0) {
    summaryParts.push('no visible state change detected');
  }

  return {
    stateId: changed ? `state-${hashString(`${after.state.elementSignature}:${after.state.visibleTextSample}`)}` : 'state-unchanged',
    summary: summaryParts.join(', '),
    added,
    removed,
  };
}

function renderInteractableMermaid(entry) {
  const lines = ['flowchart TD'];
  const storyId = 'story';
  const initialId = 'initial';

  lines.push(`  ${storyId}["${escapeMermaid(entry.storyKey || 'Story')}"]`);
  lines.push(`  ${initialId}["Initial interactables: ${entry.initialElements.length}"]`);
  lines.push(`  ${storyId} --> ${initialId}`);

  if (entry.status === 'failed') {
    lines.push(`  failed["Failed: ${escapeMermaid(entry.error || 'unknown error')}"]`);
    lines.push(`  ${initialId} --> failed`);
    return `${lines.join('\n')}\n`;
  }

  entry.initialElements.forEach((element, index) => {
    const elementId = mermaidId(element.id, index);
    lines.push(`  ${elementId}["${escapeMermaid(element.label)}"]`);
    lines.push(`  ${initialId} --> ${elementId}`);
  });

  entry.edges.forEach((edge, index) => {
    const fromId = mermaidId(edge.from, index);
    const targetId = mermaidId(edge.to, index + 1000);
    const label = escapeMermaid(`${edge.status}: ${edge.label || ''}`);
    lines.push(`  ${targetId}["${escapeMermaid(edge.to)}"]`);
    if (edge.status === 'skipped') {
      lines.push(`  ${fromId} -.->|"${label}"| ${targetId}`);
      return;
    }
    lines.push(`  ${fromId} -->|"${label}"| ${targetId}`);
  });

  if (entry.initialElements.length === 0) {
    lines.push('  none["No visible enabled interactables found"]');
    lines.push(`  ${initialId} --> none`);
  }

  return `${lines.join('\n')}\n`;
}

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

function listen(server, listenPort) {
  return new Promise((resolve, reject) => {
    server.once('error', (error) => {
      if (error?.code === 'EADDRINUSE') {
        reject(
          new Error(
            `Port ${listenPort} is already in use. Set INTERACTABLE_GRAPH_PORT to another port, for example: $env:INTERACTABLE_GRAPH_PORT='4198'`
          )
        );
        return;
      }
      reject(error);
    });
    server.listen(listenPort, '127.0.0.1', resolve);
  }).catch((error) => {
    console.error(error?.message || String(error));
    process.exit(1);
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

function escapeMermaid(value) {
  return String(value || '').replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').trim().replace(/"/g, "'");
}

function mermaidId(value, fallback) {
  const id = String(value || `node-${fallback}`).replace(/[^A-Za-z0-9_]/g, '_');
  return /^[A-Za-z_]/.test(id) ? id : `node_${id}`;
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function cleanErrorMessage(error) {
  return String(error?.message || error || 'unknown error')
    .replace(/\u001b\[[0-9;]*m/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 240);
}

function log(message) {
  if (verbose) {
    console.log(message);
  }
}

function warn(message) {
  console.warn(message);
}
