class ImportExportToolbarController {
  constructor({ props = {} } = {}) {
    this.state = {
      helpDataHelp: props.helpDataHelp || 'import-export-controls',
      mode: props.mode || 'preview',
      previewTextDirty: props.previewTextDirty === true,
      importBusy: props.importBusy === true,
      exportBusy: props.exportBusy === true,
      supportsImport: props.supportsImport !== false,
      supportsClipboardImport: props.supportsClipboardImport !== false,
      supportsExport: props.supportsExport !== false,
      fileExtension: props.fileExtension || '.csv',
      exportEncodingSettings: {
        lineEnding: props.exportEncodingSettings?.lineEnding || 'lf',
        includeBom: props.exportEncodingSettings?.includeBom === true,
      },
      importStatusMessage: props.importStatusMessage || '',
      importStatusLoading: props.importStatusLoading === true,
      exportStatusMessage: props.exportStatusMessage || '',
      exportStatusLoading: props.exportStatusLoading === true,
      errorStatusMessage: props.errorStatusMessage || '',
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'helpDataHelp')) {
      this.state.helpDataHelp = nextProps.helpDataHelp || 'import-export-controls';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'mode')) {
      this.state.mode = nextProps.mode || 'preview';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'previewTextDirty')) {
      this.state.previewTextDirty = nextProps.previewTextDirty === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importBusy')) {
      this.state.importBusy = nextProps.importBusy === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportBusy')) {
      this.state.exportBusy = nextProps.exportBusy === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'supportsImport')) {
      this.state.supportsImport = nextProps.supportsImport !== false;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'supportsClipboardImport')) {
      this.state.supportsClipboardImport = nextProps.supportsClipboardImport !== false;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'supportsExport')) {
      this.state.supportsExport = nextProps.supportsExport !== false;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'fileExtension')) {
      this.state.fileExtension = nextProps.fileExtension || '.csv';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportEncodingSettings')) {
      const nextExportEncodingSettings = nextProps.exportEncodingSettings || {};
      this.state.exportEncodingSettings = {
        ...this.state.exportEncodingSettings,
        ...nextExportEncodingSettings,
        includeBom: Object.prototype.hasOwnProperty.call(nextExportEncodingSettings, 'includeBom')
          ? nextExportEncodingSettings.includeBom === true
          : this.state.exportEncodingSettings.includeBom,
      };
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importStatusMessage')) {
      this.state.importStatusMessage = nextProps.importStatusMessage || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importStatusLoading')) {
      this.state.importStatusLoading = nextProps.importStatusLoading === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportStatusMessage')) {
      this.state.exportStatusMessage = nextProps.exportStatusMessage || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportStatusLoading')) {
      this.state.exportStatusLoading = nextProps.exportStatusLoading === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'errorStatusMessage')) {
      this.state.errorStatusMessage = nextProps.errorStatusMessage || '';
    }
  }

  canSetGridFromText() {
    if (!this.state.supportsImport || this.state.importBusy) {
      return false;
    }
    if (this.state.mode !== 'preview') {
      return true;
    }
    return this.state.previewTextDirty === true;
  }
}

export { ImportExportToolbarController };
