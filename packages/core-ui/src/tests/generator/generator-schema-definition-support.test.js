import { describe, expect, test } from '@jest/globals';
import {
  createGeneratorSchemaDefinitionSupport,
  createGeneratorSchemaRowFactory,
} from '../../../js/gui_components/generator/schema-support/index.js';

describe('generator schema definition support', () => {
  test('creates generator blank schema rows through a focused factory', () => {
    const createBlankRow = createGeneratorSchemaRowFactory();

    const firstRow = createBlankRow();
    const secondRow = createBlankRow();

    expect(firstRow).toMatchObject({
      id: 'schema-row-1',
      name: '',
      sourceType: 'regex',
      command: '',
      params: '',
      value: '',
      comments: '',
    });
    expect(firstRow.validation.valid).toBe(true);
    expect(secondRow.id).toBe('schema-row-2');
  });

  test('maps rules, method picker options, and help callbacks through one support object', () => {
    let rowCounter = 0;
    const support = createGeneratorSchemaDefinitionSupport({
      createBlankRow: () => ({
        id: `row-${rowCounter++}`,
        name: '',
        sourceType: 'regex',
        command: '',
        params: '',
        value: '',
        comments: '',
        leadingTextLines: [],
      }),
      fakerCommands: ['helpers.arrayElement'],
      domainCommands: ['number.int', 'science.chemicalElement'],
      buildModeHelpHtml: ({ inTextMode }) => (inTextMode ? '<p>text mode</p>' : '<p>schema mode</p>'),
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
    });

    const row = support.mapRuleToRow(
      {
        name: 'Count',
        type: 'domain',
        ruleSpec: 'number.int',
      },
      ['# comment']
    );

    expect(row.name).toBe('Count');
    expect(row.sourceType).toBe('domain');
    expect(row.command).toBe('number.int');
    expect(row.leadingTextLines).toEqual(['# comment']);

    const commands = support.getMethodPickerOptions('science.chemicalElement').map((entry) => entry.command);
    expect(commands).toContain('enum');
    expect(commands).toContain('literal');
    expect(commands).toContain('regex');
    expect(commands).toContain('number.int');
    expect(commands).toContain('science.chemicalElement');
    expect(commands).toContain('helpers.arrayElement');

    expect(support.getVisibleDomainCommands('science.chemicalElement')).toContain('science.chemicalElement');
    expect(support.buildModeHelpHtml({ inTextMode: true })).toContain('text mode');
    expect(support.validateSchemaRows([row])).toEqual({ rows: [row], errors: [] });
  });
});
