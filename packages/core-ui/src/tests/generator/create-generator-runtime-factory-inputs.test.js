import { describe, expect, test } from '@jest/globals';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../js/gui_components/shared/test-data/schema/schema-examples.js';
import { createGeneratorRuntimeFactoryInputs } from '../../../js/gui_components/generator/runtime/create-generator-runtime-factory-inputs.js';

describe('createGeneratorRuntimeFactoryInputs', () => {
  test('returns parser adapters plus sample schema defaults for runtime entry assembly', () => {
    const runtimeFactoryInputs = createGeneratorRuntimeFactoryInputs();

    expect(runtimeFactoryInputs.sampleSchemaText).toBe(GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT);
    expect(typeof runtimeFactoryInputs.schemaTextToDataRules).toBe('function');
    expect(typeof runtimeFactoryInputs.dataRulesToSchemaText).toBe('function');
    expect(typeof runtimeFactoryInputs.schemaRowsToSpec).toBe('function');
    expect(typeof runtimeFactoryInputs.schemaRowsToSpecWithTokens).toBe('function');
    expect(typeof runtimeFactoryInputs.validateSchemaRows).toBe('function');
  });
});
