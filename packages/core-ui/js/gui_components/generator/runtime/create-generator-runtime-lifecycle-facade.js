import { createGeneratorRuntimeLifecycle } from './create-generator-runtime-lifecycle.js';
import { createGeneratorRuntimeFacade } from './create-generator-runtime-facade.js';

function createGeneratorRuntimeLifecycleFacade({ baseState = {}, createPageRuntimeMount } = {}) {
  let runtime;
  const lifecycle = createGeneratorRuntimeLifecycle({
    getRuntime: () => runtime,
    createPageRuntimeMount,
  });

  runtime = {
    ...baseState,
    ...createGeneratorRuntimeFacade({
      getRuntime: () => runtime,
      lifecycle,
    }),
  };

  return runtime;
}

export { createGeneratorRuntimeLifecycleFacade };
