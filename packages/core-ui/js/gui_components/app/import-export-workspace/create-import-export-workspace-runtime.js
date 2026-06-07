import { createConfirmDialogService } from '../../shared/dialog-services/confirm-dialog-service.js';
import { createFormatOptionsPanel } from '../../shared/format-options-panel/index.js';
import { createFormatSelectorComponent } from '../format-selector/index.js';
import { createFileImportBindingsAdapter } from '../import-export-adapters/file-import-bindings-adapter.js';
import { createFileReadService } from '../import-export-adapters/file-read-service.js';
import { createImportExportGridPreviewSyncControlComponent } from '../import-export-grid-preview-sync-control/index.js';
import { createImportExportToolbarComponent } from '../import-export-toolbar/index.js';
import { createTextPreviewEditorComponent } from '../text-preview-editor/index.js';
import { createUpdateHelpHints } from '../../../help/help-tooltips.js';
import {
  createClipboardService,
  createDownloadService,
  createYieldToUi,
  scheduleTimeout,
} from './import-export-workspace-services.js';
import { ImportExportWorkspaceController } from './import-export-workspace-controller.js';
import { ImportExportWorkspaceView } from './import-export-workspace-view.js';
import { createImportExportWorkspaceWorkflowService } from './create-import-export-workspace-workflow-service.js';

function createImportExportWorkspaceRuntime({ root, props = {}, services = {}, documentObj, windowObj } = {}) {
  const controller = new ImportExportWorkspaceController({ props });
  const confirmDialogService = createConfirmDialogService({ documentObj });
  const requestConfirm =
    typeof services.requestConfirm === 'function' ? services.requestConfirm : confirmDialogService.requestConfirm;
  const clipboardService = services.clipboardService || createClipboardService({ documentObj, windowObj });
  const downloadService =
    services.downloadService ||
    createDownloadService({
      documentObj,
      URLObj: windowObj?.URL,
      BlobCtor: windowObj?.Blob,
    });
  const fileReadService =
    services.fileReadService ||
    createFileReadService({
      FileReaderCtor: windowObj?.FileReader,
    });
  const scheduleTimeoutFn = services.scheduleTimeoutFn || scheduleTimeout;
  const yieldToUi =
    services.yieldToUi ||
    createYieldToUi({
      documentObj,
      windowObj,
      requestAnimationFrameFn: windowObj?.requestAnimationFrame?.bind(windowObj),
      setTimeoutFn: windowObj?.setTimeout?.bind(windowObj),
    });
  let importer = services.importer || null;
  let exporter = services.exporter || null;
  let gridChangeUnsubscribe = null;
  let view = null;

  const getType = () => controller.getState().selectedFormat;
  const getState = () => controller.getState();

  const render = () => {
    view?.render?.();
  };
  const workflow = createImportExportWorkspaceWorkflowService({
    controller,
    getView: () => view,
    getImporter: () => importer,
    getExporter: () => exporter,
    fileReadService,
    requestConfirm,
    clipboardService,
    downloadService,
    yieldToUi,
    scheduleTimeoutFn,
    render,
  });

  view = new ImportExportWorkspaceView({
    root,
    controller,
    documentObj,
    services: {
      updateHelpHints: services.updateHelpHints || createUpdateHelpHints(documentObj, root),
      createImportExportGridPreviewSyncControlComponent:
        services.createImportExportGridPreviewSyncControlComponent || createImportExportGridPreviewSyncControlComponent,
      createImportExportToolbarComponent:
        services.createImportExportToolbarComponent || createImportExportToolbarComponent,
      createTextPreviewEditorComponent: services.createTextPreviewEditorComponent || createTextPreviewEditorComponent,
      createFormatSelectorComponent: services.createFormatSelectorComponent || createFormatSelectorComponent,
      createFileImportBindingsAdapter: services.createFileImportBindingsAdapter || createFileImportBindingsAdapter,
      createFormatOptionsPanel: services.createFormatOptionsPanel || createFormatOptionsPanel,
      onFormatChange: workflow.handleFormatChange,
      onToggleMode: workflow.toggleTextEditMode,
      onAutoPreviewChange: workflow.updateAutoPreviewEnabled,
      onPreviewRowLimitChange: workflow.updatePreviewRowLimit,
      onTextInput: workflow.handleTextInput,
      onCopyText: workflow.copyText,
      onSetTextFromGrid: workflow.renderTextFromGrid,
      onSetGridFromText: workflow.importTextArea,
      onDownload: workflow.fileDownload,
      onFileSelected: workflow.loadFile,
      onImportFromClipboard: workflow.importFromClipboard,
      onApplyOptions: ({ sanitized }) => {
        workflow.applyOptionsToTargets(sanitized);
        workflow.setOptionsViewForFormatType();
        workflow.renderTextFromGrid();
      },
    },
  });

  view.mount();
  workflow.syncSupportState();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      workflow.syncSupportState();
      workflow.setOptionsViewForFormatType();
      render();
    },
    destroy() {
      if (typeof gridChangeUnsubscribe === 'function') {
        gridChangeUnsubscribe();
        gridChangeUnsubscribe = null;
      }
      view.destroy();
    },
    getState,
    setExporter(nextExporter) {
      exporter = nextExporter;
      workflow.syncSupportState();
    },
    setImporter(nextImporter) {
      importer = nextImporter;
      workflow.syncSupportState();
    },
    setGridChangeSource(gridChangeSource) {
      if (typeof gridChangeUnsubscribe === 'function') {
        gridChangeUnsubscribe();
        gridChangeUnsubscribe = null;
      }
      if (typeof gridChangeSource?.onGridChanged === 'function') {
        gridChangeUnsubscribe = gridChangeSource.onGridChanged(workflow.maybeAutoPreviewFromGridChange);
      }
    },
    renderTextFromGrid: workflow.renderTextFromGrid,
    setFileFormatType(format) {
      workflow.handleFormatChange(format ?? getType());
    },
    setOptionsViewForFormatType: workflow.setOptionsViewForFormatType,
    setCurrentTypeOptions: workflow.setCurrentTypeOptions,
    applyCurrentTypeOptions(options) {
      workflow.applyOptionsToTargets(options);
      workflow.setOptionsViewForFormatType();
      return workflow.renderTextFromGrid();
    },
    importTextArea: workflow.importTextArea,
    loadFile: workflow.loadFile,
    readFile: workflow.readFile,
    fileDownload: workflow.fileDownload,
    copyText: workflow.copyText,
    importFromClipboard: workflow.importFromClipboard,
    toggleTextEditMode: workflow.toggleTextEditMode,
    getPreviewRowLimit() {
      return getState().previewRowLimit;
    },
    isPreviewTextMode() {
      return getState().mode === 'preview';
    },
    getTextValue() {
      return view.getTextValue();
    },
    setTextFromString: workflow.setTextFromString,
  };
}

export { createImportExportWorkspaceRuntime };
