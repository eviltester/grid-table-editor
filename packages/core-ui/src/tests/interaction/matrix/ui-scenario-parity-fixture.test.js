import { test, expect, jest } from '@jest/globals';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { probeUiScenarioParity } from './support/ui-scenario-parity.js';

const matrixFixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix.json'
);
const parityFixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/matrix/fixtures/ui-scenario-parity.json'
);

const parityFixtureTest = process.env.WRITE_UI_SCENARIO_PARITY === '1' ? test : test.skip;

parityFixtureTest(
  'probes ui scenario parity and writes the parity fixture',
  async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const scenarios = JSON.parse(readFileSync(matrixFixturePath, 'utf8')).uiScenarios;
    const parityByScenarioId = await probeUiScenarioParity(scenarios);
    writeFileSync(parityFixturePath, JSON.stringify(parityByScenarioId, null, 2));

    expect(Object.keys(parityByScenarioId)).toHaveLength(scenarios.length);
    expect(Object.values(parityByScenarioId).every((entry) => ['exact', 'structural'].includes(entry.mode))).toBe(true);

    console.warn.mockRestore();
  },
  180000
);
