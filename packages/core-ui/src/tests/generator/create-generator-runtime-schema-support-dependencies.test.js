import { describe, expect, test } from '@jest/globals';
import { createGeneratorRuntimeSchemaSupportDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-schema-support-dependencies.js';

describe('createGeneratorRuntimeSchemaSupportDependencies', () => {
  test('builds the generator schema catalog and support bundle', () => {
    const dependencies = createGeneratorRuntimeSchemaSupportDependencies({
      faker: {},
      RandExp: function RandExp() {},
      schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
      schemaRowsToSpecWithTokens: () => '',
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
      mapRuleToRow: () => ({ id: 'row-1', name: '', sourceType: 'enum', value: '' }),
    });

    expect(dependencies.fakerCommands.every((command) => command.startsWith('helpers.'))).toBe(true);
    expect(dependencies.domainCommands.length).toBeGreaterThan(0);
    expect(dependencies.generatorSchemaDefinitionSupport).toBeDefined();
    expect(typeof dependencies.generatorSchemaDefinitionSupport.createBlankRow).toBe('function');
  });
});
