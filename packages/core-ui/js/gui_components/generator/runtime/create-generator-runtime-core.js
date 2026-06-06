import { defineGeneratorRuntimeSchemaState } from './create-generator-runtime-schema-state.js';
import { createGeneratorRuntimeLifecycleFacade } from './create-generator-runtime-lifecycle-facade.js';

function createGeneratorRuntimeCore({ baseState = {}, createPageRuntimeMount } = {}) {
  const runtime = createGeneratorRuntimeLifecycleFacade({
    baseState,
    createPageRuntimeMount,
  });

  defineGeneratorRuntimeSchemaState(runtime, {
    getRuntime: () => runtime,
  });

  return runtime;
}

export { createGeneratorRuntimeCore };
