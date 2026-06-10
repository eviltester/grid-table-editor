import { renderIconHtml } from '../../shared/primitives/icon/icon-core.js';

class ImportExportImportControlView {
  constructor({ root, controller, callbacks = {}, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.services = services;
    this.fileImportBindings = null;
    this.handleImportFromClipboardClick = () => this.callbacks.onImportFromClipboard?.();
    this.handleTrimInputChange = () => this.emitImportTrimSettingsChange();
    this.handleTrimInputFieldsModeChange = () => this.emitImportTrimSettingsChange();
    this.handleTrimInputFieldsTextInput = () => this.emitImportTrimSettingsChange();
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
        <details class="import-export-import-control__settings" data-role="import-settings-details">
          <summary class="import-export-import-control__settings-summary" aria-label="Import settings">
            ${renderIconHtml('settings', { className: 'app-icon import-export-import-control__settings-icon' })}
            <span>Settings</span>
          </summary>
          <div class="import-export-import-control__settings-panel" data-role="import-settings-panel">
            <fieldset class="import-export-import-control__settings-group">
              <legend>Trim Input</legend>
              <label>
                <input type="radio" name="importTrimInput" value="off" data-role="trim-input-off-radio" ${
                  state.trimInput === true ? '' : 'checked'
                }>
                <span>Off</span>
              </label>
              <label>
                <input type="radio" name="importTrimInput" value="on" data-role="trim-input-on-radio" ${
                  state.trimInput === true ? 'checked' : ''
                }>
                <span>On</span>
              </label>
            </fieldset>
            <fieldset class="import-export-import-control__settings-group">
              <legend>Trim Input Fields</legend>
              <label>
                <input type="radio" name="importTrimFieldsMode" value="off" data-role="trim-input-fields-off-radio" ${
                  state.trimInputFieldsEnabled === true ? '' : 'checked'
                }>
                <span>Off</span>
              </label>
              <label>
                <input type="radio" name="importTrimFieldsMode" value="selected" data-role="trim-input-fields-selected-radio" ${
                  state.trimInputFieldsEnabled === true ? 'checked' : ''
                }>
                <span>Selected Fields</span>
              </label>
              <label class="import-export-import-control__settings-text">
                <span>Field names (CSV)</span>
                <input type="text" data-role="trim-input-fields-text" value="${state.trimInputFieldsCsv || ''}" aria-label="Trim input fields CSV">
              </label>
            </fieldset>
          </div>
        </details>
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
    this.getElement('trim-input-off-radio')?.addEventListener('change', this.handleTrimInputChange);
    this.getElement('trim-input-on-radio')?.addEventListener('change', this.handleTrimInputChange);
    this.getElement('trim-input-fields-off-radio')?.addEventListener('change', this.handleTrimInputFieldsModeChange);
    this.getElement('trim-input-fields-selected-radio')?.addEventListener(
      'change',
      this.handleTrimInputFieldsModeChange
    );
    this.getElement('trim-input-fields-text')?.addEventListener('input', this.handleTrimInputFieldsTextInput);
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
    const trimInputOffRadio = this.getElement('trim-input-off-radio');
    const trimInputOnRadio = this.getElement('trim-input-on-radio');
    const trimInputFieldsOffRadio = this.getElement('trim-input-fields-off-radio');
    const trimInputFieldsSelectedRadio = this.getElement('trim-input-fields-selected-radio');
    const trimInputFieldsText = this.getElement('trim-input-fields-text');

    this.root.querySelectorAll('[data-role="file-format-label"]').forEach((element) => {
      element.textContent = state.fileExtension;
    });

    [this.getElement('drop-zone'), this.getElement('file-input-label'), fileInput, clipboardImportButton]
      .filter(Boolean)
      .forEach((element) => {
        element.style.visibility = importVisibility;
      });

    if (trimInputOffRadio) {
      trimInputOffRadio.checked = state.trimInput !== true;
      trimInputOffRadio.disabled = state.importBusy || !state.supportsImport;
    }
    if (trimInputOnRadio) {
      trimInputOnRadio.checked = state.trimInput === true;
      trimInputOnRadio.disabled = state.importBusy || !state.supportsImport;
    }
    if (trimInputFieldsOffRadio) {
      trimInputFieldsOffRadio.checked = state.trimInputFieldsEnabled !== true;
      trimInputFieldsOffRadio.disabled = state.importBusy || !state.supportsImport;
    }
    if (trimInputFieldsSelectedRadio) {
      trimInputFieldsSelectedRadio.checked = state.trimInputFieldsEnabled === true;
      trimInputFieldsSelectedRadio.disabled = state.importBusy || !state.supportsImport;
    }
    if (trimInputFieldsText) {
      trimInputFieldsText.value = state.trimInputFieldsCsv || '';
      trimInputFieldsText.disabled = state.importBusy || !state.supportsImport || state.trimInputFieldsEnabled !== true;
      trimInputFieldsText.setAttribute('aria-disabled', trimInputFieldsText.disabled ? 'true' : 'false');
    }

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
    this.getElement('trim-input-off-radio')?.removeEventListener('change', this.handleTrimInputChange);
    this.getElement('trim-input-on-radio')?.removeEventListener('change', this.handleTrimInputChange);
    this.getElement('trim-input-fields-off-radio')?.removeEventListener('change', this.handleTrimInputFieldsModeChange);
    this.getElement('trim-input-fields-selected-radio')?.removeEventListener(
      'change',
      this.handleTrimInputFieldsModeChange
    );
    this.getElement('trim-input-fields-text')?.removeEventListener('input', this.handleTrimInputFieldsTextInput);
    this.fileImportBindings?.destroy?.();
    this.fileImportBindings = null;
    this.root.replaceChildren();
  }

  emitImportTrimSettingsChange() {
    const nextSettings = {
      trimInput: this.getElement('trim-input-on-radio')?.checked === true,
      trimInputFieldsEnabled: this.getElement('trim-input-fields-selected-radio')?.checked === true,
      trimInputFieldsCsv: this.getElement('trim-input-fields-text')?.value || '',
    };
    this.controller.updateProps(nextSettings);
    this.render();
    this.callbacks.onImportTrimSettingsChange?.(nextSettings);
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportImportControlView };
