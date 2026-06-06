import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

const TOOLBAR_ROOT_ROLE = 'import-export-toolbar-root';
const TEXT_PREVIEW_EDITOR_ROOT_ROLE = 'text-preview-editor-root';

class ImportExportWorkspaceView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.toolbar = null;
    this.textPreviewEditor = null;
    this.formatSelector = null;
    this.formatOptionsPanel = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportWorkspaceView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.createFeatures();
    this.render();
  }

  template() {
    return `
      <section class="import-export-workspace" aria-label="Import Export Workspace">
        <div class="importexport" id="importExportToolbarRoot" data-role="${TOOLBAR_ROOT_ROLE}"></div>
        <div class="tabbedTextArea" id="tabbedTextArea" data-role="${TEXT_PREVIEW_EDITOR_ROOT_ROLE}"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.toolbar = this.services.createImportExportToolbarComponent?.({
      root: this.getElementByRole(TOOLBAR_ROOT_ROLE),
      documentObj: this.documentObj,
      props: state,
      callbacks: {
        onSetTextFromGrid: this.services.onSetTextFromGrid,
        onSetGridFromText: this.services.onSetGridFromText,
        onDownload: this.services.onDownload,
        onFileSelected: this.services.onFileSelected,
      },
      services: {
        createFileImportBindingsAdapter: this.services.createFileImportBindingsAdapter,
      },
    });

    this.textPreviewEditor = this.services.createTextPreviewEditorComponent?.({
      root: this.getElementByRole(TEXT_PREVIEW_EDITOR_ROOT_ROLE),
      documentObj: this.documentObj,
      props: {
        mode: state.mode,
        previewRowLimit: state.previewRowLimit,
        autoPreviewEnabled: state.autoPreviewEnabled,
      },
      callbacks: {
        onToggleMode: this.services.onToggleMode,
        onAutoPreviewChange: this.services.onAutoPreviewChange,
        onPreviewRowLimitChange: this.services.onPreviewRowLimitChange,
        onTextInput: this.services.onTextInput,
        onCopyText: this.services.onCopyText,
      },
    });

    this.formatSelector = this.services.createFormatSelectorComponent?.({
      root: this.textPreviewEditor?.getFormatSelectorRoot?.(),
      subtasksRoot: this.textPreviewEditor?.getFormatSubtasksRoot?.(),
      documentObj: this.documentObj,
      props: {
        selectedFormat: state.selectedFormat,
      },
      callbacks: {
        onFormatChange: this.services.onFormatChange,
      },
    });
  }

  getElementByRole(role) {
    return this.root?.querySelector?.(`[data-role="${role}"]`) || null;
  }

  render() {
    const state = this.controller.getState();
    this.toolbar?.update?.(state);
    this.textPreviewEditor?.update?.({
      mode: state.mode,
      previewRowLimit: state.previewRowLimit,
      autoPreviewEnabled: state.autoPreviewEnabled,
    });
    this.formatSelector?.update?.({
      selectedFormat: state.selectedFormat,
    });
  }

  destroy() {
    this.formatOptionsPanel?.destroy?.();
    this.formatSelector?.destroy?.();
    this.textPreviewEditor?.destroy?.();
    this.toolbar?.destroy?.();
    this.root.replaceChildren();
  }

  getTextValue() {
    return this.textPreviewEditor?.getTextValue?.() || '';
  }

  setTextValue(value) {
    this.textPreviewEditor?.setTextValue?.(value);
  }

  getTextArea() {
    return this.textPreviewEditor?.getTextArea?.() || null;
  }

  setCopyButtonText(value) {
    this.textPreviewEditor?.setCopyButtonText?.(value);
  }

  getOptionsFromGui() {
    return this.formatOptionsPanel?.getOptionsFromGui?.() || null;
  }

  isOptionsPanelSupported() {
    return this.formatOptionsPanel?.isSupported?.() === true;
  }

  renderOptionsPanel({ selectedFormat, currentOptions } = {}) {
    const optionsParent = this.textPreviewEditor?.getOptionsPanelRoot?.();

    if (!optionsParent) {
      return;
    }

    if (!this.formatOptionsPanel) {
      this.formatOptionsPanel = this.services.createFormatOptionsPanel?.({
        root: optionsParent,
        documentObj: this.documentObj,
        props: {
          selectedFormat,
          currentOptions,
        },
        callbacks: {
          onApplyOptions: this.services.onApplyOptions,
        },
      });
    }

    this.formatOptionsPanel?.update?.({
      selectedFormat,
      currentOptions,
    });
    this.textPreviewEditor?.setOptionsPanelSupported?.(this.formatOptionsPanel?.isSupported?.() === true);
  }
}

export { ImportExportWorkspaceView };
