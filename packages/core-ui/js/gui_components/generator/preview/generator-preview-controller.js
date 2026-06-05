class GeneratorPreviewController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      outputPreviewText: props.outputPreviewText || '',
      previewDataTable: props.previewDataTable || null,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'outputPreviewText')) {
      this.state.outputPreviewText = nextProps.outputPreviewText || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'previewDataTable')) {
      this.state.previewDataTable = nextProps.previewDataTable || null;
    }
  }

  setOutputPreviewText(outputPreviewText) {
    this.state.outputPreviewText = outputPreviewText || '';
  }

  setPreviewDataTable(previewDataTable) {
    this.state.previewDataTable = previewDataTable || null;
  }

  triggerPreview() {
    this.callbacks.onPreview?.();
  }
}

export { GeneratorPreviewController };
