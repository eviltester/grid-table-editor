function normalizePreviewRowLimit(previewRowLimit) {
  const parsedPreviewRowLimit = Number.parseInt(previewRowLimit, 10);
  if (!Number.isFinite(parsedPreviewRowLimit)) {
    return 10;
  }
  return Math.min(Math.max(parsedPreviewRowLimit, 1), 50);
}

class TextPreviewEditorController {
  constructor({ props = {}, callbacks = {} } = {}) {
    this.callbacks = callbacks;
    this.editModeHelpText =
      'Edit mode shows the full grid text in the chosen format. You can edit this text and use Set Grid From Text to apply changes back into the grid.';
    this.state = {
      mode: props.mode || 'preview',
      previewRowLimit: normalizePreviewRowLimit(props.previewRowLimit),
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
      this.state.previewRowLimit = normalizePreviewRowLimit(nextProps.previewRowLimit);
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
    this.state.previewRowLimit = normalizePreviewRowLimit(previewRowLimit);
    this.callbacks.onPreviewRowLimitChange?.(this.state.previewRowLimit);
  }
}

export { normalizePreviewRowLimit, TextPreviewEditorController };
