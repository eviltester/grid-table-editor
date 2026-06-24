/*
 * Purpose:
 * - Exercises the embedded app-page test-data panel in JSDOM using user-like interactions.
 *
 * Asserts:
 * - scenario rows can be entered through the schema grid controls
 * - grid edits sync into the schema text area
 * - schema text can be reapplied back into the grid model
 * - generate fills the grid-facing data table with real generated data
 * - preview text refresh renders exported output text
 * - pairwise generation is exposed and works for eligible scenarios
 *
 * Notes:
 * - This suite is intentionally a small page-wiring smoke subset.
 * - Broader schema semantics remain covered by the runtime matrix and focused component/browser tests.
 */

import { jest } from '@jest/globals';
import { createAppTestDataInteractionHarness } from './support/app-test-data-interaction-harness.js';
import { buildUiInteractionScenarios } from './support/schema-interaction-scenario-builder.js';
import { buildChunkDescriptors, formatCommandsForConsole } from './support/schema-interaction-matrix-report.js';
import { findScenarioByLogicalId } from './support/scenario-fixture-identity.js';

const scenarioSource = 'buildUiInteractionScenarios()';
const SMOKE_SCENARIO_IDS = [
  'custom-literal-base',
  'custom-regex-base',
  'faker-helpers-arrayElement-base',
  'domain-commerce-price-example-1',
  'custom-enum-pairwise',
];
const allScenarios = buildUiInteractionScenarios();
const scenarios = SMOKE_SCENARIO_IDS.map((scenarioId) => findScenarioByLogicalId(allScenarios, scenarioId)).filter(
  Boolean
);
if (scenarios.length !== SMOKE_SCENARIO_IDS.length) {
  throw new Error('app schema interaction smoke subset is missing fixture scenarios');
}
const CHUNK_SIZE = 20;
const chunkDescriptors = buildChunkDescriptors(scenarios, CHUNK_SIZE);

describe('app test-data schema interaction matrix', () => {
  let harness;

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    harness = createAppTestDataInteractionHarness();
    console.info(`[app-matrix] source=${scenarioSource}`);
    console.info(`[app-matrix] scenarios=${scenarios.length} chunks=${chunkDescriptors.length}`);
    console.info(`[app-matrix] commands\n${formatCommandsForConsole(scenarios)}`);
  });

  afterAll(() => {
    harness?.cleanup();
    console.warn.mockRestore();
  });

  test.each(chunkDescriptors.map((descriptor) => [descriptor.label, descriptor.scenarios]))(
    '%s',
    async (_chunkLabel, scenarioChunk) => {
      const failures = [];
      for (const scenario of scenarioChunk) {
        try {
          await harness.runScenario(scenario);
        } catch (error) {
          failures.push(`${scenario.id}: ${error.message}`);
        }
      }

      if (failures.length > 0) {
        throw new Error(failures.slice(0, 10).join('\n'));
      }
    },
    120000
  );
});
