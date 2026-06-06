class ImportExportToolbarView {
  constructor({ root, controller, callbacks = {}, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.services = services;
    this.fileImportBindings = null;
    this.handleSetTextFromGridClick = () => this.callbacks.onSetTextFromGrid?.();
    this.handleSetGridFromTextClick = () => this.callbacks.onSetGridFromText?.();
    this.handleDownloadClick = () => this.callbacks.onDownload?.();
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportToolbarView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.bindEvents();
    this.createFileBindings();
    this.render();
    this.services.updateHelpHints?.();
  }

  template() {
    const state = this.controller.getState();
    return `<span data-help="${state.helpDataHelp}" data-help-role="help-icon" class="helpicon"></span>
            <button type="button" id="settextfromgridbutton" data-role="set-text-from-grid-button">v Set Text From Grid v</button>
            <button type="button" id="setgridfromtextbutton" data-role="set-grid-from-text-button" disabled>^ Set Grid From Text ^</button>
            <label id="csvinputlabel" data-role="file-input-label"><span class="fileFormat" data-role="file-format-label">.csv</span> import ^:<input type="file" id="csvinput" data-role="file-input"/></label>
            <button type="button" id="filedownload" data-role="download-button"><span class="fileFormat" data-role="file-format-label">.csv</span> Download</button>
            <div id="export-progress-status" data-role="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <label id="dropzone" data-role="drop-zone">
            <span>[Drag And Drop <span class="fileFormat" data-role="file-format-label">.csv</span> File Here]</span>
            </label>
            <div id="import-progress-status" data-role="import-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <div id="import-export-error" data-role="error-status" class="shared-inline-error-status" aria-live="polite" role="status"></div>`;
  }

  bindEvents() {
    this.getElement('set-text-from-grid-button')?.addEventListener('click', this.handleSetTextFromGridClick);
    this.getElement('set-grid-from-text-button')?.addEventListener('click', this.handleSetGridFromTextClick);
    this.getElement('download-button')?.addEventListener('click', this.handleDownloadClick);
  }

  createFileBindings() {
    this.fileImportBindings?.destroy?.();
    this.fileImportBindings = this.services.createFileImportBindingsAdapter?.({
      root: this.root,
      onFileSelected: (file) => this.callbacks.onFileSelected?.(file),
    });
  }

  render() {
    const state = this.controller.getState();
    const setTextFromGridButton = this.getElement('set-text-from-grid-button');
    const setGridFromTextButton = this.getElement('set-grid-from-text-button');
    const downloadButton = this.getElement('download-button');
    const importStatus = this.getElement('import-progress-status');
    const exportStatus = this.getElement('export-progress-status');
    const errorStatus = this.getElement('error-status');
    const importVisibility = state.supportsImport ? 'visible' : 'hidden';
    const exportVisibility = state.supportsExport ? 'visible' : 'hidden';

    this.root.querySelectorAll('[data-role="file-format-label"]').forEach((element) => {
      element.textContent = state.fileExtension;
    });

    [
      setGridFromTextButton,
      this.getElement('drop-zone'),
      this.getElement('file-input-label'),
      this.getElement('file-input'),
    ]
      .filter(Boolean)
      .forEach((element) => {
        element.style.visibility = importVisibility;
      });

    if (downloadButton) {
      downloadButton.style.visibility = exportVisibility;
      const isBusy = state.importBusy || state.exportBusy;
      downloadButton.disabled = isBusy || !state.supportsExport;
      downloadButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    }

    if (setTextFromGridButton) {
      const isBusy = state.importBusy === true;
      setTextFromGridButton.disabled = isBusy || !state.supportsExport;
      setTextFromGridButton.setAttribute('aria-busy', isBusy ? 'true' : 'false');
      setTextFromGridButton.setAttribute('aria-disabled', setTextFromGridButton.disabled ? 'true' : 'false');
    }

    if (setGridFromTextButton) {
      setGridFromTextButton.disabled = !this.controller.canSetGridFromText();
      setGridFromTextButton.setAttribute('aria-disabled', setGridFromTextButton.disabled ? 'true' : 'false');
    }

    this.renderStatus(importStatus, state.importStatusMessage, state.importStatusLoading);
    this.renderStatus(exportStatus, state.exportStatusMessage, state.exportStatusLoading);
    if (errorStatus) {
      errorStatus.textContent = state.errorStatusMessage;
      errorStatus.style.display = state.errorStatusMessage ? 'block' : '';
    }
    this.services.updateHelpHints?.();
  }

  renderStatus(element, message, isLoading) {
    if (!element) {
      return;
    }
    element.textContent = message || '';
    element.style.display = message ? 'inline-block' : 'none';
    element.classList.toggle('is-loading', isLoading === true);
  }

  destroy() {
    this.getElement('set-text-from-grid-button')?.removeEventListener('click', this.handleSetTextFromGridClick);
    this.getElement('set-grid-from-text-button')?.removeEventListener('click', this.handleSetGridFromTextClick);
    this.getElement('download-button')?.removeEventListener('click', this.handleDownloadClick);
    this.fileImportBindings?.destroy?.();
    this.fileImportBindings = null;
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportToolbarView };
