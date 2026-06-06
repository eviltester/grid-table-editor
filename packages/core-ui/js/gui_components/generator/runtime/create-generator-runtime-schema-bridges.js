import { createGeneratorSchemaRuntimeBridge } from './generator-schema-runtime-bridge.js';
import { createGeneratorSchemaStateBridge } from './generator-schema-state-bridge.js';
import { createGeneratorSchemaGenerationBridge } from '../generation/generator-schema-generation-bridge.js';

function createGeneratorRuntimeSchemaBridges({
  runtime,
  faker,
  RandExp,
  TestDataGeneratorClass,
  validateSchemaRows,
  schemaRowsToSpec,
} = {}) {
  const generatorSchemaRuntime = createGeneratorSchemaRuntimeBridge({
    getSchemaDefinition: () => runtime?.schemaDefinition,
    getSchemaRows: () => runtime?.schemaRows,
    getSchemaTextTokens: () => runtime?.schemaTextTokens,
    validateSchemaRows,
    showSchemaErrorStatus: (message) => runtime?.schemaErrorDisplay?.show?.(message),
    clearSchemaErrorStatus: () => runtime?.schemaErrorDisplay?.clear?.(),
    setGenerationStatus: (message, options) => runtime?.generatorViewState?.setGenerationStatus(message, options),
    scheduleClearGenerationStatus: (delay) => runtime?.generatorViewState?.scheduleClearGenerationStatus(delay),
  });

  const generatorSchemaGeneration = createGeneratorSchemaGenerationBridge({
    syncSchemaRowsFromTextMode: (options) => runtime?.generatorSchemaRuntime?.syncSchemaRowsFromTextMode(options),
    validateSchemaRows,
    schemaRowsToSpec,
    TestDataGeneratorClass,
    faker,
    RandExp,
  });

  const generatorSchemaState = createGeneratorSchemaStateBridge({
    getSchemaDefinition: () => runtime?.schemaDefinition,
    getSchemaSession: () => runtime?.schemaSession,
    updatePairwiseButtonVisibility: () => runtime?.updateAllPairsButtonVisibility?.(),
  });

  return {
    generatorSchemaRuntime,
    generatorSchemaGeneration,
    generatorSchemaState,
  };
}

export { createGeneratorRuntimeSchemaBridges };
