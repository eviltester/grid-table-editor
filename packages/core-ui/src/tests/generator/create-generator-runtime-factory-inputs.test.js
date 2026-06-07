import { describe, expect, test } from '@jest/globals';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../js/gui_components/shared/test-data/schema/schema-examples.js';
import { createGeneratorPageDefaults } from '../../../js/gui_components/generator/runtime/create-generator-page-defaults.js';

describe('createGeneratorPageDefaults', () => {
  test('returns parser helpers plus sample schema defaults for page entry assembly', () => {
    const runtimeFactoryInputs = createGeneratorPageDefaults();

    expect(runtimeFactoryInputs.sampleSchemaText).toBe(GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT);
    expect(typeof runtimeFactoryInputs.schemaTextToDataRules).toBe('function');
    expect(typeof runtimeFactoryInputs.dataRulesToSchemaText).toBe('function');
    expect(typeof runtimeFactoryInputs.schemaRowsToSpec).toBe('function');
    expect(typeof runtimeFactoryInputs.schemaRowsToSpecWithTokens).toBe('function');
    expect(typeof runtimeFactoryInputs.validateSchemaRows).toBe('function');
  });
});
