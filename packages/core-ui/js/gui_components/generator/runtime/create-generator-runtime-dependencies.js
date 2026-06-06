import { createGeneratorRuntimeSchemaDependencies } from './create-generator-runtime-schema-dependencies.js';
import { createGeneratorRuntimeInteractionDependencies } from './create-generator-runtime-interaction-dependencies.js';

function createGeneratorRuntimeDependencies({
  runtime,
  faker,
  RandExp,
  TestDataGeneratorClass,
  DownloadClass,
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  mapRuleToRow,
  dataRulesToSchemaText,
  sampleSchemaText,
  createUnavailableRowCountResult,
} = {}) {
  const schemaDependencies = createGeneratorRuntimeSchemaDependencies({
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
  });

  const interactionDependencies = createGeneratorRuntimeInteractionDependencies({
    runtime,
    DownloadClass,
    faker,
    RandExp,
    createUnavailableRowCountResult,
  });

  return {
    ...schemaDependencies,
    ...interactionDependencies,
  };
}

export { createGeneratorRuntimeDependencies };
