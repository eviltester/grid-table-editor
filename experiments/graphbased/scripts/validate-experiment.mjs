import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { OUTPUT_DIR, generateExperiment } from './graphbased-lib.mjs';

const { validation, outputs } = generateExperiment();

if (!validation.ok) {
  console.error('Graph metadata validation failed.');
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

const expectedByFile = {
  'story-interaction-graph.json': outputs.json,
  'story-interaction-graph.mmd': outputs.mermaid,
  'story-interaction-graph.dot': outputs.dot,
  'coverage-report.md': outputs.report,
  'index.html': outputs.html,
  '../metadata/story-interactions.draft.json': outputs.draftMetadata,
};

const mismatches = Object.entries(expectedByFile)
  .map(([fileName, expected]) => {
    const filePath = path.join(OUTPUT_DIR, fileName);
    const actual = readFileSync(filePath, 'utf8');
    return actual === expected ? null : fileName;
  })
  .filter(Boolean);

const storyOutputDir = path.join(OUTPUT_DIR, 'stories');
const expectedStoryFiles = Object.keys(outputs.storyMermaidOutputs).sort();
const actualStoryFiles = existsSync(storyOutputDir)
  ? readdirSync(storyOutputDir).filter((fileName) => fileName.endsWith('.mmd')).sort()
  : [];

if (JSON.stringify(actualStoryFiles) !== JSON.stringify(expectedStoryFiles)) {
  mismatches.push('stories/*.mmd file list');
}

expectedStoryFiles.forEach((fileName) => {
  const filePath = path.join(storyOutputDir, fileName);
  const actual = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  if (actual !== outputs.storyMermaidOutputs[fileName]) {
    mismatches.push(`stories/${fileName}`);
  }
});

if (mismatches.length > 0) {
  console.error('Generated output is not deterministic or is out of date.');
  console.error(`Mismatched files: ${mismatches.join(', ')}`);
  console.error('Run: node experiments/graphbased/scripts/generate-graph.mjs');
  process.exit(1);
}

console.log('Graph-based Storybook experiment metadata and outputs are valid.');
