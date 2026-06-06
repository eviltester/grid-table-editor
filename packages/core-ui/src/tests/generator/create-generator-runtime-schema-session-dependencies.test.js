import { describe, expect, test } from '@jest/globals';
import { createGeneratorRuntimeSchemaSessionDependencies } from '../../../js/gui_components/generator/runtime/create-generator-runtime-schema-session-dependencies.js';

describe('createGeneratorRuntimeSchemaSessionDependencies', () => {
  test('builds the schema editing session from generator schema support', () => {
    const generatorSchemaDefinitionSupport = {
      createBlankRow: () => ({ id: 'blank-row' }),
    };
    const schemaTextToDataRules = () => ({ dataRules: [], errors: [], schemaTokens: [] });
    const schemaRowsToSpecWithTokens = () => ({ spec: [] });
    const mapRuleToRow = () => ({ id: 'row-1', name: '', sourceType: 'enum', value: '' });

    const dependencies = createGeneratorRuntimeSchemaSessionDependencies({
      generatorSchemaDefinitionSupport,
      faker: {},
      RandExp: function RandExp() {},
      schemaTextToDataRules,
      schemaRowsToSpecWithTokens,
      mapRuleToRow,
    });

    expect(dependencies.schemaSession).toBeDefined();
    expect(typeof dependencies.schemaSession.getRows).toBe('function');
    expect(dependencies.schemaSession.getRows()).toEqual([{ id: 'blank-row' }]);
  });
});
