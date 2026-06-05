function createGeneratorViewStateBridge({
  getGeneratorControls,
  getGeneratorPreview,
  getExporter,
  createUnavailableRowCountResult,
} = {}) {
  const getControls = () => getGeneratorControls?.() || null;
  const getPreview = () => getGeneratorPreview?.() || null;
  const getCurrentExporter = () => getExporter?.() || null;

  return {
    getSelectedOutputType() {
      const liveSelectedFormat = getControls()?.getSelectedOutputType?.();
      if (liveSelectedFormat) {
        return liveSelectedFormat;
      }
      const componentSelectedFormat = getControls()?.getState?.()?.selectedFormat;
      if (componentSelectedFormat) {
        return componentSelectedFormat;
      }
      return 'csv';
    },
    syncGeneratorControlsFormatState(selectedFormat = this.getSelectedOutputType()) {
      if (!selectedFormat) {
        return false;
      }
      getControls()?.syncFormatState?.(selectedFormat);
      return true;
    },
    syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat = this.getSelectedOutputType()) {
      if (!nextFormat || nextFormat === previousFormat) {
        return false;
      }
      return this.syncGeneratorControlsFormatState(nextFormat);
    },
    getPreviewGrid() {
      return getPreview()?.getPreviewGrid?.() || null;
    },
    getPreviewTableApi() {
      return getPreview()?.getPreviewTableApi?.() || null;
    },
    renderOutputPreviewForCurrentSelection() {
      getPreview()?.renderOutputPreview?.(this.getSelectedOutputType(), getCurrentExporter());
    },
    getPreviewRowCount() {
      if (getPreview()?.getPreviewRowCount) {
        return getPreview().getPreviewRowCount();
      }
      return createUnavailableRowCountResult('previewRowsCount');
    },
    getGenerateRowCount() {
      if (getControls()?.getGenerateRowCount) {
        return getControls().getGenerateRowCount();
      }
      return createUnavailableRowCountResult('generateRowsCount');
    },
    setGenerationButtonsBusy(isBusy) {
      getControls()?.setGenerationButtonsBusy?.(isBusy);
    },
    clearGenerationStatus() {
      getControls()?.clearStatus?.();
    },
    setGenerationStatus(message, options) {
      getControls()?.setStatus?.(message, options);
    },
    showGenerationLoadingStatus(message) {
      getControls()?.showLoadingStatus?.(message);
    },
    scheduleClearGenerationStatus(delay) {
      getControls()?.scheduleClearStatus?.(delay);
    },
    setPairwiseVisible(isVisible) {
      getControls()?.setPairwiseVisible?.(isVisible === true);
    },
    setPreviewDataTable(dataTable) {
      getPreview()?.setPreviewDataTable?.(dataTable);
    },
  };
}

export { createGeneratorViewStateBridge };
