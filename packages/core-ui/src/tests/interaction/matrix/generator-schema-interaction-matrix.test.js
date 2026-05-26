/*
 * Purpose:
 * - Exercises the standalone generator page in JSDOM using user-like interactions.
 *
 * Asserts:
 * - scenario rows can be entered through the generator UI
 * - schema mode syncs rows into the text editor form
 * - preview generation produces data and output preview text
 * - file generation produces downloadable output
 * - pairwise generation is available and works for eligible scenarios
 * - command help links rendered in the DOM match the live definition metadata
 */

import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createGeneratorInteractionHarness } from './support/generator-interaction-harness.js';
import { buildChunkDescriptors, formatCommandsForConsole } from './support/schema-interaction-matrix-report.js';

const fixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix.json'
);
const scenarios = JSON.parse(readFileSync(fixturePath, 'utf8')).uiScenarios;
const CHUNK_SIZE = 20;
const chunkDescriptors = buildChunkDescriptors(scenarios, CHUNK_SIZE);

describe('generator schema interaction matrix', () => {
  let harness;

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    harness = createGeneratorInteractionHarness();
    console.info(`[generator-matrix] fixture=${fixturePath}`);
    console.info(`[generator-matrix] scenarios=${scenarios.length} chunks=${chunkDescriptors.length}`);
    console.info(`[generator-matrix] commands\n${formatCommandsForConsole(scenarios)}`);
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
    60000
  );
});
