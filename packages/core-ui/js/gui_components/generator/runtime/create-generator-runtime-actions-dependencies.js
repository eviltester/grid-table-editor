import { createGeneratorRuntimeActionsBridge } from './generator-runtime-actions-bridge.js';

function createGeneratorRuntimeActionsDependencies({ runtime, DownloadClass, faker, RandExp } = {}) {
  return createGeneratorRuntimeActionsBridge({
    getCurrentSelectedType: () => runtime?.generatorViewState?.getSelectedOutputType(),
    getExporter: () => runtime?.exporter,
    getDownloadClass: () => DownloadClass,
    getFaker: () => faker,
    getRandExp: () => RandExp,
    getViewState: () => runtime?.generatorViewState,
    getSchemaRuntime: () => runtime?.generatorSchemaRuntime,
    getSchemaGeneration: () => runtime?.generatorSchemaGeneration,
    getSchemaState: () => runtime?.generatorSchemaState,
  });
}

export { createGeneratorRuntimeActionsDependencies };
