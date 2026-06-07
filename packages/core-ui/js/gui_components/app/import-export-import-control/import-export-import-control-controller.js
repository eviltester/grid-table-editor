class ImportExportImportControlController {
  constructor({ props = {} } = {}) {
    this.state = {
      helpDataHelp: props.helpDataHelp || 'import-export-import',
      supportsImport: props.supportsImport !== false,
      supportsClipboardImport: props.supportsClipboardImport !== false,
      importBusy: props.importBusy === true,
      fileExtension: props.fileExtension || '.csv',
      importStatusMessage: props.importStatusMessage || '',
      importStatusLoading: props.importStatusLoading === true,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'helpDataHelp')) {
      this.state.helpDataHelp = nextProps.helpDataHelp || 'import-export-import';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'supportsImport')) {
      this.state.supportsImport = nextProps.supportsImport !== false;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'supportsClipboardImport')) {
      this.state.supportsClipboardImport = nextProps.supportsClipboardImport !== false;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importBusy')) {
      this.state.importBusy = nextProps.importBusy === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'fileExtension')) {
      this.state.fileExtension = nextProps.fileExtension || '.csv';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importStatusMessage')) {
      this.state.importStatusMessage = nextProps.importStatusMessage || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importStatusLoading')) {
      this.state.importStatusLoading = nextProps.importStatusLoading === true;
    }
  }
}

export { ImportExportImportControlController };
