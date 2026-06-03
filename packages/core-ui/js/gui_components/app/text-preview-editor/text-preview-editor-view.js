import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class TextPreviewEditorView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.previewRowCountControl = null;
    this.handleModeClick = () => this.controller.toggleMode();
    this.handleAutoPreviewChange = (event) =>
      this.controller.setAutoPreviewEnabled(event?.currentTarget?.checked === true);
  }

  mount() {
    if (!this.root) {
      throw new Error('TextPreviewEditorView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createControls();
    this.bindEvents();
    this.render();
    this.services.updateHelpHints?.();
  }

  template() {
    return `
      <div class="conversionTabs">
        <div id="conversionTypes" class="conversionTypes"></div>
        <div class="rightbuttons">
          <label id="autoPreviewLabel" class="auto-preview-control">
            <input type="checkbox" id="autoPreviewCheckbox" />
            Auto Preview
          </label>
          <span
            title="Preview/Edit mode help"
            id="previewEditModeHelpIcon"
            data-help="preview-edit-mode-help"
            class="helpicon option-help-icon"
          ></span>
          <button type="button" title="Toggle Preview/Edit mode" id="previewEditModeButton">Preview</button>
          <span data-role="preview-row-count-root"></span>
          <button type="button" title="Copy text to clipboard" id="copyTextButton">Copy</button>
        </div>
      </div>
      <div id="conversionSubtasks" class="conversionSubtasks" style="display: none"></div>

      <div class="edit-area">
          <div class="options-parent" style="display: none"></div>
          <div
            class="options-preview-splitter"
            style="display: none"
            role="separator"
            tabindex="0"
            aria-orientation="vertical"
            aria-label="Resize options panel"
          ></div>
          <div id="markdown" style="height: 30%; width:100%;">
            <textarea
              class="textrepresentation"
              name="Markdown"
              id="markdownarea"
              aria-label="Preview text editor"
            ></textarea>
          </div>
      </div>
    `;
  }

  createControls() {
    const createRowCountControl = this.services.createRowCountControl;
    const rowCountRoot = this.root.querySelector('[data-role="preview-row-count-root"]');
    if (rowCountRoot && typeof createRowCountControl === 'function') {
      const state = this.controller.getState();
      this.previewRowCountControl = createRowCountControl({
        root: rowCountRoot,
        documentObj: this.documentObj,
        props: {
          inputId: 'previewRowsCount',
          label: '',
          min: 1,
          max: 50,
          step: 1,
          value: state.previewRowLimit,
          normalizeOnInput: true,
          clampToMaxOnInput: true,
          inputAriaLabel: 'Preview row count',
          className: 'app-preview-row-count-control',
          labelClassName: 'generator-preview-count-label',
        },
        callbacks: {
          onChange: ({ parsed }) => {
            if (parsed?.valid) {
              this.controller.setPreviewRowLimit(parsed.value);
              this.render();
            }
          },
        },
      });
    }
  }

  bindEvents() {
    this.root.querySelector('#previewEditModeButton')?.addEventListener('click', this.handleModeClick);
    this.root.querySelector('#autoPreviewCheckbox')?.addEventListener('change', this.handleAutoPreviewChange);
  }

  render() {
    const state = this.controller.getState();
    const modeButton = this.root.querySelector('#previewEditModeButton');
    const autoPreviewCheckbox = this.root.querySelector('#autoPreviewCheckbox');
    const modeHelpIcon = this.root.querySelector('#previewEditModeHelpIcon');

    if (modeButton) {
      modeButton.innerText = state.mode === 'preview' ? 'Preview' : 'Edit';
    }
    if (autoPreviewCheckbox) {
      autoPreviewCheckbox.checked = state.autoPreviewEnabled;
      autoPreviewCheckbox.disabled = state.mode !== 'preview';
    }
    this.previewRowCountControl?.update?.({
      inputId: 'previewRowsCount',
      label: '',
      min: 1,
      max: 50,
      step: 1,
      value: state.previewRowLimit,
      normalizeOnInput: true,
      clampToMaxOnInput: true,
      inputAriaLabel: 'Preview row count',
      className: 'app-preview-row-count-control',
      labelClassName: 'generator-preview-count-label',
      disabled: state.mode !== 'preview',
    });
    if (modeHelpIcon) {
      const previewHelpText =
        state.mode === 'preview'
          ? `Preview mode shows a sample of the first ${state.previewRowLimit} rows from the data grid in the chosen format. Click Preview to switch to Edit mode and show full grid data.`
          : state.editModeHelpText;
      modeHelpIcon.setAttribute('data-help-text', previewHelpText);
      modeHelpIcon._tippy?.setContent?.(previewHelpText);
    }
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.root.querySelector('#previewEditModeButton')?.removeEventListener('click', this.handleModeClick);
    this.root.querySelector('#autoPreviewCheckbox')?.removeEventListener('change', this.handleAutoPreviewChange);
    this.previewRowCountControl?.destroy?.();
    this.previewRowCountControl = null;
    this.root.replaceChildren();
  }

  getFormatSelectorRoot() {
    return this.root.querySelector('#conversionTypes');
  }

  getFormatSubtasksRoot() {
    return this.root.querySelector('#conversionSubtasks');
  }
}

export { TextPreviewEditorView };
