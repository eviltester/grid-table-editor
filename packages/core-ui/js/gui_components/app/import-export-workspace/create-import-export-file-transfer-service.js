import {
  normalizeImportedTextContent,
  previewThenImportToGrid,
  scheduleTimeout,
} from './import-export-workspace-services.js';

function createImportExportFileTransferService({
  controller,
  getState,
  getType,
  view,
  importer,
  exporter,
  fileReadService,
  clipboardService,
  downloadService,
  yieldToUi = async () => {},
  scheduleTimeoutFn = scheduleTimeout,
  render,
  setTextFromString,
  setImportStatus,
  setExportStatus,
  setCurrentTypeOptions,
  renderPreviewFromGrid,
  showError,
} = {}) {
  if (!controller) {
    throw new Error('createImportExportFileTransferService requires a controller');
  }

  const getCurrentState = () => getState?.() || controller.getState();
  const getCurrentType = () => getType?.() || getCurrentState().selectedFormat;
  const getView = () => view?.() || null;
  const getImporter = () => importer?.() || null;
  const getExporter = () => exporter?.() || null;

  const getCurrentImportTrimSettings = () => ({
    trimInput: getCurrentState().trimInput === true,
    trimInputFieldsCsv: getCurrentState().trimInputFieldsEnabled === true ? getCurrentState().trimInputFieldsCsv : '',
  });

  const applyImportTrimSettings = () => {
    getImporter()?.setImportSettings?.(getCurrentImportTrimSettings());
  };

  const importPreviewText = async (text) => {
    await previewThenImportToGrid({
      importer: getImporter(),
      exporter: getExporter(),
      type: getCurrentType(),
      text,
      previewRowLimit: getCurrentState().previewRowLimit,
      setPreviewText: (previewText) => setTextFromString?.(previewText, { previewTextDirty: false }),
      setImportStatus,
      yieldToUi,
    });
    controller.markPreviewTextDirty(false);
    render?.();
    return true;
  };

  async function importTextContent(text, { sourceLabel = 'import text' } = {}) {
    const normalizedText = normalizeImportedTextContent(text);
    const currentImporter = getImporter();
    applyImportTrimSettings();

    setImportStatus?.(
      getCurrentState().mode === 'preview'
        ? `Preparing preview from ${sourceLabel}...`
        : `Importing ${sourceLabel} into grid...`,
      true
    );
    await yieldToUi();

    if (getCurrentState().mode === 'preview') {
      await importPreviewText(normalizedText);
      return true;
    }

    setTextFromString?.(normalizedText, { previewTextDirty: false });
    setImportStatus?.(`Importing ${sourceLabel} into grid...`, true);
    await yieldToUi();
    await Promise.resolve(currentImporter?.importText?.(getCurrentType(), normalizedText));
    setImportStatus?.('Import complete.', false);
    return true;
  }

  function copyText({ textArea, button } = {}) {
    clipboardService?.copyFromTextArea?.(textArea || getView()?.getTextArea?.());
    getView()?.setCopyButtonText?.('Copied');
    scheduleTimeoutFn(() => {
      if (!button || button.isConnected) {
        getView()?.setCopyButtonText?.('Copy');
      }
    }, 3000);
  }

  async function fileDownload() {
    const currentExporter = getExporter();
    const type = getCurrentType();
    controller.setBusyState({ exportBusy: true });
    setExportStatus?.('Preparing download...', true);

    try {
      await yieldToUi();
      if (!currentExporter?.canExport?.(type)) {
        setExportStatus?.('Export not available for this format.', false);
        return;
      }

      const filename = `export${currentExporter.getFileExtensionFor(type)}`;
      setExportStatus?.('Generating export text...', true);
      const text =
        typeof currentExporter.getGridAsAsync === 'function'
          ? await currentExporter.getGridAsAsync(type, (message) => {
              if (message) {
                setExportStatus?.(message, true);
              }
            })
          : currentExporter.getGridAs(type);

      setExportStatus?.('Starting download...', true);
      await yieldToUi();
      downloadService?.downloadText?.(filename, text, {
        exportEncodingSettings: getCurrentState().exportEncodingSettings,
      });
      setExportStatus?.('Download started.', false);
    } catch (error) {
      console.error('Failed exporting download', error);
      setExportStatus?.('Download failed. Please try again.', false);
    } finally {
      controller.setBusyState({ exportBusy: false });
      render?.();
      scheduleTimeoutFn(() => setExportStatus?.('', false), 1200);
    }
  }

  async function importTextArea() {
    const state = getCurrentState();
    const currentImporter = getImporter();
    const type = state.selectedFormat;
    const text = getView()?.getTextValue?.() || '';

    if (!currentImporter?.canImport?.(type)) {
      showError?.(`Data Type ${type} not supported for importing`);
      return undefined;
    }

    setCurrentTypeOptions?.();
    applyImportTrimSettings();

    if (state.mode === 'preview') {
      if (!state.previewTextDirty) {
        showError?.('Grid to Text only available in Edit mode');
        return undefined;
      }
      try {
        return await importPreviewText(text);
      } catch (error) {
        console.error('Failed importing preview text', error);
        setImportStatus?.('Import failed. Check file format/options.', false);
        return undefined;
      }
    }

    controller.setBusyState({ importBusy: true });
    setImportStatus?.('Importing full data into grid...', true);
    render?.();
    await yieldToUi();

    try {
      await Promise.resolve(currentImporter.importText(type, text));
      setImportStatus?.('Import complete.', false);
      render?.();
      return true;
    } catch (error) {
      console.error('Failed importing text', error);
      setImportStatus?.('Import failed. Check file format/options.', false);
      return undefined;
    } finally {
      controller.setBusyState({ importBusy: false });
      render?.();
    }
  }

  function loadFile(file) {
    setCurrentTypeOptions?.();
    setImportStatus?.('Preparing file import...', true);
    return readFile(file);
  }

  async function importFromClipboard() {
    const state = getCurrentState();
    const currentImporter = getImporter();
    const type = state.selectedFormat;

    if (!currentImporter?.canImport?.(type)) {
      showError?.(`Data Type ${type} not supported for importing`);
      return undefined;
    }

    if (typeof clipboardService?.readText !== 'function') {
      showError?.('Clipboard import is not available in this browser.');
      return undefined;
    }

    setCurrentTypeOptions?.();
    applyImportTrimSettings();
    controller.setBusyState({ importBusy: true });
    setImportStatus?.('Reading clipboard text...', true);
    render?.();

    try {
      await yieldToUi();
      const importedText = normalizeImportedTextContent(await clipboardService.readText());
      setTextFromString?.(importedText, { previewTextDirty: false });
      setImportStatus?.('Importing clipboard text into grid...', true);
      await yieldToUi();
      await Promise.resolve(currentImporter.importText(type, importedText));
      if (getCurrentState().mode === 'preview') {
        await Promise.resolve(renderPreviewFromGrid?.());
      }
      setImportStatus?.('Import complete.', false);
      render?.();
      return true;
    } catch (error) {
      console.error('Failed importing clipboard text', error);
      setImportStatus?.('Clipboard import failed. Check clipboard contents and format/options.', false);
      return undefined;
    } finally {
      controller.setBusyState({ importBusy: false });
      render?.();
    }
  }

  async function readFile(file) {
    if (!file) {
      controller.setBusyState({ importBusy: false });
      setImportStatus?.('', false);
      return;
    }

    controller.setBusyState({ importBusy: true });
    setImportStatus?.(`Loading ${file.name}... 0%`, true);

    try {
      const importedText = await fileReadService.readText(file, {
        onProgress: (event) => {
          if (event.lengthComputable) {
            const pct = Math.min(100, Math.round((event.loaded / event.total) * 100));
            setImportStatus?.(`Loading ${file.name}... ${pct}%`, true);
            return;
          }
          setImportStatus?.(`Loading ${file.name}...`, true);
        },
        onError: () => {
          setImportStatus?.('File read failed.', false);
          controller.setBusyState({ importBusy: false });
          render?.();
        },
        onAbort: () => {
          setImportStatus?.('File read cancelled.', false);
          controller.setBusyState({ importBusy: false });
          render?.();
        },
      });

      await importTextContent(importedText, { sourceLabel: 'file' });
    } catch (error) {
      if (error?.type !== 'abort' && error?.type !== 'error') {
        console.error('Failed importing file', error);
        setImportStatus?.('Import failed. Check file format/options.', false);
      }
    } finally {
      controller.setBusyState({ importBusy: false });
      render?.();
      scheduleTimeoutFn(() => setImportStatus?.('', false), 1200);
    }
  }

  return {
    copyText,
    fileDownload,
    importTextArea,
    importFromClipboard,
    loadFile,
    readFile,
  };
}

export { createImportExportFileTransferService };
