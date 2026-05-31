class FormatOptionsPanelController {
  constructor({ props = {}, services = {}, callbacks = {} } = {}) {
    this.services = services;
    this.callbacks = callbacks;
    this.state = {
      selectedFormat: props.selectedFormat || '',
      currentOptions: props.currentOptions,
      supported: false,
      dirty: false,
    };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'selectedFormat')) {
      this.state.selectedFormat = nextProps.selectedFormat || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'currentOptions')) {
      this.state.currentOptions = nextProps.currentOptions;
    }
    this.setDirty(false);
  }

  getState() {
    return { ...this.state };
  }

  getSelectedFormat() {
    return this.state.selectedFormat;
  }

  getCurrentOptions() {
    return this.state.currentOptions;
  }

  setSupported(supported) {
    this.state.supported = supported === true;
    this.callbacks.onSupportChanged?.(this.state.supported);
  }

  setDirty(isDirty) {
    const nextDirty = isDirty === true;
    this.state.dirty = nextDirty;
    this.callbacks.onDirtyStateChanged?.(nextDirty);
  }

  apply(guiOptions) {
    const selectedFormat = this.state.selectedFormat;
    const requestedFormat = guiOptions?.outputFormat || selectedFormat;
    const sanitized = this.services.sanitizeOptionsForFormat(requestedFormat, guiOptions?.options || guiOptions || {});

    this.state.selectedFormat = sanitized.outputFormat || requestedFormat;
    this.state.currentOptions = sanitized;
    this.setDirty(false);
    this.callbacks.onApplyOptions?.({
      type: this.state.selectedFormat,
      sanitized,
      rawOptions: guiOptions,
    });
    return sanitized;
  }
}

export { FormatOptionsPanelController };
