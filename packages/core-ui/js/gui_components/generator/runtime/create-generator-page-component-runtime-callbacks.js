import { createGeneratorPageComponentRuntimeControlsCallbacks } from './create-generator-page-component-runtime-controls-callbacks.js';
import { createGeneratorPageComponentRuntimePreviewCallbacks } from './create-generator-page-component-runtime-preview-callbacks.js';
import { createGeneratorPageComponentRuntimeSchemaCallbacks } from './create-generator-page-component-runtime-schema-callbacks.js';

function createGeneratorPageComponentRuntimeCallbacks({
  runtime,
  createRuntimeControlsCallbacks = createGeneratorPageComponentRuntimeControlsCallbacks,
  createRuntimePreviewCallbacks = createGeneratorPageComponentRuntimePreviewCallbacks,
  createRuntimeSchemaCallbacks = createGeneratorPageComponentRuntimeSchemaCallbacks,
} = {}) {
  return {
    ...createRuntimeControlsCallbacks({
      runtime,
    }),
    ...createRuntimePreviewCallbacks({
      runtime,
    }),
    ...createRuntimeSchemaCallbacks({
      runtime,
    }),
  };
}

export { createGeneratorPageComponentRuntimeCallbacks };
