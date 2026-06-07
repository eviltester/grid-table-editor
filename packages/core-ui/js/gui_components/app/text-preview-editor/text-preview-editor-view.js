import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class TextPreviewEditorView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.toolbar = null;
    this.optionsPreviewSplitLayout = null;
    this.handleTextInput = (event) => this.controller.handleTextInput(event?.currentTarget?.value || '');
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
      <div data-role="text-preview-toolbar-root"></div>
      <div data-role="options-preview-layout-root"></div>
    `;
  }

  createControls() {
    const createTextPreviewToolbarComponent = this.services.createTextPreviewToolbarComponent;
    const toolbarRoot = this.root.querySelector('[data-role="text-preview-toolbar-root"]');
    if (toolbarRoot && typeof createTextPreviewToolbarComponent === 'function') {
      const state = this.controller.getState();
      this.toolbar = createTextPreviewToolbarComponent({
        root: toolbarRoot,
        documentObj: this.documentObj,
        props: {
          mode: state.mode,
          previewRowLimit: state.previewRowLimit,
          autoPreviewEnabled: state.autoPreviewEnabled,
          editModeHelpText: state.editModeHelpText,
        },
        callbacks: {
          onToggleMode: () => this.controller.toggleMode(),
          onAutoPreviewChange: (enabled) => {
            this.controller.setAutoPreviewEnabled(enabled);
            this.render();
          },
          onPreviewRowLimitChange: (previewRowLimit) => {
            this.controller.setPreviewRowLimit(previewRowLimit);
            this.render();
          },
          onCopyText: ({ button } = {}) =>
            this.controller.copyText({
              textArea: this.getTextArea(),
              button,
            }),
        },
      });
    }

    const createOptionsPreviewSplitLayoutComponent = this.services.createOptionsPreviewSplitLayoutComponent;
    const layoutRoot = this.root.querySelector('[data-role="options-preview-layout-root"]');
    if (layoutRoot && typeof createOptionsPreviewSplitLayoutComponent === 'function') {
      this.optionsPreviewSplitLayout = createOptionsPreviewSplitLayoutComponent({
        root: layoutRoot,
        documentObj: this.documentObj,
        props: {
          optionsSupported: false,
        },
      });

      const previewPanelRoot = this.optionsPreviewSplitLayout.getPreviewPanelRoot?.();
      if (previewPanelRoot) {
        previewPanelRoot.innerHTML = `
          <textarea
            class="textrepresentation"
            name="Markdown"
            data-role="preview-text-editor"
            aria-label="Preview text editor"
          ></textarea>
        `;
      }
    }
  }

  bindEvents() {
    this.getTextArea()?.addEventListener('input', this.handleTextInput);
  }

  render() {
    const state = this.controller.getState();
    this.toolbar?.update?.({
      mode: state.mode,
      previewRowLimit: state.previewRowLimit,
      autoPreviewEnabled: state.autoPreviewEnabled,
      editModeHelpText: state.editModeHelpText,
    });
  }

  destroy() {
    this.getTextArea()?.removeEventListener('input', this.handleTextInput);
    this.toolbar?.destroy?.();
    this.toolbar = null;
    this.optionsPreviewSplitLayout?.destroy?.();
    this.optionsPreviewSplitLayout = null;
    this.root.replaceChildren();
  }

  getFormatSelectorRoot() {
    return this.toolbar?.getFormatSelectorRoot?.() || null;
  }

  getFormatSubtasksRoot() {
    return this.toolbar?.getFormatSubtasksRoot?.() || null;
  }

  getTextArea() {
    return this.getElement('preview-text-editor');
  }

  getEditArea() {
    return this.optionsPreviewSplitLayout?.getEditArea?.() || null;
  }

  getOptionsPanelRoot() {
    return this.optionsPreviewSplitLayout?.getOptionsPanelRoot?.() || null;
  }

  getOptionsPreviewSplitter() {
    return this.optionsPreviewSplitLayout?.getOptionsPreviewSplitter?.() || null;
  }

  getTextAreaWrapper() {
    return this.optionsPreviewSplitLayout?.getPreviewPanelRoot?.() || null;
  }

  setOptionsPanelSupported(optionsSupported) {
    this.optionsPreviewSplitLayout?.update?.({
      optionsSupported,
    });
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
    this.toolbar?.setCopyButtonText?.(value);
  }

  getElement(role) {
    return this.root.querySelector(`[data-role="${role}"]`);
  }
}

export { TextPreviewEditorView };
