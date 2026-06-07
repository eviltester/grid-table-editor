import { describe, expect, test } from '@jest/globals';
import { createGeneratorPageDefaults } from '../../../js/gui_components/generator/runtime/create-generator-page-defaults.js';

describe('createGeneratorPageDefaults schema helpers', () => {
  test('builds page schema helpers around dataRulesToSchemaText', () => {
    const adapters = createGeneratorPageDefaults();

    expect(
      adapters.schemaRowsToSpec([
        { name: 'Name', sourceType: 'literal', value: 'Alice' },
        { name: 'Code', sourceType: 'regex', value: '[A-Z]{3}' },
      ])
    ).toBe('Name\nliteral(Alice)\nCode\n[A-Z]{3}');

    expect(
      adapters.schemaRowsToSpecWithTokens(
        [{ name: 'Status', sourceType: 'enum', value: 'enum(active,inactive)' }],
        [{ kind: 'comment', text: '# top' }, { kind: 'rule' }]
      )
    ).toBe('# top\nStatus\nenum(active,inactive)');
  });

  test('exposes schema validation through the page-defaults contract', () => {
    const adapters = createGeneratorPageDefaults();

    const result = adapters.validateSchemaRows([
      { name: '', sourceType: 'regex', value: '[0-9]' },
      { name: 'User', sourceType: 'faker', command: '' },
    ]);

    expect(result.errors.map((error) => error.code)).toEqual(['missing_column_name', 'missing_faker_command']);
  });
});
