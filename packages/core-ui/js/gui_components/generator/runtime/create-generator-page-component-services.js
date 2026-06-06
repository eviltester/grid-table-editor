import { createGeneratorControlsServices } from './create-generator-controls-services.js';
import { createGeneratorPreviewServices } from './create-generator-preview-services.js';

function createGeneratorPageComponentServices({ getExporter, TabulatorCtor, GridExtensionClass } = {}) {
  return {
    generatorControlsServices: createGeneratorControlsServices({
      getExporter,
    }),
    generatorPreviewServices: createGeneratorPreviewServices({
      TabulatorCtor,
      GridExtensionClass,
    }),
  };
}

export { createGeneratorPageComponentServices };
