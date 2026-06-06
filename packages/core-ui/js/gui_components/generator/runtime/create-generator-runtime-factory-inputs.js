import { schemaTextToDataRules, dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../shared/test-data/schema/schema-examples.js';
import { createGeneratorRuntimeSchemaAdapters } from './create-generator-runtime-schema-adapters.js';

function createGeneratorRuntimeFactoryInputs() {
  const schemaAdapters = createGeneratorRuntimeSchemaAdapters({
    dataRulesToSchemaText,
  });

  return {
    schemaTextToDataRules,
    ...schemaAdapters,
    dataRulesToSchemaText,
    sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
  };
}

export { createGeneratorRuntimeFactoryInputs };
