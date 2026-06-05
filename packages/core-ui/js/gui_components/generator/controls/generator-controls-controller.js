class GeneratorControlsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      selectedFormat: props.selectedFormat || 'csv',
      currentOptions: props.currentOptions,
      pairwiseVisible: props.pairwiseVisible === true,
      generationButtonsBusy: props.generationButtonsBusy === true,
      statusMessage: props.statusMessage || '',
      statusOptions: props.statusOptions || {},
      loadingStatusMessage: props.loadingStatusMessage || '',
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    this.state = {
      ...this.state,
      ...nextProps,
      pairwiseVisible: Object.prototype.hasOwnProperty.call(nextProps, 'pairwiseVisible')
        ? nextProps.pairwiseVisible === true
        : this.state.pairwiseVisible,
      generationButtonsBusy: Object.prototype.hasOwnProperty.call(nextProps, 'generationButtonsBusy')
        ? nextProps.generationButtonsBusy === true
        : this.state.generationButtonsBusy,
      statusMessage: Object.prototype.hasOwnProperty.call(nextProps, 'statusMessage')
        ? nextProps.statusMessage || ''
        : this.state.statusMessage,
      statusOptions: Object.prototype.hasOwnProperty.call(nextProps, 'statusOptions')
        ? nextProps.statusOptions || {}
        : this.state.statusOptions,
      loadingStatusMessage: Object.prototype.hasOwnProperty.call(nextProps, 'loadingStatusMessage')
        ? nextProps.loadingStatusMessage || ''
        : this.state.loadingStatusMessage,
      selectedFormat: nextProps.selectedFormat || this.state.selectedFormat || 'csv',
    };
  }

  setSelectedFormat(selectedFormat, currentOptions = this.state.currentOptions) {
    this.state.selectedFormat = selectedFormat || 'csv';
    this.state.currentOptions = currentOptions;
    this.callbacks.onFormatChanged?.(this.state.selectedFormat);
  }

  setPairwiseVisible(pairwiseVisible) {
    this.state.pairwiseVisible = pairwiseVisible === true;
  }

  setGenerationButtonsBusy(generationButtonsBusy) {
    this.state.generationButtonsBusy = generationButtonsBusy === true;
  }

  setStatus(statusMessage, statusOptions = {}) {
    this.state.statusMessage = statusMessage || '';
    this.state.statusOptions = statusOptions || {};
    this.state.loadingStatusMessage = '';
  }

  showLoadingStatus(loadingStatusMessage) {
    this.state.loadingStatusMessage = loadingStatusMessage || '';
    this.state.statusMessage = '';
    this.state.statusOptions = {};
  }

  clearStatus() {
    this.state.statusMessage = '';
    this.state.statusOptions = {};
    this.state.loadingStatusMessage = '';
  }

  applyOptions(payload) {
    this.callbacks.onApplyOptions?.(payload);
  }

  triggerPreview() {
    this.callbacks.onPreview?.();
  }

  triggerGenerateData() {
    this.callbacks.onGenerateData?.();
  }

  triggerGeneratePairwise() {
    this.callbacks.onGeneratePairwise?.();
  }
}

export { GeneratorControlsController };
