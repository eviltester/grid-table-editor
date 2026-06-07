import { scheduleTimeout } from './import-export-workspace-services.js';
import { createImportExportPreviewWorkflowService } from './create-import-export-preview-workflow-service.js';
import { createImportExportFileTransferService } from './create-import-export-file-transfer-service.js';

function createImportExportWorkspaceWorkflowService({
  controller,
  getView,
  getImporter,
  getExporter,
  fileReadService,
  requestConfirm,
  clipboardService,
  downloadService,
  yieldToUi = async () => {},
  scheduleTimeoutFn = scheduleTimeout,
  render = () => {},
} = {}) {
  if (!controller) {
    throw new Error('createImportExportWorkspaceWorkflowService requires a controller');
  }

  const getState = () => controller.getState();
  const getType = () => getState().selectedFormat;
  const view = () => getView?.() || null;
  const importer = () => getImporter?.() || null;
  const exporter = () => getExporter?.() || null;

  const setTextFromString = (value, { previewTextDirty = false } = {}) => {
    view()?.setTextValue?.(value || '');
    controller.markPreviewTextDirty(previewTextDirty);
    render();
  };

  const setImportStatus = (message = '', isLoading = false) => {
    controller.setImportStatus(message, isLoading);
    render();
  };

  const setExportStatus = (message = '', isLoading = false) => {
    controller.setExportStatus(message, isLoading);
    render();
  };

  const showError = (message) => {
    const text = String(message ?? '').trim();
    if (!text) {
      return;
    }
    controller.updateProps({ errorStatusMessage: text });
    render();
    scheduleTimeoutFn(() => {
      controller.updateProps({ errorStatusMessage: '' });
      render();
    }, 5000);
  };

  const syncSupportState = () => {
    const type = getType();
    const currentImporter = importer();
    const currentExporter = exporter();
    const supportsImport = typeof currentImporter?.canImport === 'function' ? currentImporter.canImport(type) : false;
    const supportsExport = typeof currentExporter?.canExport === 'function' ? currentExporter.canExport(type) : false;
    const supportsClipboardImport =
      supportsImport &&
      ((typeof clipboardService?.canReadText === 'function' && clipboardService.canReadText()) ||
        typeof clipboardService?.readText === 'function');
    const fileExtension =
      currentImporter?.getFileExtensionFor?.(type) ||
      currentExporter?.getFileExtensionFor?.(type) ||
      `.${type || 'csv'}`;
    controller.setSupportState({ supportsImport, supportsClipboardImport, supportsExport, fileExtension });
    render();
  };
  const previewWorkflow = createImportExportPreviewWorkflowService({
    controller,
    getState,
    getType,
    view,
    importer,
    exporter,
    requestConfirm,
    render,
    syncSupportState,
    setTextFromString,
    showError,
  });

  const fileTransferWorkflow = createImportExportFileTransferService({
    controller,
    getState,
    getType,
    view,
    importer,
    exporter,
    fileReadService,
    clipboardService,
    downloadService,
    yieldToUi,
    scheduleTimeoutFn,
    render,
    setTextFromString,
    setImportStatus,
    setExportStatus,
    setCurrentTypeOptions: () => previewWorkflow.setCurrentTypeOptions(),
    renderPreviewFromGrid: () => previewWorkflow.renderTextFromGrid(),
    showError,
  });

  return {
    ...previewWorkflow,
    ...fileTransferWorkflow,
    setTextFromString,
    syncSupportState,
  };
}

export { createImportExportWorkspaceWorkflowService };
