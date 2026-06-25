import { renderIconHtml } from '../../shared/primitives/icon/icon-core.js';

class ImportExportDownloadControlView {
  constructor({ root, controller, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.handleDownloadClick = () => this.callbacks.onDownload?.();
    this.handleLineEndingChange = (event) =>
      this.callbacks.onExportEncodingSettingsChange?.({ lineEnding: event.target?.value || 'lf' });
    this.handleIncludeBomChange = (event) =>
      this.callbacks.onExportEncodingSettingsChange?.({ includeBom: event.target?.checked === true });
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
        <button type="button" id="filedownload" data-role="download-button" aria-label="Download file" title="Download file"><span class="fileFormat" data-role="file-format-label">.csv</span> Download</button>
        <details class="export-encoding-settings" data-role="export-encoding-details">
          <summary class="export-encoding-settings__summary" data-role="export-encoding-summary" aria-label="Export settings">
            ${renderIconHtml('settings', { className: 'app-icon export-encoding-settings__icon' })}
            <span class="export-encoding-settings__label">Settings</span>
          </summary>
          <div class="export-encoding-settings__panel" data-role="export-encoding-panel">
            <label class="export-encoding-settings__field">
              <span>Line endings</span>
              <select aria-label="Line endings" data-role="line-ending-select">
                <option value="lf">Unix (LF)</option>
                <option value="crlf">Windows (CR/LF)</option>
              </select>
            </label>
            <label class="export-encoding-settings__field export-encoding-settings__field--checkbox">
              <input type="checkbox" data-role="include-bom-checkbox">
              <span>Include BOM</span>
            </label>
          </div>
        </details>
        <div id="export-progress-status" data-role="export-progress-status" class="import-progress-status" style="display:none;" aria-live="polite"></div>
      </div>
    `;
  }

  bindEvents() {
    this.getElement('download-button')?.addEventListener('click', this.handleDownloadClick);
    this.getElement('line-ending-select')?.addEventListener('change', this.handleLineEndingChange);
    this.getElement('include-bom-checkbox')?.addEventListener('change', this.handleIncludeBomChange);
  }

  render() {
    const state = this.controller.getState();
    const downloadButton = this.getElement('download-button');
    const exportStatus = this.getElement('export-progress-status');
    const lineEndingSelect = this.getElement('line-ending-select');
    const includeBomCheckbox = this.getElement('include-bom-checkbox');
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
    if (lineEndingSelect) {
      lineEndingSelect.value = state.exportEncodingSettings?.lineEnding || 'lf';
      lineEndingSelect.disabled = isBusy;
    }
    if (includeBomCheckbox) {
      includeBomCheckbox.checked = state.exportEncodingSettings?.includeBom === true;
      includeBomCheckbox.disabled = isBusy;
    }

    if (exportStatus) {
      exportStatus.textContent = state.exportStatusMessage || '';
      exportStatus.style.display = state.exportStatusMessage ? 'inline-block' : 'none';
      exportStatus.classList.toggle('is-loading', state.exportStatusLoading === true);
    }
  }

  destroy() {
    this.getElement('download-button')?.removeEventListener('click', this.handleDownloadClick);
    this.getElement('line-ending-select')?.removeEventListener('change', this.handleLineEndingChange);
    this.getElement('include-bom-checkbox')?.removeEventListener('change', this.handleIncludeBomChange);
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportDownloadControlView };
