import { resolveDocumentObj } from '../../shared/dom/default-objects.js';

class ImportExportWorkspaceView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.toolbar = null;
    this.textPreviewEditor = null;
    this.formatSelector = null;
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
        <div class="importexport" id="importExportToolbarRoot"></div>
        <div class="tabbedTextArea" id="tabbedTextArea"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.toolbar = this.services.createImportExportToolbarComponent?.({
      root: this.root.querySelector('#importExportToolbarRoot'),
    });

    this.textPreviewEditor = this.services.createTextPreviewEditorComponent?.({
      root: this.root.querySelector('#tabbedTextArea'),
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

  render() {
    const state = this.controller.getState();
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
    this.formatSelector?.destroy?.();
    this.textPreviewEditor?.destroy?.();
    this.toolbar?.destroy?.();
    this.root.replaceChildren();
  }
}

export { ImportExportWorkspaceView };
