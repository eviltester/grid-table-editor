import { describe, expect, test } from '@jest/globals';
import { dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createGeneratorRuntimeSchemaAdapters } from '../../../js/gui_components/generator/runtime/create-generator-runtime-schema-adapters.js';

describe('createGeneratorRuntimeSchemaAdapters', () => {
  test('builds runtime schema helper adapters around dataRulesToSchemaText', () => {
    const adapters = createGeneratorRuntimeSchemaAdapters({
      dataRulesToSchemaText,
    });

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

  test('exposes schema validation through the runtime adapter contract', () => {
    const adapters = createGeneratorRuntimeSchemaAdapters({
      dataRulesToSchemaText: () => '',
    });

    const result = adapters.validateSchemaRows([
      { name: '', sourceType: 'regex', value: '[0-9]' },
      { name: 'User', sourceType: 'faker', command: '' },
    ]);

    expect(result.errors.map((error) => error.code)).toEqual(['missing_column_name', 'missing_faker_command']);
  });
});
