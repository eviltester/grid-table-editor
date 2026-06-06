import { createGeneratorRuntimeSchemaRuntime } from './create-generator-runtime-schema-runtime.js';
import { createGeneratorRuntimeInteractionServices } from './create-generator-runtime-interaction-services.js';

function createGeneratorRuntimeCollaborators({
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
  const schemaRuntime = createGeneratorRuntimeSchemaRuntime({
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

  const interactionServices = createGeneratorRuntimeInteractionServices({
    runtime,
    DownloadClass,
    faker,
    RandExp,
    createUnavailableRowCountResult,
  });

  return {
    ...schemaRuntime,
    ...interactionServices,
  };
}

export { createGeneratorRuntimeCollaborators };
