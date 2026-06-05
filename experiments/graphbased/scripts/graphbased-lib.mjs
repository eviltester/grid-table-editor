import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const STORY_GLOB_ROOT = path.join('apps', 'web', 'src', 'stories');
const METADATA_PATH = path.join('experiments', 'graphbased', 'metadata', 'story-interactions.json');
const DRAFT_METADATA_PATH = path.join('experiments', 'graphbased', 'metadata', 'story-interactions.draft.json');
const OUTPUT_DIR = path.join('experiments', 'graphbased', 'output');
const CAPTURE_MANIFEST_PATH = path.join(OUTPUT_DIR, 'storybook-captures', 'manifest.json');
const INTERACTABLE_MANIFEST_PATH = path.join(OUTPUT_DIR, 'interactable-elements', 'manifest.json');

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeMermaidLabel(value) {
  return normalizeText(value).replace(/"/g, "'");
}

function escapeDotLabel(value) {
  return normalizeText(value).replace(/"/g, '\\"');
}

function createNodeId(prefix, value) {
  const slug = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${prefix}_${slug || 'node'}`;
}

function createOutputSlug(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadCaptureManifest(manifestPath = CAPTURE_MANIFEST_PATH) {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    return { captures: {} };
  }
}

function loadInteractableManifest(manifestPath = INTERACTABLE_MANIFEST_PATH) {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    return { stories: {} };
  }
}

function listStoryFiles(rootDir = STORY_GLOB_ROOT) {
  const output = [];

  function walk(currentDir) {
    readdirSync(currentDir, { withFileTypes: true }).forEach((entry) => {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        return;
      }

      if (entry.isFile() && entry.name.endsWith('.stories.js')) {
        output.push(toPosixPath(entryPath));
      }
    });
  }

  walk(rootDir);
  return output.sort();
}

function extractStoryTitle(source) {
  const titleMatch = source.match(/\btitle\s*:\s*(['"`])([^'"`]+)\1/);
  return titleMatch?.[2] || null;
}

function extractStoryExports(source) {
  const exportMatches = [...source.matchAll(/export\s+const\s+([A-Za-z_$][\w$]*)\s*=/g)];
  return exportMatches.map((match, index) => {
    const start = match.index || 0;
    const end = exportMatches[index + 1]?.index ?? source.length;
    const body = source.slice(start, end);

    return {
      name: match[1],
      hasPlay: /\bplay\s*:/.test(body),
      hasParameters: /\bparameters\s*:/.test(body),
      playSource: extractPlaySource(body),
    };
  });
}

function extractPlaySource(storyBody) {
  const inlineMatch = storyBody.match(/\bplay\s*:\s*(async\s*)?\([^]*?^\s{2}},?/m);
  if (inlineMatch) {
    return inlineMatch[0];
  }

  const namedMatch = storyBody.match(/\bplay\s*:\s*([A-Za-z_$][\w$]*)/);
  if (namedMatch) {
    return namedMatch[1];
  }

  return '';
}

function discoverStories({ rootDir = STORY_GLOB_ROOT } = {}) {
  return listStoryFiles(rootDir)
    .flatMap((filePath) => {
      const source = readFileSync(filePath, 'utf8');
      const title = extractStoryTitle(source);
      const exports = extractStoryExports(source);

      return exports.map((storyExport) => ({
        key: title ? `${title}/${storyExport.name}` : `${filePath}/${storyExport.name}`,
        title,
        story: storyExport.name,
        filePath,
        hasPlay: storyExport.hasPlay,
        hasParameters: storyExport.hasParameters,
        playSource: storyExport.playSource,
      }));
    })
    .sort((left, right) => left.key.localeCompare(right.key));
}

function normalizeMetadataEntries(entries, source = 'reviewed') {
  return entries.map((entry) => ({
    ...entry,
    key: `${entry.title}/${entry.story}`,
    source,
    interactions: Array.isArray(entry.interactions) ? entry.interactions : [],
    emits: Array.isArray(entry.emits) ? entry.emits : [],
  }));
}

function loadMetadata(metadataPath = METADATA_PATH, source = 'reviewed') {
  return normalizeMetadataEntries(JSON.parse(readFileSync(metadataPath, 'utf8')), source);
}

function inferComponentName(story) {
  const titleParts = String(story.title || '').split('/');
  const preferredPart = titleParts[titleParts.length - 1] || story.story;
  return normalizeText(preferredPart)
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+([a-z])/g, (_, character) => character.toUpperCase())
    .replace(/\s+/g, '');
}

function inferLayer(story) {
  const firstTitlePart = String(story.title || '').split('/')[0]?.toLowerCase();
  if (firstTitlePart === 'pages') {
    return 'page';
  }
  if (firstTitlePart === 'shared') {
    return 'shared';
  }
  if (firstTitlePart === 'primitives') {
    return 'primitive';
  }
  return 'feature';
}

function describeUserEvent(line) {
  const eventMatch = line.match(/userEvent\.([A-Za-z_$][\w$]*)\((.*)\)/);
  if (!eventMatch) {
    return null;
  }

  const eventName = eventMatch[1];
  const args = eventMatch[2] || '';
  const roleMatch = args.match(/getByRole\((['"`])([^'"`]+)\1\s*,\s*\{\s*name\s*:\s*([^}]+)\}/);
  const textMatch = args.match(/getByText\((['"`])([^'"`]+)\1\)/);
  const selectorMatch = args.match(/querySelector\((['"`])([^'"`]+)\1\)/);
  const typedValue = args.match(/,\s*(['"`])([^'"`]+)\1\s*\)?\s*$/)?.[2];

  if (eventName === 'click') {
    if (roleMatch) {
      return `click ${roleMatch[2]} named ${cleanMatcher(roleMatch[3])}`;
    }
    if (textMatch) {
      return `click text ${textMatch[2]}`;
    }
    if (selectorMatch) {
      return `click selector ${selectorMatch[2]}`;
    }
    return 'click target';
  }

  if (eventName === 'type') {
    return typedValue ? `type ${typedValue}` : 'type into target';
  }

  if (eventName === 'clear') {
    return 'clear target';
  }

  if (eventName === 'tab') {
    return 'press Tab';
  }

  if (eventName === 'selectOptions') {
    return typedValue ? `select option ${typedValue}` : 'select option';
  }

  return `${eventName} target`;
}

function cleanMatcher(value) {
  return normalizeText(value)
    .replace(/^\/|\/[a-z]*$/g, '')
    .replace(/^['"`]|['"`]$/g, '');
}

function describeExpectation(line) {
  const matcherMatch = line.match(/expect\((.*?)\)\.([A-Za-z_$][\w$]*)\((.*?)\)/);
  if (!matcherMatch) {
    return null;
  }

  const subject = normalizeText(matcherMatch[1]);
  const matcher = matcherMatch[2];
  const expected = normalizeText(matcherMatch[3]).replace(/^['"`]|['"`]$/g, '');
  return `${subject} ${matcher} ${expected}`.trim();
}

function extractDraftInteractionsFromPlay(story) {
  if (!story.hasPlay || !story.playSource) {
    return [];
  }

  if (/^[A-Za-z_$][\w$]*$/.test(story.playSource)) {
    return [
      {
        action: `run imported play helper ${story.playSource}`,
        from: 'story is rendered',
        to: 'imported play helper completes',
        assertion: 'inspect helper source for detailed actions and assertions',
      },
    ];
  }

  const statements = story.playSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const interactions = [];

  statements.forEach((line) => {
    const action = describeUserEvent(line);
    if (action) {
      interactions.push({
        action,
        from: interactions.length === 0 ? 'story is rendered' : 'previous interaction completed',
        to: `${action} completes`,
        assertion: 'await following Storybook assertion',
      });
      return;
    }

    const assertion = describeExpectation(line);
    if (assertion && interactions.length > 0) {
      interactions[interactions.length - 1].assertion = assertion;
    }
  });

  if (interactions.length === 0) {
    return [
      {
        action: 'run Storybook play function',
        from: 'story is rendered',
        to: 'play function completes',
        assertion: 'no userEvent action was extracted from the play source',
      },
    ];
  }

  return interactions;
}

function createDraftMetadata(discoveredStories) {
  return discoveredStories
    .filter((story) => story.hasPlay)
    .map((story) => ({
      title: story.title || 'Untitled',
      story: story.story,
      component: inferComponentName(story),
      layer: inferLayer(story),
      initialState: `${story.key} renders before its Storybook play interactions run.`,
      interactions: extractDraftInteractionsFromPlay(story),
      emits: [],
      draftReason:
        'Generated from Storybook play source. Review and promote to story-interactions.json for product-level intent.',
    }));
}

function mergeMetadata({ reviewedMetadata, draftMetadata }) {
  const reviewedByKey = new Map(reviewedMetadata.map((entry) => [entry.key, entry]));
  const merged = [...reviewedMetadata];

  draftMetadata.forEach((entry) => {
    if (!reviewedByKey.has(entry.key)) {
      merged.push(entry);
    }
  });

  return merged.sort((left, right) => left.key.localeCompare(right.key));
}

function validateMetadata(metadata, discoveredStories) {
  const discoveredKeys = new Set(discoveredStories.map((story) => story.key));
  const seenKeys = new Set();
  const duplicateKeys = [];
  const staleMetadata = [];
  const invalidEntries = [];

  metadata.forEach((entry) => {
    if (seenKeys.has(entry.key)) {
      duplicateKeys.push(entry.key);
    }
    seenKeys.add(entry.key);

    if (!discoveredKeys.has(entry.key)) {
      staleMetadata.push(entry.key);
    }

    if (!entry.component || !entry.layer || !entry.initialState || entry.interactions.length === 0) {
      invalidEntries.push(entry.key);
    }
  });

  return {
    ok: duplicateKeys.length === 0 && staleMetadata.length === 0 && invalidEntries.length === 0,
    duplicateKeys: duplicateKeys.sort(),
    staleMetadata: staleMetadata.sort(),
    invalidEntries: invalidEntries.sort(),
  };
}

function buildGraph({ discoveredStories, metadata }) {
  const storyByKey = new Map(discoveredStories.map((story) => [story.key, story]));
  const metadataByKey = new Map(metadata.map((entry) => [entry.key, entry]));
  const nodesById = new Map();
  const edges = [];

  function addNode(node) {
    if (!nodesById.has(node.id)) {
      nodesById.set(node.id, node);
    }
  }

  metadata.forEach((entry) => {
    const discoveredStory = storyByKey.get(entry.key);
    const componentId = createNodeId('component', entry.component);
    const storyId = createNodeId('story', entry.key);
    const initialStateId = createNodeId('state', `${entry.key} initial`);

    addNode({ id: componentId, type: 'component', label: entry.component, layer: entry.layer });
    addNode({
      id: storyId,
      type: 'story',
      label: entry.key,
      filePath: discoveredStory?.filePath || null,
      hasPlay: Boolean(discoveredStory?.hasPlay),
    });
    addNode({ id: initialStateId, type: 'state', label: entry.initialState });
    edges.push({ from: componentId, to: storyId, label: 'documented by' });
    edges.push({ from: storyId, to: initialStateId, label: 'starts at' });

    let previousStateId = initialStateId;
    entry.interactions.forEach((interaction, index) => {
      const actionId = createNodeId('action', `${entry.key} ${index + 1} ${interaction.action}`);
      const nextStateId = createNodeId('state', `${entry.key} ${index + 1} ${interaction.to}`);

      addNode({
        id: actionId,
        type: 'action',
        label: interaction.action,
        assertion: interaction.assertion || '',
      });
      addNode({
        id: nextStateId,
        type: 'state',
        label: interaction.to,
      });
      edges.push({ from: previousStateId, to: actionId, label: interaction.from || 'when' });
      edges.push({ from: actionId, to: nextStateId, label: interaction.assertion || 'expects' });
      previousStateId = nextStateId;
    });

    entry.emits.forEach((eventName) => {
      const eventId = createNodeId('event', `${entry.key} ${eventName}`);
      addNode({ id: eventId, type: 'event', label: eventName });
      edges.push({ from: storyId, to: eventId, label: 'emits' });
    });
  });

  const coveredKeys = new Set(metadata.map((entry) => entry.key));
  const storiesWithPlay = discoveredStories.filter((story) => story.hasPlay);
  const storiesWithPlayMissingMetadata = storiesWithPlay
    .filter((story) => !coveredKeys.has(story.key))
    .map((story) => story.key)
    .sort();

  return {
    version: 1,
    source: {
      storyRoot: toPosixPath(STORY_GLOB_ROOT),
      metadataPath: toPosixPath(METADATA_PATH),
    },
    summary: {
      discoveredStoryCount: discoveredStories.length,
      metadataStoryCount: metadata.length,
      storiesWithPlayCount: storiesWithPlay.length,
      storiesWithPlayMissingMetadataCount: storiesWithPlayMissingMetadata.length,
    },
    stories: discoveredStories,
    metadata: metadata.map((entry) => ({
      key: entry.key,
      title: entry.title,
      story: entry.story,
      component: entry.component,
      layer: entry.layer,
      source: entry.source,
      interactionCount: entry.interactions.length,
      emits: entry.emits,
    })),
    graph: {
      nodes: [...nodesById.values()].sort((left, right) => left.id.localeCompare(right.id)),
      edges: edges
        .map((edge) => ({
          from: edge.from,
          to: edge.to,
          label: edge.label,
        }))
        .sort((left, right) => `${left.from}:${left.to}:${left.label}`.localeCompare(`${right.from}:${right.to}:${right.label}`)),
    },
    gaps: {
      storiesWithPlayMissingMetadata,
      storiesWithoutMetadata: discoveredStories
        .filter((story) => !coveredKeys.has(story.key))
        .map((story) => story.key)
        .sort(),
      metadataWithoutPlay: metadata
        .filter((entry) => !metadataByKey.has(entry.key) || !storyByKey.get(entry.key)?.hasPlay)
        .map((entry) => entry.key)
        .sort(),
    },
  };
}

function buildStoryGraph({ story, metadataEntry }) {
  return buildGraph({
    discoveredStories: story ? [story] : [],
    metadata: [metadataEntry],
  });
}

function renderMermaid(graph) {
  const lines = ['flowchart TD'];
  graph.graph.nodes.forEach((node) => {
    lines.push(`  ${node.id}["${escapeMermaidLabel(node.label)}"]`);
  });
  graph.graph.edges.forEach((edge) => {
    lines.push(`  ${edge.from} -->|"${escapeMermaidLabel(edge.label)}"| ${edge.to}`);
  });
  return `${lines.join('\n')}\n`;
}

function renderDot(graph) {
  const lines = ['digraph StoryInteractionGraph {', '  rankdir=LR;'];
  graph.graph.nodes.forEach((node) => {
    lines.push(`  "${node.id}" [label="${escapeDotLabel(node.label)}", shape="${dotShapeForNode(node)}"];`);
  });
  graph.graph.edges.forEach((edge) => {
    lines.push(`  "${edge.from}" -> "${edge.to}" [label="${escapeDotLabel(edge.label)}"];`);
  });
  lines.push('}');
  return `${lines.join('\n')}\n`;
}

function dotShapeForNode(node) {
  if (node.type === 'component') {
    return 'box';
  }
  if (node.type === 'action') {
    return 'diamond';
  }
  if (node.type === 'event') {
    return 'hexagon';
  }
  return 'ellipse';
}

function renderCoverageReport(graph, validation) {
  const reviewedCount = graph.metadata.filter((entry) => entry.source === 'reviewed').length;
  const draftCount = graph.metadata.filter((entry) => entry.source === 'draft').length;
  const unmappedCount = graph.summary.discoveredStoryCount - graph.summary.metadataStoryCount;
  const lines = [
    '# Story Interaction Graph Coverage',
    '',
    'Generated by `experiments/graphbased/scripts/generate-graph.mjs`.',
    '',
    '## Summary',
    '',
    `- Discovered stories: ${graph.summary.discoveredStoryCount}`,
    `- Stories with graph metadata: ${graph.summary.metadataStoryCount}`,
    `- Reviewed metadata entries: ${reviewedCount}`,
    `- Draft metadata entries: ${draftCount}`,
    `- Unmapped render-only stories: ${unmappedCount}`,
    `- Stories with Storybook play functions: ${graph.summary.storiesWithPlayCount}`,
    `- Stories with play functions but no graph metadata: ${graph.summary.storiesWithPlayMissingMetadataCount}`,
    '',
    '## Validation',
    '',
    `- Duplicate metadata keys: ${validation.duplicateKeys.length}`,
    `- Stale metadata keys: ${validation.staleMetadata.length}`,
    `- Invalid metadata entries: ${validation.invalidEntries.length}`,
    '',
    '## Highest-Value Reviewed Metadata Gaps',
    '',
  ];

  const reviewedGaps = graph.metadata.filter((entry) => entry.source === 'draft' && graph.stories.find((story) => story.key === entry.key)?.hasPlay);
  const highestValueGaps = reviewedGaps.slice(0, 40);
  if (highestValueGaps.length === 0) {
    lines.push('- None');
  } else {
    highestValueGaps.forEach((entry) => {
      lines.push(`- ${entry.key}`);
    });
  }

  lines.push('', '## Metadata Entries', '');
  graph.metadata.forEach((entry) => {
    lines.push(
      `- ${entry.key} (${entry.component}, ${entry.layer}, ${entry.source}, interactions: ${entry.interactionCount})`
    );
  });

  return `${lines.join('\n')}\n`;
}

function renderHtmlReport(
  graph,
  storyMermaidOutputs,
  captureManifest = { captures: {} },
  interactableManifest = { stories: {} }
) {
  const storyDiagramByKey = new Map(
    graph.metadata.map((entry) => [`${entry.title}/${entry.story}`, `${createOutputSlug(entry.key)}.mmd`])
  );
  const storyEntries = graph.stories.map((story) => {
    const fileName = storyDiagramByKey.get(story.key);
    return {
      key: story.key,
      title: story.title || 'Untitled',
      story: story.story,
      filePath: story.filePath,
      hasPlay: story.hasPlay,
      metadataSource: graph.metadata.find((entry) => entry.key === story.key)?.source || null,
      diagramFile: fileName || null,
      diagramSource: fileName ? storyMermaidOutputs[fileName] : null,
      capture: captureManifest.captures?.[story.key] || null,
      interactableGraph: interactableManifest.stories?.[story.key] || null,
    };
  });
  const reportData = {
    summary: graph.summary,
    stories: storyEntries,
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Story Interaction Graph Report</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f1ea;
      --panel: #fffaf0;
      --ink: #27231c;
      --muted: #6f6555;
      --line: #dccfb9;
      --accent: #126a5b;
      --accent-soft: #d9eee8;
      --missing: #9a6a1f;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(18, 106, 91, 0.16), transparent 32rem),
        linear-gradient(135deg, #f7f1e4 0%, #efe4cf 100%);
      color: var(--ink);
      font-family: Georgia, "Times New Roman", serif;
    }

    .app {
      display: grid;
      grid-template-columns: minmax(18rem, 25vw) 1fr;
      height: 100vh;
      overflow: hidden;
    }

    aside {
      border-right: 1px solid var(--line);
      background: rgba(255, 250, 240, 0.84);
      backdrop-filter: blur(10px);
      min-height: 0;
      overflow: hidden;
      padding: 1rem;
    }

    main {
      display: grid;
      grid-template-rows: auto 1fr;
      min-width: 0;
      min-height: 0;
    }

    header {
      border-bottom: 1px solid var(--line);
      background: rgba(255, 250, 240, 0.72);
      padding: 1.1rem 1.4rem;
    }

    h1,
    h2,
    h3 {
      margin: 0;
      line-height: 1.15;
    }

    h1 {
      font-size: clamp(1.5rem, 2vw, 2.2rem);
    }

    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 0.8rem;
    }

    .pill {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--panel);
      color: var(--muted);
      font-size: 0.86rem;
      padding: 0.3rem 0.65rem;
    }

    .search {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 0.55rem;
      background: white;
      color: var(--ink);
      font: inherit;
      margin: 1rem 0;
      padding: 0.55rem 0.7rem;
    }

    .tree {
      display: grid;
      gap: 0.7rem;
      max-height: calc(100vh - 6rem);
      overflow: auto;
      padding-right: 0.2rem;
    }

    details {
      border: 1px solid var(--line);
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.44);
      overflow: hidden;
    }

    summary {
      cursor: pointer;
      font-weight: 700;
      padding: 0.65rem 0.75rem;
    }

    .story-list {
      display: grid;
      gap: 0.25rem;
      padding: 0 0.45rem 0.55rem;
    }

    .story-button {
      width: 100%;
      border: 0;
      border-radius: 0.5rem;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      padding: 0.5rem 0.55rem;
      text-align: left;
    }

    .story-button:hover,
    .story-button[aria-current="true"] {
      background: var(--accent-soft);
    }

    .story-button[data-mapped="false"] {
      color: var(--muted);
    }

    .story-button[data-mapped="false"]::after {
      color: var(--missing);
      content: " no graph";
      font-size: 0.78rem;
      margin-left: 0.25rem;
    }

    .story-button[data-source="draft"]::after {
      color: var(--missing);
      content: " draft";
      font-size: 0.78rem;
      margin-left: 0.25rem;
    }

    .story-button[data-source="reviewed"]::after {
      color: var(--accent);
      content: " reviewed";
      font-size: 0.78rem;
      margin-left: 0.25rem;
    }

    .viewer {
      min-height: 0;
      overflow: auto;
      padding: 1.4rem;
    }

    .card {
      border: 1px solid var(--line);
      border-radius: 1.1rem;
      background: rgba(255, 250, 240, 0.9);
      box-shadow: 0 18px 50px rgba(50, 43, 31, 0.12);
      min-height: calc(100vh - 10rem);
      padding: 1rem;
    }

    .meta {
      color: var(--muted);
      display: grid;
      gap: 0.25rem;
      margin: 0.4rem 0 1rem;
    }

    .diagram-frame {
      align-items: center;
      background:
        linear-gradient(90deg, rgba(220, 207, 185, 0.3) 1px, transparent 1px),
        linear-gradient(rgba(220, 207, 185, 0.3) 1px, transparent 1px),
        #fffdf7;
      background-size: 24px 24px;
      border: 1px solid var(--line);
      border-radius: 0.85rem;
      display: flex;
      justify-content: center;
      min-height: 28rem;
      overflow: auto;
      padding: 1rem;
    }

    .diagram-frame img {
      max-width: 100%;
    }

    .empty {
      color: var(--muted);
      max-width: 38rem;
      text-align: center;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin: 1rem 0;
    }

    .actions button {
      border: 1px solid var(--accent);
      border-radius: 0.5rem;
      background: var(--accent);
      color: white;
      cursor: pointer;
      font: inherit;
      padding: 0.45rem 0.75rem;
    }

    .actions button.secondary {
      background: transparent;
      color: var(--accent);
    }

    .zoom-controls {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
      margin: 0.75rem 0;
    }

    .zoom-controls button {
      border: 1px solid var(--accent);
      border-radius: 0.45rem;
      background: transparent;
      color: var(--accent);
      cursor: pointer;
      font: inherit;
      min-width: 2.2rem;
      padding: 0.35rem 0.55rem;
    }

    .zoom-controls input {
      accent-color: var(--accent);
      width: min(20rem, 100%);
    }

    .zoom-controls output {
      color: var(--muted);
      min-width: 4rem;
    }

    pre {
      background: #27231c;
      border-radius: 0.75rem;
      color: #fff8e8;
      overflow: auto;
      padding: 1rem;
      white-space: pre-wrap;
    }

    .capture-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin-top: 1rem;
    }

    .mermaid-viewport {
      transform-origin: top left;
    }

    .capture-card {
      border: 1px solid var(--line);
      border-radius: 0.85rem;
      background: #fffdf7;
      overflow: hidden;
    }

    .capture-card h3 {
      border-bottom: 1px solid var(--line);
      color: var(--muted);
      font-size: 0.95rem;
      padding: 0.55rem 0.7rem;
    }

    .capture-card img {
      display: block;
      width: 100%;
    }

    .report-section {
      margin-top: 1rem;
    }

    .section-heading {
      align-items: baseline;
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: space-between;
      margin-bottom: 0.65rem;
    }

    .section-heading p {
      color: var(--muted);
      margin: 0;
    }

    .interactable-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin: 0.5rem 0 0.75rem;
    }

    .interactable-frame {
      align-items: flex-start;
      background: #fffdf7;
      border: 1px solid var(--line);
      border-radius: 0.85rem;
      display: flex;
      justify-content: flex-start;
      min-height: 28rem;
      overflow: auto;
      padding: 1rem;
    }

    .interactable-viewport {
      display: inline-block;
      transform-origin: top left;
    }

    @media (max-width: 820px) {
      .app {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(16rem, 45vh) 1fr;
      }

      aside {
        border-bottom: 1px solid var(--line);
        border-right: 0;
      }

      .tree {
        max-height: calc(45vh - 6rem);
      }

      .capture-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <aside>
      <h2>Stories</h2>
      <input class="search" id="storySearch" type="search" placeholder="Filter stories">
      <nav class="tree" id="storyTree" aria-label="Story hierarchy"></nav>
    </aside>
    <main>
      <header>
        <h1>Story Interaction Graph Report</h1>
        <div class="summary" id="summary"></div>
      </header>
      <section class="viewer">
        <article class="card">
          <h2 id="storyTitle">Select a mapped story</h2>
          <div class="meta" id="storyMeta"></div>
          <div class="actions">
            <button type="button" id="downloadPngButton">Download PNG</button>
            <button type="button" class="secondary" id="toggleSourceButton">Show Mermaid Source</button>
          </div>
          <section id="captureSection" hidden></section>
          <section class="report-section" id="interactableSection" hidden>
            <div class="section-heading">
              <h3>Interactable Elements</h3>
              <p>Experimental one-step runtime crawl from fresh story loads.</p>
            </div>
            <div class="interactable-stats" id="interactableStats"></div>
            <div class="zoom-controls" aria-label="Interactable element graph zoom controls">
              <button type="button" id="interactableZoomOutButton" aria-label="Zoom interactable graph out">-</button>
              <input id="interactableZoomSlider" type="range" min="30" max="500" step="10" value="100" aria-label="Interactable graph zoom">
              <button type="button" id="interactableZoomInButton" aria-label="Zoom interactable graph in">+</button>
              <output id="interactableZoomValue">100%</output>
            </div>
            <div class="interactable-frame" id="interactableFrame"></div>
          </section>
          <div class="zoom-controls" aria-label="Mermaid diagram zoom controls">
            <button type="button" id="zoomOutButton" aria-label="Zoom out">-</button>
            <input id="zoomSlider" type="range" min="20" max="500" step="5" value="30" aria-label="Diagram zoom">
            <button type="button" id="zoomInButton" aria-label="Zoom in">+</button>
            <output id="zoomValue">30%</output>
          </div>
          <div class="diagram-frame" id="diagramFrame">
            <p class="empty">Choose a story with graph metadata from the left sidebar.</p>
          </div>
          <pre id="sourcePanel" hidden></pre>
        </article>
      </section>
    </main>
  </div>

  <script type="application/json" id="reportData">${JSON.stringify(reportData).replace(/</g, '\\u003c')}</script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

    const data = JSON.parse(document.getElementById('reportData').textContent);
    const state = {
      selectedKey: null,
      pngDataUrl: null,
    };

    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default' });

    const summary = document.getElementById('summary');
    const storyTree = document.getElementById('storyTree');
    const storySearch = document.getElementById('storySearch');
    const storyTitle = document.getElementById('storyTitle');
    const storyMeta = document.getElementById('storyMeta');
    const diagramFrame = document.getElementById('diagramFrame');
    const captureSection = document.getElementById('captureSection');
    const interactableSection = document.getElementById('interactableSection');
    const interactableStats = document.getElementById('interactableStats');
    const interactableFrame = document.getElementById('interactableFrame');
    const interactableZoomOutButton = document.getElementById('interactableZoomOutButton');
    const interactableZoomInButton = document.getElementById('interactableZoomInButton');
    const interactableZoomSlider = document.getElementById('interactableZoomSlider');
    const interactableZoomValue = document.getElementById('interactableZoomValue');
    const sourcePanel = document.getElementById('sourcePanel');
    const downloadPngButton = document.getElementById('downloadPngButton');
    const toggleSourceButton = document.getElementById('toggleSourceButton');
    const zoomOutButton = document.getElementById('zoomOutButton');
    const zoomInButton = document.getElementById('zoomInButton');
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');

    function renderSummary() {
      const items = [
        ['Discovered', data.summary.discoveredStoryCount],
        ['Mapped', data.summary.metadataStoryCount],
        ['With play', data.summary.storiesWithPlayCount],
        ['Play gaps', data.summary.storiesWithPlayMissingMetadataCount],
      ];
      summary.innerHTML = items.map(([label, value]) => '<span class="pill">' + label + ': ' + value + '</span>').join('');
    }

    function groupStories(stories) {
      return stories.reduce((groups, story) => {
        const title = story.title || 'Untitled';
        if (!groups.has(title)) {
          groups.set(title, []);
        }
        groups.get(title).push(story);
        return groups;
      }, new Map());
    }

    function renderTree() {
      const filter = storySearch.value.trim().toLowerCase();
      const stories = data.stories.filter((story) => story.key.toLowerCase().includes(filter));
      const groups = groupStories(stories);
      storyTree.innerHTML = '';

      [...groups.entries()].forEach(([title, groupStories]) => {
        const details = document.createElement('details');
        details.open = groupStories.some((story) => story.diagramSource);
        const summaryElement = document.createElement('summary');
        summaryElement.textContent = title + ' (' + groupStories.length + ')';
        const list = document.createElement('div');
        list.className = 'story-list';

        groupStories.forEach((story) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'story-button';
          button.dataset.key = story.key;
          button.dataset.mapped = String(Boolean(story.diagramSource));
          button.dataset.source = story.metadataSource || 'missing';
          button.textContent = story.story;
          button.setAttribute('aria-current', String(story.key === state.selectedKey));
          button.addEventListener('click', () => selectStory(story.key));
          list.appendChild(button);
        });

        details.appendChild(summaryElement);
        details.appendChild(list);
        storyTree.appendChild(details);
      });
    }

    function getSelectedStory() {
      return data.stories.find((story) => story.key === state.selectedKey);
    }

    async function selectStory(key) {
      state.selectedKey = key;
      state.pngDataUrl = null;
      renderTree();

      const story = getSelectedStory();
      storyTitle.textContent = story.key;
      storyMeta.innerHTML = [
        'File: ' + story.filePath,
        'Storybook play function: ' + (story.hasPlay ? 'yes' : 'no'),
        'Graph metadata: ' + (story.diagramSource ? story.metadataSource : 'missing'),
      ].map((line) => '<span>' + line + '</span>').join('');

      sourcePanel.textContent = story.diagramSource || '';
      renderCaptures(story);
      await renderInteractableGraph(story);
      if (!story.diagramSource) {
        diagramFrame.innerHTML = '<p class="empty">This story has no graph metadata yet, so there is no Mermaid diagram to render.</p>';
        return;
      }

      diagramFrame.innerHTML = '<p class="empty">Rendering diagram...</p>';
      try {
        const renderId = 'story-graph-' + Math.random().toString(36).slice(2);
        const rendered = await mermaid.render(renderId, story.diagramSource);
        diagramFrame.innerHTML = '<div class="mermaid-viewport" id="mermaidViewport">' + rendered.svg + '</div>';
        const svgElement = diagramFrame.querySelector('svg');
        if (svgElement) {
          svgElement.setAttribute('role', 'img');
          svgElement.setAttribute('aria-label', 'Interaction graph for ' + story.key);
          svgElement.style.height = 'auto';
        }
        applyZoom();
        svgToPngDataUrl(rendered.svg)
          .then((pngDataUrl) => {
            if (state.selectedKey === story.key) {
              state.pngDataUrl = pngDataUrl;
            }
          })
          .catch((error) => {
            console.warn('PNG conversion failed; SVG preview remains available.', error);
          });
      } catch (error) {
        diagramFrame.innerHTML = '<p class="empty">Unable to render Mermaid diagram. Use “Show Mermaid Source” to inspect the source.</p>';
        console.error(error);
      }
    }

    function renderCaptures(story) {
      if (!story.capture || story.capture.status !== 'captured') {
        captureSection.hidden = true;
        captureSection.innerHTML = '';
        return;
      }

      captureSection.hidden = false;
      if (story.capture.kind === 'rendered') {
        captureSection.innerHTML =
          '<h3>Storybook Screenshot</h3>' +
          '<div class="capture-grid single">' +
          '<article class="capture-card"><h3>Rendered story</h3><img alt="Rendered screenshot for ' +
          story.key.replace(/"/g, "'") +
          '" src="' +
          story.capture.renderedImage +
          '"></article>' +
          '</div>';
        return;
      }

      captureSection.innerHTML =
        '<h3>Storybook Screenshots</h3>' +
        '<div class="capture-grid">' +
        '<article class="capture-card"><h3>Start / early render</h3><img alt="Start screenshot for ' +
        story.key.replace(/"/g, "'") +
        '" src="' +
        story.capture.startImage +
        '"></article>' +
        '<article class="capture-card"><h3>End / after play settles</h3><img alt="End screenshot for ' +
        story.key.replace(/"/g, "'") +
        '" src="' +
        story.capture.endImage +
        '"></article>' +
        '</div>';
    }

    async function renderInteractableGraph(story) {
      const graph = story.interactableGraph;
      if (!graph || !graph.mermaidSource) {
        interactableSection.hidden = true;
        interactableStats.innerHTML = '';
        interactableFrame.innerHTML = '';
        return;
      }

      interactableSection.hidden = false;
      const stats = graph.summary || {};
      interactableStats.innerHTML = [
        ['Initial elements', stats.initialElementCount ?? graph.initialElements?.length ?? 0],
        ['Attempted', stats.attemptedActionCount ?? 0],
        ['Passed', stats.passedActionCount ?? 0],
        ['Skipped', stats.skippedActionCount ?? 0],
        ['Failed', stats.failedActionCount ?? 0],
      ].map(([label, value]) => '<span class="pill">' + label + ': ' + value + '</span>').join('');
      interactableFrame.innerHTML = '<p class="empty">Rendering interactable element graph...</p>';

      try {
        const renderId = 'interactable-graph-' + Math.random().toString(36).slice(2);
        const rendered = await mermaid.render(renderId, graph.mermaidSource);
        interactableFrame.innerHTML = '<div class="interactable-viewport" id="interactableViewport">' + rendered.svg + '</div>';
        const svgElement = interactableFrame.querySelector('svg');
        if (svgElement) {
          svgElement.setAttribute('role', 'img');
          svgElement.setAttribute('aria-label', 'Interactable element graph for ' + story.key);
          svgElement.style.maxWidth = 'none';
          const box = svgElement.viewBox?.baseVal;
          const width = Math.ceil(box?.width || svgElement.getBoundingClientRect().width || 1000);
          const height = Math.ceil(box?.height || svgElement.getBoundingClientRect().height || 700);
          svgElement.dataset.baseWidth = String(width);
          svgElement.dataset.baseHeight = String(height);
          svgElement.style.width = width + 'px';
          svgElement.style.height = height + 'px';
        }
        applyInteractableZoom();
      } catch (error) {
        interactableFrame.innerHTML = '<p class="empty">Unable to render interactable Mermaid diagram.</p>';
        console.error(error);
      }
    }

    function svgToPngDataUrl(svgText) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = 2;
          canvas.width = Math.max(1, image.width * scale);
          canvas.height = Math.max(1, image.height * scale);
          const context = canvas.getContext('2d');
          context.fillStyle = '#fffdf7';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Unable to convert SVG to PNG.'));
        };
        image.src = url;
        setTimeout(() => {
          URL.revokeObjectURL(url);
          reject(new Error('Timed out converting SVG to PNG.'));
        }, 3000);
      });
    }

    downloadPngButton.addEventListener('click', () => {
      const story = getSelectedStory();
      if (!story || !state.pngDataUrl) {
        return;
      }

      const link = document.createElement('a');
      link.href = state.pngDataUrl;
      link.download = story.diagramFile.replace(/\\.mmd$/, '.png');
      link.click();
    });

    toggleSourceButton.addEventListener('click', () => {
      sourcePanel.hidden = !sourcePanel.hidden;
      toggleSourceButton.textContent = sourcePanel.hidden ? 'Show Mermaid Source' : 'Hide Mermaid Source';
    });

    storySearch.addEventListener('input', renderTree);
    interactableZoomSlider.addEventListener('input', applyInteractableZoom);
    interactableZoomOutButton.addEventListener('click', () => {
      interactableZoomSlider.value = String(
        Math.max(
          Number(interactableZoomSlider.min),
          Number(interactableZoomSlider.value) - Number(interactableZoomSlider.step)
        )
      );
      applyInteractableZoom();
    });
    interactableZoomInButton.addEventListener('click', () => {
      interactableZoomSlider.value = String(
        Math.min(
          Number(interactableZoomSlider.max),
          Number(interactableZoomSlider.value) + Number(interactableZoomSlider.step)
        )
      );
      applyInteractableZoom();
    });
    zoomSlider.addEventListener('input', applyZoom);
    zoomOutButton.addEventListener('click', () => {
      zoomSlider.value = String(Math.max(Number(zoomSlider.min), Number(zoomSlider.value) - Number(zoomSlider.step)));
      applyZoom();
    });
    zoomInButton.addEventListener('click', () => {
      zoomSlider.value = String(Math.min(Number(zoomSlider.max), Number(zoomSlider.value) + Number(zoomSlider.step)));
      applyZoom();
    });

    function applyZoom() {
      const zoom = Number(zoomSlider.value || 30);
      zoomValue.textContent = zoom + '%';
      const viewport = document.getElementById('mermaidViewport');
      if (!viewport) {
        return;
      }
      viewport.style.transform = 'scale(' + zoom / 100 + ')';
      viewport.style.width = 100 / (zoom / 100) + '%';
    }

    function applyInteractableZoom() {
      const zoom = Number(interactableZoomSlider.value || 100);
      const scale = zoom / 100;
      interactableZoomValue.textContent = zoom + '%';
      const viewport = document.getElementById('interactableViewport');
      if (!viewport) {
        return;
      }
      const svgElement = viewport.querySelector('svg');
      const baseWidth = Number(svgElement?.dataset.baseWidth || 1000);
      const baseHeight = Number(svgElement?.dataset.baseHeight || 700);
      viewport.style.transform = 'none';
      viewport.style.width = Math.ceil(baseWidth * scale) + 'px';
      viewport.style.height = Math.ceil(baseHeight * scale) + 'px';
      if (svgElement) {
        svgElement.style.width = Math.ceil(baseWidth * scale) + 'px';
        svgElement.style.height = Math.ceil(baseHeight * scale) + 'px';
      }
      interactableFrame.style.height = Math.min(160, Math.max(28, (baseHeight * scale) / 16 + 4)) + 'rem';
    }

    renderSummary();
    renderTree();
    const firstMappedStory = data.stories.find((story) => story.diagramSource);
    if (firstMappedStory) {
      selectStory(firstMappedStory.key);
    }
  </script>
</body>
</html>
`;
}

function generateExperiment() {
  const discoveredStories = discoverStories();
  const reviewedMetadata = loadMetadata(METADATA_PATH, 'reviewed');
  const draftMetadata = normalizeMetadataEntries(createDraftMetadata(discoveredStories), 'draft');
  const metadata = mergeMetadata({ reviewedMetadata, draftMetadata });
  const validation = validateMetadata(metadata, discoveredStories);
  const graph = buildGraph({ discoveredStories, metadata });
  const captureManifest = loadCaptureManifest();
  const interactableManifest = loadInteractableManifest();
  const storyByKey = new Map(discoveredStories.map((story) => [story.key, story]));
  const storyMermaidOutputs = Object.fromEntries(
    metadata
      .map((entry) => {
        const storyGraph = buildStoryGraph({
          story: storyByKey.get(entry.key),
          metadataEntry: entry,
        });
        return [`${createOutputSlug(entry.key)}.mmd`, renderMermaid(storyGraph)];
      })
      .sort(([left], [right]) => left.localeCompare(right))
  );

  return {
    graph,
    validation,
    outputs: {
      json: `${JSON.stringify(graph, null, 2)}\n`,
      mermaid: renderMermaid(graph),
      dot: renderDot(graph),
      report: renderCoverageReport(graph, validation),
      storyMermaidOutputs,
      html: renderHtmlReport(graph, storyMermaidOutputs, captureManifest, interactableManifest),
      draftMetadata: `${JSON.stringify(draftMetadata, null, 2)}\n`,
    },
  };
}

function writeExperimentOutputs(outputs, outputDir = OUTPUT_DIR) {
  writeFileSync(path.join(outputDir, 'story-interaction-graph.json'), outputs.json);
  writeFileSync(path.join(outputDir, 'story-interaction-graph.mmd'), outputs.mermaid);
  writeFileSync(path.join(outputDir, 'story-interaction-graph.dot'), outputs.dot);
  writeFileSync(path.join(outputDir, 'coverage-report.md'), outputs.report);
  writeFileSync(path.join(outputDir, 'index.html'), outputs.html);
  writeFileSync(DRAFT_METADATA_PATH, outputs.draftMetadata);

  const storyOutputDir = path.join(outputDir, 'stories');
  rmSync(storyOutputDir, { force: true, recursive: true });
  mkdirSync(storyOutputDir, { recursive: true });
  Object.entries(outputs.storyMermaidOutputs).forEach(([fileName, contents]) => {
    writeFileSync(path.join(storyOutputDir, fileName), contents);
  });
}

export {
  OUTPUT_DIR,
  buildGraph,
  buildStoryGraph,
  createDraftMetadata,
  discoverStories,
  generateExperiment,
  loadCaptureManifest,
  loadInteractableManifest,
  loadMetadata,
  mergeMetadata,
  normalizeMetadataEntries,
  renderCoverageReport,
  renderDot,
  renderHtmlReport,
  renderMermaid,
  validateMetadata,
  writeExperimentOutputs,
};
