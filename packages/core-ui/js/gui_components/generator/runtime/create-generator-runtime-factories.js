import { createGeneratorPageRuntimeMountFactory } from './create-generator-page-runtime-mount-factory.js';
import { createGeneratorRuntimeDependenciesFactory } from './create-generator-runtime-dependencies-factory.js';

function createGeneratorRuntimeFactories({
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  dataRulesToSchemaText,
  sampleSchemaText,
} = {}) {
  return {
    createPageRuntimeMount: createGeneratorPageRuntimeMountFactory(),
    createRuntimeDependencies: createGeneratorRuntimeDependenciesFactory({
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText,
    }),
  };
}

export { createGeneratorRuntimeFactories };
