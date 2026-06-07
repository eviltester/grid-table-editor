import { applySanitizedUiOptionsToTargets } from '../../generator/options/options-catalog-adapter.js';
import {
  createFullTextFromGrid,
  createPreviewTextFromGrid,
  normalizePreviewRowLimit,
} from './import-export-workspace-services.js';

function createImportExportPreviewWorkflowService({
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
} = {}) {
  if (!controller) {
    throw new Error('createImportExportPreviewWorkflowService requires a controller');
  }

  const getCurrentState = () => getState?.() || controller.getState();
  const getCurrentType = () => getType?.() || getCurrentState().selectedFormat;
  const getView = () => view?.() || null;
  const getImporter = () => importer?.() || null;
  const getExporter = () => exporter?.() || null;

  const applyOptionsToTargets = (options) => {
    const activeType = getCurrentType();
    applySanitizedUiOptionsToTargets({
      requestedFormat: options?.outputFormat || activeType,
      rawOptions: options?.options || options,
      targets: [getImporter(), getExporter()].filter(Boolean),
      onResolvedFormat: (resolvedFormat) => {
        controller.updateProps({ selectedFormat: resolvedFormat });
      },
    });
    syncSupportState?.();
  };

  const setCurrentTypeOptions = () => {
    const guiOptions = getView()?.getOptionsFromGui?.();
    if (!guiOptions) {
      return;
    }
    applyOptionsToTargets(guiOptions);
  };

  const setOptionsViewForFormatType = () => {
    const type = getCurrentType();
    getView()?.renderOptionsPanel?.({
      selectedFormat: type,
      currentOptions: getExporter()?.getOptionsForType?.(type),
    });
  };

  const renderTextFromGrid = () => {
    const state = getCurrentState();
    const currentExporter = getExporter();
    const type = state.selectedFormat;
    if (!currentExporter?.canExport?.(type)) {
      showError?.(`Data Type ${type} not supported for exporting`);
      return '';
    }

    const text =
      state.mode === 'preview'
        ? createPreviewTextFromGrid({
            exporter: currentExporter,
            type,
            previewRowLimit: state.previewRowLimit,
          })
        : createFullTextFromGrid({ exporter: currentExporter, type });
    setTextFromString?.(text, { previewTextDirty: false });
    return text;
  };

  return {
    applyOptionsToTargets,
    handleFormatChange(format) {
      controller.updateProps({ selectedFormat: format });
      syncSupportState?.();
      setOptionsViewForFormatType();
      renderTextFromGrid();
    },
    handleTextInput() {
      if (getCurrentState().mode === 'preview') {
        controller.markPreviewTextDirty(true);
        render?.();
      }
    },
    maybeAutoPreviewFromGridChange() {
      const state = getCurrentState();
      if (state.mode === 'preview' && state.autoPreviewEnabled) {
        renderTextFromGrid();
      }
    },
    renderTextFromGrid,
    setCurrentTypeOptions,
    setOptionsViewForFormatType,
    async toggleTextEditMode() {
      const state = getCurrentState();
      if (state.mode === 'preview') {
        controller.updateProps({ mode: 'edit', previewTextDirty: false });
        render?.();
        const shouldSetTextFromGrid = await requestConfirm?.({
          title: 'Set Text From Grid',
          message: 'Do you want to Set Text From Grid?',
        });
        if (shouldSetTextFromGrid) {
          renderTextFromGrid();
        } else {
          setTextFromString?.('', { previewTextDirty: false });
        }
        return 'edit';
      }

      controller.updateProps({ mode: 'preview', previewTextDirty: false });
      render?.();
      renderTextFromGrid();
      return 'preview';
    },
    updateAutoPreviewEnabled(enabled) {
      controller.updateProps({ autoPreviewEnabled: enabled });
      render?.();
      if (enabled && getCurrentState().mode === 'preview') {
        renderTextFromGrid();
      }
    },
    updatePreviewRowLimit(previewRowLimit) {
      controller.updateProps({
        previewRowLimit: normalizePreviewRowLimit(previewRowLimit, getCurrentState().previewRowLimit),
      });
      render?.();
    },
  };
}

export { createImportExportPreviewWorkflowService };
