import { createGeneratorRuntimeBaseState } from './create-generator-runtime-base-state.js';
import { createGeneratorRuntimeShellConfig } from './create-generator-runtime-shell-config.js';
import { createGeneratorRuntimeShell } from './create-generator-runtime-shell.js';

function createUninitializedGeneratorRuntime({
  options = {},
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  dataRulesToSchemaText,
  sampleSchemaText,
} = {}) {
  const baseState = createGeneratorRuntimeBaseState({
    options,
  });

  return createGeneratorRuntimeShell(
    createGeneratorRuntimeShellConfig({
      baseState,
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      dataRulesToSchemaText,
      sampleSchemaText,
    })
  );
}

export { createUninitializedGeneratorRuntime };
