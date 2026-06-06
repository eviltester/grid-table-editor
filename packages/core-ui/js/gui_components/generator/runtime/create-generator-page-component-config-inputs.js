import { createGeneratorPageComponentRuntimeDependencies } from './create-generator-page-component-runtime-dependencies.js';
import { createGeneratorPageComponentRuntimeCallbacks } from './create-generator-page-component-runtime-callbacks.js';

function createGeneratorPageComponentConfigInputs({
  runtime,
  createRuntimeDependencies = createGeneratorPageComponentRuntimeDependencies,
  createRuntimeCallbacks = createGeneratorPageComponentRuntimeCallbacks,
} = {}) {
  return {
    ...createRuntimeDependencies({
      runtime,
    }),
    ...createRuntimeCallbacks({
      runtime,
    }),
  };
}

export { createGeneratorPageComponentConfigInputs };
