import { createGeneratorPageActionsService } from './generator-page-actions-service.js';
import { createGeneratorPageSchemaServices } from './create-generator-page-schema-services.js';
import { createGeneratorPageViewState } from './generator-page-view-state.js';

function createGeneratorPageServices({
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
  const schemaServices = createGeneratorPageSchemaServices({
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

  const generatorViewState = createGeneratorPageViewState({
    runtime,
    createUnavailableRowCountResult,
  });

  const generatorRuntimeActions = createGeneratorPageActionsService({
    runtime,
    DownloadClass,
    faker,
    RandExp,
  });

  return {
    ...schemaServices,
    generatorViewState,
    generatorRuntimeActions,
  };
}

export { createGeneratorPageServices };
