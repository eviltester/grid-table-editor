function createGeneratorRuntimeFacade({ getRuntime, lifecycle } = {}) {
  return {
    schemaErrorDisplay: undefined,
    schemaDefinition: undefined,
    generatorControls: undefined,
    generatorPreview: undefined,
    generatorPage: undefined,
    init: lifecycle.init,
    destroy: lifecycle.destroy,
    getSelectedOutputType() {
      return getRuntime().generatorViewState.getSelectedOutputType();
    },
    syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat = getRuntime().getSelectedOutputType()) {
      return getRuntime().generatorViewState.syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat);
    },
    applyCurrentTypeOptions(options) {
      return getRuntime().generatorRuntimeActions.applyCurrentTypeOptions(options);
    },
    renderSchemaRows() {
      getRuntime().generatorSchemaState.renderSchemaRows();
    },
    getPreviewRowCount() {
      return getRuntime().generatorViewState.getPreviewRowCount();
    },
    getGenerateRowCount() {
      return getRuntime().generatorViewState.getGenerateRowCount();
    },
    previewData() {
      return getRuntime().generatorRuntimeActions.previewData();
    },
    async generateDataFile() {
      await getRuntime().generatorRuntimeActions.generateDataFile();
    },
    async generateAllPairsDataFile() {
      await getRuntime().generatorRuntimeActions.generateAllPairsDataFile();
    },
    updateAllPairsButtonVisibility() {
      return getRuntime().generatorRuntimeActions.updateAllPairsButtonVisibility();
    },
  };
}
export { createGeneratorRuntimeFacade };
