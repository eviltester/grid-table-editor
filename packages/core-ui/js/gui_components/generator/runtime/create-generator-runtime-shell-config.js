import { createGeneratorRuntimeFactories } from './create-generator-runtime-factories.js';

function createGeneratorRuntimeShellConfig({
  baseState,
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  dataRulesToSchemaText,
  sampleSchemaText,
} = {}) {
  return {
    baseState,
    ...createGeneratorRuntimeFactories({
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText,
    }),
  };
}

export { createGeneratorRuntimeShellConfig };
