class ImportExportDownloadControlView {
  constructor({ root, controller, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.handleDownloadClick = () => this.callbacks.onDownload?.();
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportDownloadControlView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.bindEvents();
    this.render();
  }

  template() {
    const state = this.controller.getState();
    return `
      <div class="import-export-download-control" data-role="download-control">
        <span data-help="${state.helpDataHelp}" data-help-role="help-icon" class="helpicon"></span>
        <button type="button" id="filedownload" data-role="download-button"><span class="fileFormat" data-role="file-format-label">.csv</span> Download</button>
        <div id="export-progress-status" data-role="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
      </div>
    `;
  }

  bindEvents() {
    this.getElement('download-button')?.addEventListener('click', this.handleDownloadClick);
  }

  render() {
    const state = this.controller.getState();
    const downloadButton = this.getElement('download-button');
    const exportStatus = this.getElement('export-progress-status');
    const exportVisibility = state.supportsExport ? 'visible' : 'hidden';
    const isBusy = this.controller.isDownloadBusy();

    this.root.querySelectorAll('[data-role="file-format-label"]').forEach((element) => {
      element.textContent = state.fileExtension;
    });

    if (downloadButton) {
      downloadButton.style.visibility = exportVisibility;
      downloadButton.disabled = !this.controller.isDownloadEnabled();
      downloadButton.setAttribute('aria-disabled', downloadButton.disabled ? 'true' : 'false');
      downloadButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    if (exportStatus) {
      exportStatus.textContent = state.exportStatusMessage || '';
      exportStatus.style.display = state.exportStatusMessage ? 'inline-block' : 'none';
      exportStatus.classList.toggle('is-loading', state.exportStatusLoading === true);
    }
  }

  destroy() {
    this.getElement('download-button')?.removeEventListener('click', this.handleDownloadClick);
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportDownloadControlView };
