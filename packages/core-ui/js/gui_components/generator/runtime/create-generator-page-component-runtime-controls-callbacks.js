function createGeneratorPageComponentRuntimeControlsCallbacks({ runtime } = {}) {
  return {
    onApplyOptions: (sanitized) => runtime.applyCurrentTypeOptions(sanitized),
    onGenerateData: () => {
      void runtime.generateDataFile();
    },
    onGeneratePairwise: () => {
      void runtime.generateAllPairsDataFile();
    },
    onRenderOutputPreview: () => runtime.generatorViewState.renderOutputPreviewForCurrentSelection(),
  };
}

export { createGeneratorPageComponentRuntimeControlsCallbacks };
