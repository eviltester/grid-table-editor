function createGeneratorPageViewState({ runtime, createUnavailableRowCountResult } = {}) {
  function getSelectedOutputType() {
    return (
      runtime?.generatorControls?.getSelectedOutputType?.() ||
      runtime?.generatorControls?.getState?.()?.selectedFormat ||
      'csv'
    );
  }

  return {
    getSelectedOutputType,
    syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat) {
      if (nextFormat === previousFormat) {
        return false;
      }
      runtime?.generatorControls?.syncFormatState?.(nextFormat);
      return true;
    },
    syncGeneratorControlsFormatState(nextFormat) {
      runtime?.generatorControls?.syncFormatState?.(nextFormat);
    },
    getPreviewRowCount() {
      return (
        runtime?.generatorPreview?.getPreviewRowCount?.() || createUnavailableRowCountResult?.('Preview row count')
      );
    },
    getGenerateRowCount() {
      return (
        runtime?.generatorControls?.getGenerateRowCount?.() || createUnavailableRowCountResult?.('Generate row count')
      );
    },
    getPreviewGrid() {
      return runtime?.generatorPreview?.getPreviewGrid?.() || null;
    },
    setPreviewDataTable(dataTable) {
      runtime?.generatorPreview?.setPreviewDataTable?.(dataTable);
    },
    renderOutputPreviewForCurrentSelection() {
      runtime?.generatorPreview?.renderOutputPreview?.(getSelectedOutputType(), runtime?.exporter || null);
    },
    showGenerationLoadingStatus(message) {
      runtime?.generatorControls?.showLoadingStatus?.(message);
    },
    getExportEncodingSettings() {
      return runtime?.generatorControls?.getState?.()?.exportEncodingSettings || runtime?.defaultExportEncodingSettings;
    },
    setGenerationStatus(message, options) {
      runtime?.generatorControls?.setStatus?.(message, options);
    },
    clearGenerationStatus() {
      runtime?.generatorControls?.clearStatus?.();
    },
    scheduleClearGenerationStatus(delay) {
      runtime?.generatorControls?.scheduleClearStatus?.(delay);
    },
    setGenerationButtonsBusy(isBusy) {
      runtime?.generatorControls?.setGenerationButtonsBusy?.(isBusy);
    },
    setPairwiseVisible(isVisible) {
      runtime?.generatorControls?.setPairwiseVisible?.(isVisible);
    },
  };
}

export { createGeneratorPageViewState };
