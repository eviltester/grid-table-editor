class ImportExportDownloadControlController {
  constructor({ props = {} } = {}) {
    this.state = {
      helpDataHelp: props.helpDataHelp || 'import-export-download',
      supportsExport: props.supportsExport !== false,
      importBusy: props.importBusy === true,
      exportBusy: props.exportBusy === true,
      fileExtension: props.fileExtension || '.csv',
      exportEncodingSettings: {
        lineEnding: props.exportEncodingSettings?.lineEnding || 'lf',
        includeBom: props.exportEncodingSettings?.includeBom === true,
      },
      exportStatusMessage: props.exportStatusMessage || '',
      exportStatusLoading: props.exportStatusLoading === true,
    };
  }

  getState() {
    return { ...this.state };
  }

  updateProps(nextProps = {}) {
    if (Object.prototype.hasOwnProperty.call(nextProps, 'helpDataHelp')) {
      this.state.helpDataHelp = nextProps.helpDataHelp || 'import-export-download';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'supportsExport')) {
      this.state.supportsExport = nextProps.supportsExport !== false;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'importBusy')) {
      this.state.importBusy = nextProps.importBusy === true;
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportBusy')) {
      this.state.exportBusy = nextProps.exportBusy === true;
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
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportStatusMessage')) {
      this.state.exportStatusMessage = nextProps.exportStatusMessage || '';
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'exportStatusLoading')) {
      this.state.exportStatusLoading = nextProps.exportStatusLoading === true;
    }
  }

  isDownloadBusy() {
    return this.state.importBusy || this.state.exportBusy;
  }

  isDownloadEnabled() {
    return this.state.supportsExport === true && !this.isDownloadBusy();
  }
}

export { ImportExportDownloadControlController };
