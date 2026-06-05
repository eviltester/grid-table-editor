import { generateExperiment, writeExperimentOutputs } from './graphbased-lib.mjs';

const { graph, validation, outputs } = generateExperiment();
writeExperimentOutputs(outputs);

if (!validation.ok) {
  console.error('Graph metadata validation failed.');
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(`Discovered ${graph.summary.discoveredStoryCount} stories.`);
console.log(`Mapped ${graph.summary.metadataStoryCount} stories into the interaction graph.`);
console.log(`Stories with play functions missing metadata: ${graph.summary.storiesWithPlayMissingMetadataCount}.`);
console.log(`Generated ${Object.keys(outputs.storyMermaidOutputs).length} per-story Mermaid diagrams.`);
