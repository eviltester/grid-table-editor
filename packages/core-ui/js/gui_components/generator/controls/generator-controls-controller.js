class GeneratorControlsController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      selectedFormat: props.selectedFormat || 'csv',
      currentOptions: props.currentOptions,
      pairwiseVisible: props.pairwiseVisible === true,
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
      selectedFormat: nextProps.selectedFormat || this.state.selectedFormat || 'csv',
    };
  }

  setSelectedFormat(selectedFormat) {
    this.state.selectedFormat = selectedFormat || 'csv';
    this.callbacks.onFormatChanged?.(this.state.selectedFormat);
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
