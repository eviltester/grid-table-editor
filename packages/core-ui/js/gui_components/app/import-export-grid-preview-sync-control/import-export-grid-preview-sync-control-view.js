import { renderIconHtml } from '../../shared/primitives/icon/icon-core.js';

class ImportExportGridPreviewSyncControlView {
  constructor({ root, controller, callbacks = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.callbacks = callbacks;
    this.handleSetTextFromGridClick = () => this.callbacks.onSetTextFromGrid?.();
    this.handleSetGridFromTextClick = () => this.callbacks.onSetGridFromText?.();
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportGridPreviewSyncControlView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.bindEvents();
    this.render();
  }

  template() {
    const state = this.controller.getState();
    return `
      <div class="import-export-grid-preview-sync-control" data-role="grid-preview-sync-control">
        <span data-help="${state.helpDataHelp}" data-help-role="help-icon" class="helpicon"></span>
        <button
          type="button"
          id="settextfromgridbutton"
          data-role="set-text-from-grid-button"
          aria-label="Set Text From Grid"
          title="Send Grid to Text Preview"
        >
          <span aria-hidden="true" class="import-export-sync-button__icon import-export-sync-button__icon--combo">
            ${renderIconHtml('grid', { className: 'app-icon import-export-sync-button__svg-icon' })}
            <span class="import-export-sync-button__arrow">→</span>
            ${renderIconHtml('file', { className: 'app-icon import-export-sync-button__svg-icon' })}
          </span>
        </button>
        <button
          type="button"
          id="setgridfromtextbutton"
          data-role="set-grid-from-text-button"
          aria-label="Set Grid From Text"
          title="Send Text Preview to Grid"
          disabled
        >
          <span aria-hidden="true" class="import-export-sync-button__icon import-export-sync-button__icon--combo">
            ${renderIconHtml('file', { className: 'app-icon import-export-sync-button__svg-icon' })}
            <span class="import-export-sync-button__arrow">→</span>
            ${renderIconHtml('grid', { className: 'app-icon import-export-sync-button__svg-icon' })}
          </span>
        </button>
      </div>
    `;
  }

  bindEvents() {
    this.getElement('set-text-from-grid-button')?.addEventListener('click', this.handleSetTextFromGridClick);
    this.getElement('set-grid-from-text-button')?.addEventListener('click', this.handleSetGridFromTextClick);
  }

  render() {
    const setTextFromGridButton = this.getElement('set-text-from-grid-button');
    const setGridFromTextButton = this.getElement('set-grid-from-text-button');
    const setTextEnabled = this.controller.canSetTextFromGrid();
    const setGridEnabled = this.controller.canSetGridFromText();
    const state = this.controller.getState();

    if (setTextFromGridButton) {
      setTextFromGridButton.disabled = !setTextEnabled;
      setTextFromGridButton.setAttribute('aria-busy', state.importBusy ? 'true' : 'false');
      setTextFromGridButton.setAttribute('aria-disabled', setTextFromGridButton.disabled ? 'true' : 'false');
    }

    if (setGridFromTextButton) {
      setGridFromTextButton.disabled = !setGridEnabled;
      setGridFromTextButton.setAttribute('aria-disabled', setGridFromTextButton.disabled ? 'true' : 'false');
    }
  }

  destroy() {
    this.getElement('set-text-from-grid-button')?.removeEventListener('click', this.handleSetTextFromGridClick);
    this.getElement('set-grid-from-text-button')?.removeEventListener('click', this.handleSetGridFromTextClick);
    this.root.replaceChildren();
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { ImportExportGridPreviewSyncControlView };
