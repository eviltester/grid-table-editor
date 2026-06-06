import { createGeneratorMountedPageBridge } from './generator-mounted-page-bridge.js';

function createGeneratorMountedPageState({
  runtime,
  generatorPage,
  createMountedPageBridge = createGeneratorMountedPageBridge,
} = {}) {
  const exporter = new runtime.ExporterClass(runtime.generatorViewState.getPreviewGrid() || null);
  const mountedPageBridge = createMountedPageBridge();
  const mountedFeatures = mountedPageBridge.connectMountedPage({
    generatorPage,
  });
  const mountedState = {
    generatorPage,
    exporter,
    ...mountedFeatures,
  };

  Object.assign(runtime, mountedState);

  return mountedState;
}

export { createGeneratorMountedPageState };
