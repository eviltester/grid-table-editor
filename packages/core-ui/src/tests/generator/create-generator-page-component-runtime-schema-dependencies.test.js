import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorPageComponentRuntimeSchemaDependencies } from '../../../js/gui_components/generator/runtime/create-generator-page-component-runtime-schema-dependencies.js';

describe('createGeneratorPageComponentRuntimeSchemaDependencies', () => {
  test('maps runtime-owned schema parsers and schema support inputs', () => {
    const runtime = {
      schemaTextToDataRules: jest.fn(),
      dataRulesToSchemaText: jest.fn(),
      faker: { id: 'faker' },
      RandExp: function RandExp() {},
      generatorSchemaDefinitionSupport: { id: 'schema-support' },
      fakerCommands: ['helpers.fake'],
      sampleSchemaText: 'Name\nenum(a,b)',
    };

    const dependencies = createGeneratorPageComponentRuntimeSchemaDependencies({
      runtime,
    });

    expect(dependencies.schemaTextToDataRules).toBe(runtime.schemaTextToDataRules);
    expect(dependencies.dataRulesToSchemaText).toBe(runtime.dataRulesToSchemaText);
    expect(dependencies.faker).toBe(runtime.faker);
    expect(dependencies.RandExp).toBe(runtime.RandExp);
    expect(dependencies.generatorSchemaDefinitionSupport).toBe(runtime.generatorSchemaDefinitionSupport);
    expect(dependencies.fakerCommands).toEqual(['helpers.fake']);
    expect(dependencies.sampleSchemaText).toBe('Name\nenum(a,b)');
  });
});
