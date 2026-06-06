import { createGeneratorViewStateBridge } from './generator-view-state-bridge.js';

function createGeneratorRuntimeViewStateDependencies({ runtime, createUnavailableRowCountResult } = {}) {
  return createGeneratorViewStateBridge({
    getGeneratorControls: () => runtime?.generatorControls,
    getGeneratorPreview: () => runtime?.generatorPreview,
    getExporter: () => runtime?.exporter,
    createUnavailableRowCountResult,
  });
}

export { createGeneratorRuntimeViewStateDependencies };
