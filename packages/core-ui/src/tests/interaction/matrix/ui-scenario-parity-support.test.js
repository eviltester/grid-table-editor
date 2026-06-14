import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { normaliseMultilineText, probeUiScenarioParity } from './support/ui-scenario-parity.js';

const fixturePath = join(
  process.cwd(),
  'packages/core-ui/src/tests/interaction/matrix/fixtures/schema-interaction-matrix.json'
);
const uiScenarios = JSON.parse(readFileSync(fixturePath, 'utf8')).uiScenarios;

describe('ui scenario parity support', () => {
  test('normaliseMultilineText trims and normalises CRLF', () => {
    expect(normaliseMultilineText('a\r\nb\r\n')).toBe('a\nb');
  });

  test('probeUiScenarioParity classifies representative exact and structural scenarios', async () => {
    const parityByScenarioId = await probeUiScenarioParity(
      uiScenarios.filter((scenario) =>
        ['custom-literal-base', 'custom-regex-base', 'faker-helpers-mustache-base'].includes(scenario.id)
      )
    );

    expect(parityByScenarioId['custom-literal-base']).toEqual({
      mode: 'exact',
      exactPreviewParity: true,
      structuralParity: true,
    });
    expect(parityByScenarioId['custom-regex-base']).toEqual({
      mode: 'structural',
      exactPreviewParity: false,
      structuralParity: true,
    });
    expect(parityByScenarioId['faker-helpers-mustache-base']).toEqual({
      mode: 'exact',
      exactPreviewParity: true,
      structuralParity: true,
    });
  }, 120000);
});
