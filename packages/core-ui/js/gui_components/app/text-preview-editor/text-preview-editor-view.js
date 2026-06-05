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
    this.handleTextInput = (event) => this.controller.handleTextInput(event?.currentTarget?.value || '');
    this.handleCopyClick = () =>
      this.controller.copyText({
        textArea: this.getTextArea(),
        button: this.getCopyButton(),
      });
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
        <div data-role="format-selector-root" class="conversionTypes"></div>
        <div class="rightbuttons">
          <label data-role="auto-preview-label" class="auto-preview-control">
            <input type="checkbox" data-role="auto-preview-checkbox" />
            Auto Preview
          </label>
          <span
            title="Preview/Edit mode help"
            data-role="preview-edit-mode-help"
            data-help="preview-edit-mode-help"
            class="helpicon option-help-icon"
          ></span>
          <button
            type="button"
            title="Toggle Preview/Edit mode"
            data-role="preview-edit-mode-button"
          >Preview</button>
          <span data-role="preview-row-count-root"></span>
          <button type="button" title="Copy text to clipboard" data-role="copy-text-button">Copy</button>
        </div>
      </div>
      <div data-role="format-subtasks-root" class="conversionSubtasks" style="display: none"></div>

      <div class="edit-area" data-role="edit-area">
          <div class="options-parent" data-role="options-panel-root" style="display: none"></div>
          <div
            class="options-preview-splitter"
            data-role="options-preview-splitter"
            style="display: none"
            role="separator"
            tabindex="0"
            aria-orientation="vertical"
            aria-label="Resize options panel"
          ></div>
          <div data-role="preview-text-wrapper" style="height: 30%; width:100%;">
            <textarea
              class="textrepresentation"
              name="Markdown"
              data-role="preview-text-editor"
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
          label: '',
          min: 1,
          max: 50,
          step: 1,
          value: state.previewRowLimit,
          normalizeOnInput: true,
          clampToMaxOnInput: true,
          inputAriaLabel: 'Preview row count',
          className: 'app-preview-row-count-control',
          labelClassName: 'shared-row-count-label',
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
    this.getElement('preview-edit-mode-button')?.addEventListener('click', this.handleModeClick);
    this.getElement('auto-preview-checkbox')?.addEventListener('change', this.handleAutoPreviewChange);
    this.getTextArea()?.addEventListener('input', this.handleTextInput);
    this.getCopyButton()?.addEventListener('click', this.handleCopyClick);
  }

  render() {
    const state = this.controller.getState();
    const modeButton = this.getElement('preview-edit-mode-button');
    const autoPreviewCheckbox = this.getElement('auto-preview-checkbox');
    const modeHelpIcon = this.getElement('preview-edit-mode-help');

    if (modeButton) {
      modeButton.innerText = state.mode === 'preview' ? 'Preview' : 'Edit';
    }
    if (autoPreviewCheckbox) {
      autoPreviewCheckbox.checked = state.autoPreviewEnabled;
      autoPreviewCheckbox.disabled = state.mode !== 'preview';
    }
    this.previewRowCountControl?.update?.({
      label: '',
      min: 1,
      max: 50,
      step: 1,
      value: state.previewRowLimit,
      normalizeOnInput: true,
      clampToMaxOnInput: true,
      inputAriaLabel: 'Preview row count',
      className: 'app-preview-row-count-control',
      labelClassName: 'shared-row-count-label',
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
    this.getElement('preview-edit-mode-button')?.removeEventListener('click', this.handleModeClick);
    this.getElement('auto-preview-checkbox')?.removeEventListener('change', this.handleAutoPreviewChange);
    this.getTextArea()?.removeEventListener('input', this.handleTextInput);
    this.getCopyButton()?.removeEventListener('click', this.handleCopyClick);
    this.previewRowCountControl?.destroy?.();
    this.previewRowCountControl = null;
    this.root.replaceChildren();
  }

  getFormatSelectorRoot() {
    return this.getElement('format-selector-root');
  }

  getFormatSubtasksRoot() {
    return this.getElement('format-subtasks-root');
  }

  getTextArea() {
    return this.getElement('preview-text-editor');
  }

  getCopyButton() {
    return this.getElement('copy-text-button');
  }

  getEditArea() {
    return this.getElement('edit-area');
  }

  getOptionsPanelRoot() {
    return this.getElement('options-panel-root');
  }

  getOptionsPreviewSplitter() {
    return this.getElement('options-preview-splitter');
  }

  getTextAreaWrapper() {
    return this.getElement('preview-text-wrapper');
  }

  getTextValue() {
    return this.getTextArea()?.value || '';
  }

  setTextValue(value) {
    const textArea = this.getTextArea();
    if (textArea) {
      textArea.value = value || '';
    }
  }

  setCopyButtonText(value) {
    const button = this.getCopyButton();
    if (button) {
      button.textContent = value || 'Copy';
    }
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { TextPreviewEditorView };
