import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import {
  bindDetailsContentVisibility,
  setDetailsContentVisibility,
} from '../../shared/dom/details-disclosure-focus.js';

const TOOLBAR_ROOT_ROLE = 'import-export-toolbar-root';
const GRID_PREVIEW_SYNC_ROOT_ROLE = 'grid-preview-sync-root';
const TEXT_PREVIEW_EDITOR_ROOT_ROLE = 'text-preview-editor-root';
const TOOLBAR_DETAILS_ROLE = 'import-export-toolbar-details';

class ImportExportWorkspaceView {
  constructor({ root, controller, documentObj, services = {} } = {}) {
    this.root = root;
    this.controller = controller;
    this.documentObj = resolveDocumentObj(documentObj, root);
    this.services = services;
    this.toolbar = null;
    this.gridPreviewSyncControl = null;
    this.textPreviewEditor = null;
    this.formatSelector = null;
    this.formatOptionsPanel = null;
    this.unbindToolbarDetailsVisibility = null;
  }

  mount() {
    if (!this.root) {
      throw new Error('ImportExportWorkspaceView requires a root element');
    }

    this.root.innerHTML = this.template();
    this.bindDisclosureVisibility();
    this.createFeatures();
    this.render();
    this.services.updateHelpHints?.();
  }

  template() {
    return `
      <section class="import-export-workspace" aria-label="Import Export Workspace">
        <div class="import-export-workspace__sync-row" data-role="${GRID_PREVIEW_SYNC_ROOT_ROLE}"></div>
        <details class="import-export-workspace__toolbar-details" data-role="${TOOLBAR_DETAILS_ROLE}">
          <summary>Import / Export</summary>
          <div class="importexport" id="importExportToolbarRoot" data-role="${TOOLBAR_ROOT_ROLE}"></div>
        </details>
        <div class="tabbedTextArea" id="tabbedTextArea" data-role="${TEXT_PREVIEW_EDITOR_ROOT_ROLE}"></div>
      </section>
    `;
  }

  createFeatures() {
    const state = this.controller.getState();
    this.gridPreviewSyncControl = this.services.createImportExportGridPreviewSyncControlComponent?.({
      root: this.getElementByRole(GRID_PREVIEW_SYNC_ROOT_ROLE),
      props: {
        ...state,
        helpDataHelp: 'import-export-grid-preview-sync',
      },
      callbacks: {
        onSetTextFromGrid: this.services.onSetTextFromGrid,
        onSetGridFromText: this.services.onSetGridFromText,
      },
    });

    this.toolbar = this.services.createImportExportToolbarComponent?.({
      root: this.getElementByRole(TOOLBAR_ROOT_ROLE),
      documentObj: this.documentObj,
      props: state,
      callbacks: {
        onDownload: this.services.onDownload,
        onExportEncodingSettingsChange: this.services.onExportEncodingSettingsChange,
        onFileSelected: this.services.onFileSelected,
        onImportFromClipboard: this.services.onImportFromClipboard,
        onImportTrimSettingsChange: this.services.onImportTrimSettingsChange,
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

  bindDisclosureVisibility() {
    this.unbindToolbarDetailsVisibility?.();
    this.unbindToolbarDetailsVisibility = bindDetailsContentVisibility({
      detailsElement: this.getToolbarDetailsElement(),
      contentElement: this.getElementByRole(TOOLBAR_ROOT_ROLE),
    });
  }

  syncToolbarDetailsVisibility() {
    setDetailsContentVisibility({
      detailsElement: this.getToolbarDetailsElement(),
      contentElement: this.getElementByRole(TOOLBAR_ROOT_ROLE),
    });
  }

  render() {
    const state = this.controller.getState();
    this.gridPreviewSyncControl?.update?.(state);
    this.toolbar?.update?.(state);
    this.textPreviewEditor?.update?.({
      mode: state.mode,
      previewRowLimit: state.previewRowLimit,
      autoPreviewEnabled: state.autoPreviewEnabled,
    });
    this.formatSelector?.update?.({
      selectedFormat: state.selectedFormat,
    });
    this.services.updateHelpHints?.();
  }

  destroy() {
    this.unbindToolbarDetailsVisibility?.();
    this.unbindToolbarDetailsVisibility = null;
    this.formatOptionsPanel?.destroy?.();
    this.formatSelector?.destroy?.();
    this.textPreviewEditor?.destroy?.();
    this.toolbar?.destroy?.();
    this.gridPreviewSyncControl?.destroy?.();
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

  getToolbarDetailsElement() {
    return this.getElementByRole(TOOLBAR_DETAILS_ROLE);
  }

  openToolbarDetails() {
    const detailsElement = this.getToolbarDetailsElement();
    if (detailsElement) {
      detailsElement.open = true;
      this.syncToolbarDetailsVisibility();
    }
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
