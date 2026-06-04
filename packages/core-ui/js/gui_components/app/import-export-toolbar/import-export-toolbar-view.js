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
    return `<span data-help="${state.helpDataHelp}" class="helpicon"></span>
            <button type="button" id="settextfromgridbutton">v Set Text From Grid v</button>
            <button type="button" id="setgridfromtextbutton" disabled>^ Set Grid From Text ^</button>
            <label id="csvinputlabel"><span class="fileFormat">.csv</span> import ^:<input type="file" id="csvinput"/></label>
            <button type="button" id="filedownload"><span class="fileFormat">.csv</span> Download</button>
            <div id="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <label id="dropzone">
            <span>[Drag And Drop <span class="fileFormat">.csv</span> File Here]</span>
            </label>
            <div id="import-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
            <div id="import-export-error" class="generator-schema-error-text" aria-live="polite" role="status"></div>`;
  }

  bindEvents() {
    this.root.querySelector('#settextfromgridbutton')?.addEventListener('click', this.handleSetTextFromGridClick);
    this.root.querySelector('#setgridfromtextbutton')?.addEventListener('click', this.handleSetGridFromTextClick);
    this.root.querySelector('#filedownload')?.addEventListener('click', this.handleDownloadClick);
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
    const setTextFromGridButton = this.root.querySelector('#settextfromgridbutton');
    const setGridFromTextButton = this.root.querySelector('#setgridfromtextbutton');
    const downloadButton = this.root.querySelector('#filedownload');
    const importStatus = this.root.querySelector('#import-progress-status');
    const exportStatus = this.root.querySelector('#export-progress-status');
    const errorStatus = this.root.querySelector('#import-export-error');
    const importVisibility = state.supportsImport ? 'visible' : 'hidden';
    const exportVisibility = state.supportsExport ? 'visible' : 'hidden';

    this.root.querySelectorAll('.fileFormat').forEach((element) => {
      element.textContent = state.fileExtension;
    });

    [
      setGridFromTextButton,
      this.root.querySelector('#dropzone'),
      this.root.querySelector('#csvinputlabel'),
      this.root.querySelector('#csvinput'),
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
    this.root.querySelector('#settextfromgridbutton')?.removeEventListener('click', this.handleSetTextFromGridClick);
    this.root.querySelector('#setgridfromtextbutton')?.removeEventListener('click', this.handleSetGridFromTextClick);
    this.root.querySelector('#filedownload')?.removeEventListener('click', this.handleDownloadClick);
    this.fileImportBindings?.destroy?.();
    this.fileImportBindings = null;
    this.root.replaceChildren();
  }
}

export { ImportExportToolbarView };
