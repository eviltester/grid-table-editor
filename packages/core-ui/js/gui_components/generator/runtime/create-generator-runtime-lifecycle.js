import { assertGeneratorRuntimeMountable } from './assert-generator-runtime-mountable.js';

function createGeneratorRuntimeLifecycle({ getRuntime, createPageRuntimeMount } = {}) {
  return {
    init() {
      const runtime = getRuntime?.();
      assertGeneratorRuntimeMountable(runtime);
      Object.assign(
        runtime,
        createPageRuntimeMount({
          runtime,
        })
      );
    },

    destroy() {
      const runtime = getRuntime?.();
      runtime.generatorPage?.destroy?.();
    },
  };
}

export { createGeneratorRuntimeLifecycle };
