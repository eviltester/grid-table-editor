class GeneratorPreviewController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.state = {
      outputPreviewText: props.outputPreviewText || '',
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'outputPreviewText')) {
      this.state.outputPreviewText = nextProps.outputPreviewText || '';
    }
  }

  setOutputPreviewText(outputPreviewText) {
    this.state.outputPreviewText = outputPreviewText || '';
  }

  triggerPreview() {
    this.callbacks.onPreview?.();
  }
}

export { GeneratorPreviewController };
