class TextPreviewEditorController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.editModeHelpText =
      'Edit mode shows the full grid text in the chosen format. You can edit this text and use Set Grid From Text to apply changes back into the grid.';
    this.state = {
      mode: props.mode || 'preview',
      previewRowLimit: props.previewRowLimit ?? 10,
      autoPreviewEnabled: props.autoPreviewEnabled === true,
    };
  }

  getState() {
    return { ...this.state, editModeHelpText: this.editModeHelpText };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'mode')) {
      this.state.mode = nextProps.mode || 'preview';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'previewRowLimit')) {
      this.state.previewRowLimit = nextProps.previewRowLimit ?? 10;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'autoPreviewEnabled')) {
      this.state.autoPreviewEnabled = nextProps.autoPreviewEnabled === true;
    }
  }

  toggleMode() {
    this.callbacks.onToggleMode?.();
  }

  setAutoPreviewEnabled(enabled) {
    this.state.autoPreviewEnabled = enabled === true;
    this.callbacks.onAutoPreviewChange?.(this.state.autoPreviewEnabled);
  }

  setPreviewRowLimit(previewRowLimit) {
    this.state.previewRowLimit = previewRowLimit ?? 10;
    this.callbacks.onPreviewRowLimitChange?.(this.state.previewRowLimit);
  }
}

export { TextPreviewEditorController };
