class ImportExportWorkspaceController {
  constructor({ props = {} } = {}) {
    this.state = {
      selectedFormat: props.selectedFormat || 'csv',
      mode: props.mode || 'preview',
      previewRowLimit: props.previewRowLimit ?? 10,
      autoPreviewEnabled: props.autoPreviewEnabled === true,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'selectedFormat')) {
      this.state.selectedFormat = nextProps.selectedFormat || 'csv';
    }
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
}

export { ImportExportWorkspaceController };
