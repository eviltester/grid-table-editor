import { describe, expect, test } from '@jest/globals';
import { dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import * as generatorRuntimeExports from '../../../js/gui_components/generator/runtime/data-generator-page-runtime.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  normaliseFakerCommand,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
} from '../../../js/gui_components/generator/runtime/generator-schema-rule-helpers.js';

describe('generatorSchemaRuleHelpers', () => {
  test('generator runtime module exposes only mounted and unmounted runtime factories', () => {
    expect(generatorRuntimeExports.createDataGeneratorPage).toEqual(expect.any(Function));
    expect(generatorRuntimeExports.createUninitializedDataGeneratorPage).toEqual(expect.any(Function));
    expect(generatorRuntimeExports.buildRuleSpecFromSchemaRow).toBeUndefined();
    expect(generatorRuntimeExports.extractLiteralValueFromRuleSpec).toBeUndefined();
    expect(generatorRuntimeExports.extractRegexValueFromRuleSpec).toBeUndefined();
    expect(generatorRuntimeExports.normaliseFakerCommand).toBeUndefined();
    expect(generatorRuntimeExports.schemaRowsToSpec).toBeUndefined();
    expect(generatorRuntimeExports.schemaRowsToSpecWithTokens).toBeUndefined();
    expect(generatorRuntimeExports.validateSchemaRows).toBeUndefined();
  });

  test('maps faker/domain/literal/regex helpers through the shared generator contract', () => {
    expect(normaliseFakerCommand('faker.person.firstName')).toBe('person.firstName');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'faker', command: 'faker.person.firstName', params: '()' })).toBe(
      'person.firstName()'
    );
    expect(extractLiteralValueFromRuleSpec('literal(Fixed)')).toBe('Fixed');
    expect(extractRegexValueFromRuleSpec('regex("[A-Z]{3}")')).toBe('"[A-Z]{3}"');
  });

  test('builds spec text and validates rows through the shared schema adapters', () => {
    expect(
      schemaRowsToSpec({
        schemaRows: [
          { name: 'A', sourceType: 'faker', command: 'word.noun', params: '()' },
          { name: 'B', sourceType: 'literal', value: 'x' },
        ],
        dataRulesToSchemaText,
      })
    ).toBe('A\nword.noun()\nB\nliteral(x)');

    expect(
      schemaRowsToSpecWithTokens({
        schemaRows: [
          { name: 'Priority', sourceType: 'enum', value: 'enum(high,medium,low)' },
          { name: 'Status', sourceType: 'enum', value: 'enum(active,inactive,pending)' },
        ],
        schemaTokens: [
          { kind: 'comment', text: '# top' },
          { kind: 'rule' },
          { kind: 'blank', text: '' },
          { kind: 'rule' },
        ],
        dataRulesToSchemaText,
      })
    ).toBe('# top\nPriority\nenum(high,medium,low)\n\nStatus\nenum(active,inactive,pending)');

    const validation = validateSchemaRows({
      schemaRows: [
        { name: '', sourceType: 'regex', value: '[0-9]' },
        { name: 'First', sourceType: 'faker', command: '' },
      ],
    });
    expect(validation.errors.map((error) => error.code)).toEqual(['missing_column_name', 'missing_faker_command']);
  });
});
