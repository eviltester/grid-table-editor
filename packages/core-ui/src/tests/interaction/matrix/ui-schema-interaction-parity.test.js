/*
 * Purpose:
 * - Detects drift between the embedded app test-data UI and the standalone generator UI.
 *
 * Asserts:
 * - the same uiScenario produces the same semantic preview CSV in both UIs
 * - pairwise-eligible scenarios produce the same pairwise CSV in both UIs
 * - parity is checked on normalized generated content rather than widget-specific DOM markup
 */

import { jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createAppTestDataInteractionHarness } from './support/app-test-data-interaction-harness.js';
import { createGeneratorInteractionHarness } from './support/generator-interaction-harness.js';
import { buildChunkDescriptors, formatCommandsForConsole } from './support/schema-interaction-matrix-report.js';
import { normaliseMultilineText } from './support/ui-scenario-parity.js';

const fixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix.json'
);
const scenarios = JSON.parse(readFileSync(fixturePath, 'utf8')).uiScenarios;
const CHUNK_SIZE = 20;
const chunkDescriptors = buildChunkDescriptors(scenarios, CHUNK_SIZE);

function assertScenarioParity({ scenario, appResult, generatorResult }) {
  expect(appResult.headers).toEqual(generatorResult.headers);
  expect(appResult.rowCount).toBe(generatorResult.rowCount);

  if (scenario.parityMode === 'exact') {
    const appPreviewCsv = normaliseMultilineText(appResult.previewCsv);
    const generatorPreviewCsv = normaliseMultilineText(generatorResult.previewCsv);
    expect(appPreviewCsv).toBe(generatorPreviewCsv);
  }

  if (scenario.pairwiseEligible) {
    const appPairwiseCsv = normaliseMultilineText(appResult.pairwiseCsv);
    const generatorPairwiseCsv = normaliseMultilineText(generatorResult.pairwiseCsv);
    expect(appPairwiseCsv).toBe(generatorPairwiseCsv);
  }
}

describe('ui schema interaction parity matrix', () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const exactScenarios = scenarios.filter((scenario) => scenario.parityMode === 'exact');
    const structuralScenarios = scenarios.filter((scenario) => scenario.parityMode === 'structural');
    console.info(`[ui-parity-matrix] fixture=${fixturePath}`);
    console.info(`[ui-parity-matrix] scenarios=${scenarios.length} chunks=${chunkDescriptors.length}`);
    console.info(`[ui-parity-matrix] exact=${exactScenarios.length} structural=${structuralScenarios.length}`);
    console.info(`[ui-parity-matrix] commands\n${formatCommandsForConsole(scenarios)}`);
    console.info(
      `[ui-parity-matrix] structural-only\n${
        structuralScenarios
          .map((scenario) => `${scenario.id}: ${scenario.rows.map((row) => row.command || row.sourceType).join(' | ')}`)
          .join('\n') || 'none'
      }`
    );
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  test.each(chunkDescriptors.map((descriptor) => [descriptor.label, descriptor.scenarios]))(
    '%s',
    async (_chunkLabel, scenarioChunk) => {
      const failures = [];
      for (const scenario of scenarioChunk) {
        let appHarness = null;
        let generatorHarness = null;
        try {
          appHarness = createAppTestDataInteractionHarness();
          const appResult = await appHarness.runScenario(scenario);
          appHarness.cleanup();
          appHarness = null;

          generatorHarness = createGeneratorInteractionHarness();
          const generatorResult = await generatorHarness.runScenario(scenario);
          generatorHarness.cleanup();
          generatorHarness = null;

          assertScenarioParity({ scenario, appResult, generatorResult });
        } catch (error) {
          failures.push(`${scenario.id}: ${error.message}`);
        } finally {
          appHarness?.cleanup();
          generatorHarness?.cleanup();
        }
      }

      if (failures.length > 0) {
        throw new Error(failures.slice(0, 10).join('\n'));
      }
    },
    60000
  );
});
