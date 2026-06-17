import { describe, test, expect } from '@jest/globals';
import {
  buildChunkDescriptors,
  formatCommandsForConsole,
  getScenarioDisplayOrigin,
  renderMatrixSummaryMarkdown,
} from './support/schema-interaction-matrix-report.js';

describe('schema interaction matrix report', () => {
  test('buildChunkDescriptors includes scenario ids in labels', () => {
    const chunks = buildChunkDescriptors([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 2);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].label).toContain('a .. b');
    expect(chunks[1].label).toContain('c .. c');
  });

  test('formatCommandsForConsole groups commands by source type', () => {
    const text = formatCommandsForConsole([
      { sourceType: 'faker', command: 'helpers.fake' },
      { sourceType: 'domain', command: 'string.counterString' },
      { sourceType: 'faker', command: 'helpers.mustache' },
    ]);

    expect(text).toContain('domain(1): string.counterString');
    expect(text).toContain('faker(2): helpers.fake, helpers.mustache');
  });

  test('getScenarioDisplayOrigin prefers the specific non-custom origin when multiple tags exist', () => {
    expect(getScenarioDisplayOrigin({ origins: ['custom', 'empty'] })).toBe('empty');
    expect(getScenarioDisplayOrigin({ origins: ['custom', 'pairwise'] })).toBe('pairwise');
    expect(getScenarioDisplayOrigin({ origins: ['custom'] })).toBe('custom');
    expect(getScenarioDisplayOrigin({ origins: ['base'] })).toBe('base');
  });

  test('renderMatrixSummaryMarkdown includes ui parity counts and structural-only list', () => {
    const scenario = {
      id: 'faker-helpers-fake-base',
      sourceType: 'faker',
      command: 'helpers.fake',
      label: 'helpers.fake',
      rows: [{ name: 'Value', sourceType: 'faker', command: 'helpers.fake', params: '("{{person.firstName}}")' }],
      origins: ['base'],
      parityMode: 'structural',
    };

    const markdown = renderMatrixSummaryMarkdown({
      generatedAt: '2026-05-21T00:00:00.000Z',
      coverageScenarios: [scenario],
      runtimeScenarios: [scenario],
      uiScenarios: [scenario],
      previewDataByScenarioId: {
        [scenario.id]: {
          status: 'generated',
          csv: '"Value"\n"Ada"',
        },
      },
      uiParityByScenarioId: {
        [scenario.id]: {
          mode: 'structural',
          exactPreviewParity: false,
          structuralParity: true,
        },
      },
    });

    expect(markdown).toContain('Exact preview parity scenario count: **0**');
    expect(markdown).toContain('Structural-only preview parity scenario count: **1**');
    expect(markdown).toContain('### Structural-Only UI Scenarios');
    expect(markdown).toContain('- `faker-helpers-fake-base` - `helpers.fake("{{person.firstName}}")`');
    expect(markdown).toContain('- UI preview parity: `structural`');
  });
});
