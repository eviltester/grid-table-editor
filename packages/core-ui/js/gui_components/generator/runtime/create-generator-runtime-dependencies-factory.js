import { createGeneratorRuntimeDependencies } from './create-generator-runtime-dependencies.js';
import { createGeneratorUnavailableRowCountResult } from './create-generator-unavailable-row-count-result.js';

function createGeneratorRuntimeDependenciesFactory({
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  dataRulesToSchemaText,
  sampleSchemaText,
} = {}) {
  return ({ runtime } = {}) =>
    createGeneratorRuntimeDependencies({
      runtime,
      faker: runtime.faker,
      RandExp: runtime.RandExp,
      TestDataGeneratorClass: runtime.TestDataGeneratorClass,
      DownloadClass: runtime.DownloadClass,
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      mapRuleToRow: (rule, index) => runtime.generatorSchemaDefinitionSupport.mapRuleToRow(rule, index),
      dataRulesToSchemaText,
      sampleSchemaText,
      createUnavailableRowCountResult: createGeneratorUnavailableRowCountResult,
    });
}

export { createGeneratorRuntimeDependenciesFactory };
