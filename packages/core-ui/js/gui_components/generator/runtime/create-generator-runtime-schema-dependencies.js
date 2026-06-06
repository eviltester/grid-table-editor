import { createGeneratorRuntimeSchemaBridges } from './create-generator-runtime-schema-bridges.js';
import { createGeneratorRuntimeSchemaSupportDependencies } from './create-generator-runtime-schema-support-dependencies.js';

function createGeneratorRuntimeSchemaDependencies({
  runtime,
  faker,
  RandExp,
  TestDataGeneratorClass,
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  mapRuleToRow,
  dataRulesToSchemaText,
  sampleSchemaText,
} = {}) {
  const schemaSupportDependencies = createGeneratorRuntimeSchemaSupportDependencies({
    faker,
    RandExp,
    schemaTextToDataRules,
    schemaRowsToSpecWithTokens,
    validateSchemaRows,
    mapRuleToRow,
  });

  const schemaBridges = createGeneratorRuntimeSchemaBridges({
    runtime,
    faker,
    RandExp,
    TestDataGeneratorClass,
    validateSchemaRows,
    schemaRowsToSpec,
  });

  return {
    ...schemaSupportDependencies,
    ...schemaBridges,
    schemaTextToDataRules,
    dataRulesToSchemaText,
    sampleSchemaText,
  };
}

export { createGeneratorRuntimeSchemaDependencies };
