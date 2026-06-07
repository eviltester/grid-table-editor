import { applySanitizedUiOptionsToTargets } from '../../generator/options/options-catalog-adapter.js';
import {
  createFullTextFromGrid,
  createPreviewTextFromGrid,
  normalizePreviewRowLimit,
  previewThenImportToGrid,
  scheduleTimeout,
} from './import-export-workspace-services.js';

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
    const fileExtension =
      currentImporter?.getFileExtensionFor?.(type) ||
      currentExporter?.getFileExtensionFor?.(type) ||
      `.${type || 'csv'}`;
    controller.setSupportState({ supportsImport, supportsExport, fileExtension });
    render();
  };

  const applyOptionsToTargets = (options) => {
    const activeType = getType();
    applySanitizedUiOptionsToTargets({
      requestedFormat: options?.outputFormat || activeType,
      rawOptions: options?.options || options,
      targets: [importer(), exporter()].filter(Boolean),
      onResolvedFormat: (resolvedFormat) => {
        controller.updateProps({ selectedFormat: resolvedFormat });
      },
    });
    syncSupportState();
  };

  const setCurrentTypeOptions = () => {
    const guiOptions = view()?.getOptionsFromGui?.();
    if (!guiOptions) {
      return;
    }
    applyOptionsToTargets(guiOptions);
  };

  const setOptionsViewForFormatType = () => {
    const type = getType();
    view()?.renderOptionsPanel?.({
      selectedFormat: type,
      currentOptions: exporter()?.getOptionsForType?.(type),
    });
  };

  const renderTextFromGrid = () => {
    const state = getState();
    const currentExporter = exporter();
    const type = state.selectedFormat;
    if (!currentExporter?.canExport?.(type)) {
      showError(`Data Type ${type} not supported for exporting`);
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
    setTextFromString(text, { previewTextDirty: false });
    return text;
  };

  const maybeAutoPreviewFromGridChange = () => {
    const state = getState();
    if (state.mode === 'preview' && state.autoPreviewEnabled) {
      renderTextFromGrid();
    }
  };

  const importTextArea = async () => {
    const state = getState();
    const currentImporter = importer();
    const currentExporter = exporter();
    const type = state.selectedFormat;
    const text = view()?.getTextValue?.() || '';

    if (!currentImporter?.canImport?.(type)) {
      showError(`Data Type ${type} not supported for importing`);
      return undefined;
    }

    setCurrentTypeOptions();

    if (state.mode === 'preview') {
      if (!state.previewTextDirty) {
        showError('Grid to Text only available in Edit mode');
        return undefined;
      }
      try {
        await previewThenImportToGrid({
          importer: currentImporter,
          exporter: currentExporter,
          type,
          text,
          previewRowLimit: state.previewRowLimit,
          setPreviewText: (previewText) => setTextFromString(previewText, { previewTextDirty: false }),
          setImportStatus,
          yieldToUi,
        });
        controller.markPreviewTextDirty(false);
        render();
        return true;
      } catch (error) {
        console.error('Failed importing preview text', error);
        setImportStatus('Import failed. Check file format/options.', false);
        return undefined;
      }
    }

    controller.setBusyState({ importBusy: true });
    setImportStatus('Importing full data into grid...', true);
    render();
    await yieldToUi();

    try {
      await Promise.resolve(currentImporter.importText(type, text));
      setImportStatus('Import complete.', false);
      render();
      return true;
    } catch (error) {
      console.error('Failed importing text', error);
      setImportStatus('Import failed. Check file format/options.', false);
      return undefined;
    } finally {
      controller.setBusyState({ importBusy: false });
      render();
    }
  };

  const readFile = async (file) => {
    if (!file) {
      controller.setBusyState({ importBusy: false });
      setImportStatus('', false);
      return;
    }

    const currentImporter = importer();
    const currentExporter = exporter();
    controller.setBusyState({ importBusy: true });
    setImportStatus(`Loading ${file.name}... 0%`, true);

    try {
      const importedText = await fileReadService.readText(file, {
        onProgress: (event) => {
          if (event.lengthComputable) {
            const pct = Math.min(100, Math.round((event.loaded / event.total) * 100));
            setImportStatus(`Loading ${file.name}... ${pct}%`, true);
            return;
          }
          setImportStatus(`Loading ${file.name}...`, true);
        },
        onError: () => {
          setImportStatus('File read failed.', false);
          controller.setBusyState({ importBusy: false });
          render();
        },
        onAbort: () => {
          setImportStatus('File read cancelled.', false);
          controller.setBusyState({ importBusy: false });
          render();
        },
      });

      setImportStatus(getState().mode === 'preview' ? 'Preparing preview...' : 'Importing into grid...', true);
      await yieldToUi();
      const type = getType();
      if (getState().mode === 'preview') {
        await previewThenImportToGrid({
          importer: currentImporter,
          exporter: currentExporter,
          type,
          text: importedText,
          previewRowLimit: getState().previewRowLimit,
          setPreviewText: (previewText) => setTextFromString(previewText, { previewTextDirty: false }),
          setImportStatus,
          yieldToUi,
        });
      } else {
        setTextFromString(importedText, { previewTextDirty: false });
        setImportStatus('Importing full data into grid...', true);
        await yieldToUi();
        await Promise.resolve(currentImporter?.importText?.(type, importedText));
        setImportStatus('Import complete.', false);
      }
    } catch (error) {
      if (error?.type !== 'abort' && error?.type !== 'error') {
        console.error('Failed importing file', error);
        setImportStatus('Import failed. Check file format/options.', false);
      }
    } finally {
      controller.setBusyState({ importBusy: false });
      render();
      scheduleTimeoutFn(() => setImportStatus('', false), 1200);
    }
  };

  const loadFile = (file) => {
    setCurrentTypeOptions();
    setImportStatus('Preparing file import...', true);
    return readFile(file);
  };

  const fileDownload = async () => {
    const currentExporter = exporter();
    const type = getType();
    controller.setBusyState({ exportBusy: true });
    setExportStatus('Preparing download...', true);

    try {
      await yieldToUi();
      if (!currentExporter?.canExport?.(type)) {
        setExportStatus('Export not available for this format.', false);
        return;
      }

      const filename = `export${currentExporter.getFileExtensionFor(type)}`;
      setExportStatus('Generating export text...', true);
      const text =
        typeof currentExporter.getGridAsAsync === 'function'
          ? await currentExporter.getGridAsAsync(type, (message) => {
              if (message) {
                setExportStatus(message, true);
              }
            })
          : currentExporter.getGridAs(type);

      setExportStatus('Starting download...', true);
      await yieldToUi();
      downloadService?.downloadText?.(filename, text);
      setExportStatus('Download started.', false);
    } catch (error) {
      console.error('Failed exporting download', error);
      setExportStatus('Download failed. Please try again.', false);
    } finally {
      controller.setBusyState({ exportBusy: false });
      render();
      scheduleTimeoutFn(() => setExportStatus('', false), 1200);
    }
  };

  const copyText = ({ textArea, button } = {}) => {
    clipboardService?.copyFromTextArea?.(textArea || view()?.getTextArea?.());
    view()?.setCopyButtonText?.('Copied');
    scheduleTimeoutFn(() => {
      if (!button || button.isConnected) {
        view()?.setCopyButtonText?.('Copy');
      }
    }, 3000);
  };

  const toggleTextEditMode = async () => {
    const state = getState();
    if (state.mode === 'preview') {
      controller.updateProps({ mode: 'edit', previewTextDirty: false });
      render();
      const shouldSetTextFromGrid = await requestConfirm?.({
        title: 'Set Text From Grid',
        message: 'Do you want to Set Text From Grid?',
      });
      if (shouldSetTextFromGrid) {
        renderTextFromGrid();
      } else {
        setTextFromString('', { previewTextDirty: false });
      }
      return 'edit';
    }

    controller.updateProps({ mode: 'preview', previewTextDirty: false });
    render();
    renderTextFromGrid();
    return 'preview';
  };

  const handleFormatChange = (format) => {
    controller.updateProps({ selectedFormat: format });
    syncSupportState();
    setOptionsViewForFormatType();
    renderTextFromGrid();
  };

  return {
    applyOptionsToTargets,
    copyText,
    fileDownload,
    handleFormatChange,
    handleTextInput() {
      if (getState().mode === 'preview') {
        controller.markPreviewTextDirty(true);
        render();
      }
    },
    importTextArea,
    loadFile,
    maybeAutoPreviewFromGridChange,
    readFile,
    renderTextFromGrid,
    setCurrentTypeOptions,
    setOptionsViewForFormatType,
    setTextFromString,
    syncSupportState,
    toggleTextEditMode,
    updateAutoPreviewEnabled(enabled) {
      controller.updateProps({ autoPreviewEnabled: enabled });
      render();
      if (enabled && getState().mode === 'preview') {
        renderTextFromGrid();
      }
    },
    updatePreviewRowLimit(previewRowLimit) {
      controller.updateProps({
        previewRowLimit: normalizePreviewRowLimit(previewRowLimit, getState().previewRowLimit),
      });
      render();
    },
  };
}

export { createImportExportWorkspaceWorkflowService };
