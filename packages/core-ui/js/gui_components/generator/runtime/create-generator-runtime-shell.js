import { createGeneratorRuntimeCore } from './create-generator-runtime-core.js';

function createGeneratorRuntimeShell({ baseState = {}, createPageRuntimeMount, createRuntimeDependencies } = {}) {
  const runtime = createGeneratorRuntimeCore({
    baseState,
    createPageRuntimeMount,
  });

  Object.assign(
    runtime,
    createRuntimeDependencies({
      runtime,
    })
  );

  return runtime;
}

export { createGeneratorRuntimeShell };
