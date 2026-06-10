class ImportExportToolbarView {
  constructor({ root, controller, callbacks = {}, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.services = services;
    this.gridPreviewSyncControl = null;
    this.importControl = null;
    this.downloadControl = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportToolbarView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
    this.services.updateHelpHints?.();
  }

  template() {
    return `
      <div class="import-export-toolbar" data-role="import-export-toolbar">
        <div data-role="import-control-root" class="import-export-toolbar__segment import-export-toolbar__segment--import"></div>
        <div data-role="download-control-root" class="import-export-toolbar__segment import-export-toolbar__segment--download"></div>
      </div>
      <div id="import-export-error" data-role="error-status" class="shared-inline-error-status" aria-live="polite" role="status"></div>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.importControl = this.services.createImportExportImportControlComponent?.({
      root: this.getElement('import-control-root'),
      props: {
        ...state,
        helpDataHelp: 'import-export-import',
      },
      callbacks: {
        onFileSelected: this.callbacks.onFileSelected,
        onImportFromClipboard: this.callbacks.onImportFromClipboard,
        onImportTrimSettingsChange: this.callbacks.onImportTrimSettingsChange,
      },
      services: {
        createFileImportBindingsAdapter: this.services.createFileImportBindingsAdapter,
      },
    });
    this.downloadControl = this.services.createImportExportDownloadControlComponent?.({
      root: this.getElement('download-control-root'),
      props: {
        ...state,
        helpDataHelp: 'import-export-download',
      },
      callbacks: {
        onDownload: this.callbacks.onDownload,
        onExportEncodingSettingsChange: this.callbacks.onExportEncodingSettingsChange,
      },
    });
  }

  render() {
    const state = this.controller.getState();
    const errorStatus = this.getElement('error-status');
    this.importControl?.update?.(state);
    this.downloadControl?.update?.(state);
    if (errorStatus) {
      errorStatus.textContent = state.errorStatusMessage;
      errorStatus.style.display = state.errorStatusMessage ? 'block' : '';
    }
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.downloadControl?.destroy?.();
    this.importControl?.destroy?.();
    this.downloadControl = null;
    this.importControl = null;
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportToolbarView };
