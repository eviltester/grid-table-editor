import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normaliseMultilineText, probeUiScenarioParity } from './support/ui-scenario-parity.js';
import { findScenarioByLogicalId, getScenarioLogicalId } from './support/scenario-fixture-identity.js';

const fixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix.json'
);
const matrixFixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
const uiScenarios = matrixFixture.uiScenarios;

describe('ui scenario parity support', () => {
  test('fixture scenario ids are unique across coverage, runtime, and ui subsets', () => {
    const allScenarios = [
      ...(matrixFixture.coverageScenarios || []),
      ...(matrixFixture.runtimeScenarios || []),
      ...(matrixFixture.uiScenarios || []),
    ];
    const ids = allScenarios.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('normaliseMultilineText trims and normalises CRLF', () => {
    expect(normaliseMultilineText('a\r\nb\r\n')).toBe('a\nb');
  });

  test('probeUiScenarioParity classifies representative exact and structural scenarios', async () => {
    const literalScenario = findScenarioByLogicalId(uiScenarios, 'custom-literal-base');
    const regexScenario = findScenarioByLogicalId(uiScenarios, 'custom-regex-base');
    const mustacheScenario = findScenarioByLogicalId(uiScenarios, 'faker-helpers-mustache-base');
    const parityByScenarioId = await probeUiScenarioParity(
      [literalScenario, regexScenario, mustacheScenario].filter(Boolean)
    );

    expect(parityByScenarioId[literalScenario.id]).toEqual({
      mode: 'exact',
      exactPreviewParity: true,
      structuralParity: true,
    });
    expect(getScenarioLogicalId(literalScenario)).toBe('custom-literal-base');
    expect(parityByScenarioId[regexScenario.id]).toEqual({
      mode: 'exact',
      exactPreviewParity: true,
      structuralParity: true,
    });
    expect(getScenarioLogicalId(regexScenario)).toBe('custom-regex-base');
    expect(parityByScenarioId[mustacheScenario.id]).toEqual({
      mode: 'exact',
      exactPreviewParity: true,
      structuralParity: true,
    });
    expect(getScenarioLogicalId(mustacheScenario)).toBe('faker-helpers-mustache-base');
  }, 120000);
});
