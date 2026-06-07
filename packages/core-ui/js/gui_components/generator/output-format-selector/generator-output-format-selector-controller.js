class GeneratorOutputFormatSelectorController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      selectedFormat: props.selectedFormat || 'csv',
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'selectedFormat')) {
      this.state.selectedFormat = nextProps.selectedFormat || 'csv';
    }
  }

  setSelectedFormat(selectedFormat) {
    this.state.selectedFormat = selectedFormat || 'csv';
    this.callbacks.onFormatChange?.(this.state.selectedFormat);
  }
}

export { GeneratorOutputFormatSelectorController };
