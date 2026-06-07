import { renderIconHtml } from '../../shared/primitives/icon/icon-core.js';

class ImportExportImportControlView {
  constructor({ root, controller, callbacks = {}, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.services = services;
    this.fileImportBindings = null;
    this.handleImportFromClipboardClick = () => this.callbacks.onImportFromClipboard?.();
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportImportControlView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFileBindings();
    this.bindEvents();
    this.render();
  }

  template() {
    const state = this.controller.getState();
    return `
      <div class="import-export-import-control" data-role="import-control">
        <span data-help="${state.helpDataHelp}" data-help-role="help-icon" class="helpicon"></span>
        <label id="csvinputlabel" data-role="file-input-label"><span class="fileFormat" data-role="file-format-label">.csv</span> import:<input type="file" id="csvinput" data-role="file-input"/></label>
        <button type="button" data-role="clipboard-import-button" class="import-export-import-control__clipboard-button" aria-label="Import From Clipboard">
          ${renderIconHtml('clipboard-paste', { className: 'app-icon import-export-import-control__clipboard-icon' })}
          <span>From Clipboard</span>
        </button>
        <label id="dropzone" data-role="drop-zone">
          <span>[Drag And Drop <span class="fileFormat" data-role="file-format-label">.csv</span> File Here]</span>
        </label>
        <div id="import-progress-status" data-role="import-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
      </div>
    `;
  }

  bindEvents() {
    this.getElement('clipboard-import-button')?.addEventListener('click', this.handleImportFromClipboardClick);
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
    const importVisibility = state.supportsImport ? 'visible' : 'hidden';
    const importStatus = this.getElement('import-progress-status');
    const fileInput = this.getElement('file-input');
    const clipboardImportButton = this.getElement('clipboard-import-button');

    this.root.querySelectorAll('[data-role="file-format-label"]').forEach((element) => {
      element.textContent = state.fileExtension;
    });

    [this.getElement('drop-zone'), this.getElement('file-input-label'), fileInput, clipboardImportButton]
      .filter(Boolean)
      .forEach((element) => {
        element.style.visibility = importVisibility;
      });

    if (fileInput) {
      fileInput.disabled = state.importBusy || !state.supportsImport;
      fileInput.setAttribute('aria-disabled', fileInput.disabled ? 'true' : 'false');
    }

    if (clipboardImportButton) {
      clipboardImportButton.disabled = state.importBusy || !state.supportsImport || !state.supportsClipboardImport;
      clipboardImportButton.setAttribute('aria-disabled', clipboardImportButton.disabled ? 'true' : 'false');
    }

    if (importStatus) {
      importStatus.textContent = state.importStatusMessage || '';
      importStatus.style.display = state.importStatusMessage ? 'inline-block' : 'none';
      importStatus.classList.toggle('is-loading', state.importStatusLoading === true);
    }
  }

  destroy() {
    this.getElement('clipboard-import-button')?.removeEventListener('click', this.handleImportFromClipboardClick);
    this.fileImportBindings?.destroy?.();
    this.fileImportBindings = null;
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportImportControlView };
