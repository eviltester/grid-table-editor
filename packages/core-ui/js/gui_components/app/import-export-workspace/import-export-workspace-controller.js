import { normalizePreviewRowLimit } from './import-export-workspace-services.js';
import { applyImportTrimProps, createImportTrimState } from '../import-export-trim-state.js';

class ImportExportWorkspaceController {
  constructor({ props = {} } = {}) {
    this.state = {
      selectedFormat: props.selectedFormat || 'csv',
      mode: props.mode || 'preview',
      previewRowLimit: normalizePreviewRowLimit(props.previewRowLimit),
      autoPreviewEnabled: props.autoPreviewEnabled === true,
      previewTextDirty: props.previewTextDirty === true,
      importBusy: props.importBusy === true,
      exportBusy: props.exportBusy === true,
      importStatusMessage: props.importStatusMessage || '',
      importStatusLoading: props.importStatusLoading === true,
      exportStatusMessage: props.exportStatusMessage || '',
      exportStatusLoading: props.exportStatusLoading === true,
      errorStatusMessage: props.errorStatusMessage || '',
      supportsImport: props.supportsImport !== false,
      supportsClipboardImport: props.supportsClipboardImport !== false,
      supportsExport: props.supportsExport !== false,
      fileExtension: props.fileExtension || '.csv',
      exportEncodingSettings: {
        lineEnding: props.exportEncodingSettings?.lineEnding || 'lf',
        includeBom: props.exportEncodingSettings?.includeBom === true,
      },
      ...createImportTrimState(props),
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
      this.state.previewRowLimit = normalizePreviewRowLimit(nextProps.previewRowLimit, this.state.previewRowLimit);
    }
    if (Object.prototype.hasOwnProperty.call(nextProps, 'autoPreviewEnabled')) {
      this.state.autoPreviewEnabled = nextProps.autoPreviewEnabled === true;
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
    applyImportTrimProps(this.state, nextProps);
  }

  setImportStatus(message = '', isLoading = false) {
    this.updateProps({
      importStatusMessage: message,
      importStatusLoading: isLoading,
    });
  }

  setExportStatus(message = '', isLoading = false) {
    this.updateProps({
      exportStatusMessage: message,
      exportStatusLoading: isLoading,
    });
  }

  setBusyState({ importBusy, exportBusy } = {}) {
    const nextProps = {};
    if (Object.prototype.hasOwnProperty.call(arguments[0] || {}, 'importBusy')) {
      nextProps.importBusy = importBusy;
    }
    if (Object.prototype.hasOwnProperty.call(arguments[0] || {}, 'exportBusy')) {
      nextProps.exportBusy = exportBusy;
    }
    this.updateProps(nextProps);
  }

  setSupportState({ supportsImport, supportsClipboardImport, supportsExport, fileExtension } = {}) {
    const nextProps = {};
    if (Object.prototype.hasOwnProperty.call(arguments[0] || {}, 'supportsImport')) {
      nextProps.supportsImport = supportsImport;
    }
    if (Object.prototype.hasOwnProperty.call(arguments[0] || {}, 'supportsClipboardImport')) {
      nextProps.supportsClipboardImport = supportsClipboardImport;
    }
    if (Object.prototype.hasOwnProperty.call(arguments[0] || {}, 'supportsExport')) {
      nextProps.supportsExport = supportsExport;
    }
    if (Object.prototype.hasOwnProperty.call(arguments[0] || {}, 'fileExtension')) {
      nextProps.fileExtension = fileExtension;
    }
    this.updateProps(nextProps);
  }

  markPreviewTextDirty(isDirty) {
    this.updateProps({ previewTextDirty: isDirty === true });
  }

  setExportEncodingSettings(nextSettings = {}) {
    this.updateProps({
      exportEncodingSettings: {
        ...this.state.exportEncodingSettings,
        ...nextSettings,
      },
    });
  }

  setImportTrimSettings(nextSettings = {}) {
    this.updateProps(createImportTrimState(nextSettings));
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

export { ImportExportWorkspaceController };
