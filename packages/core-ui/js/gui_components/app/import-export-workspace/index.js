import { applySanitizedUiOptionsToTargets } from '../../generator/options/index.js';
import { createConfirmDialogService } from '../../shared/dialog-services/index.js';
import { resolveDocumentObj, resolveWindowObj } from '../../shared/dom/default-objects.js';
import { createFormatOptionsPanel } from '../../shared/format-options-panel/index.js';
import { createFormatSelectorComponent } from '../format-selector/index.js';
import { createFileImportBindingsAdapter, createFileReadService } from '../import-export-adapters/index.js';
import { createImportExportToolbarComponent } from '../import-export-toolbar/index.js';
import { createTextPreviewEditorComponent } from '../text-preview-editor/index.js';
import { ImportExportWorkspaceController } from './import-export-workspace-controller.js';
import {
  createClipboardService,
  createDownloadService,
  createFullTextFromGrid,
  createPreviewTextFromGrid,
  createYieldToUi,
  normalizePreviewRowLimit,
  previewThenImportToGrid,
  scheduleTimeout,
} from './import-export-workspace-services.js';
import { ImportExportWorkspaceView } from './import-export-workspace-view.js';

function createImportExportWorkspaceComponent({ root, props = {}, services = {}, documentObj, windowObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const resolvedWindowObj = resolveWindowObj(windowObj, resolvedDocumentObj);
  const controller = new ImportExportWorkspaceController({ props });
  const confirmDialogService = createConfirmDialogService({ documentObj: resolvedDocumentObj });
  const requestConfirm =
    typeof services.requestConfirm === 'function' ? services.requestConfirm : confirmDialogService.requestConfirm;
  const clipboardService = services.clipboardService || createClipboardService({ documentObj: resolvedDocumentObj });
  const downloadService = services.downloadService || createDownloadService();
  const fileReadService = services.fileReadService || createFileReadService();
  const scheduleTimeoutFn = services.scheduleTimeoutFn || scheduleTimeout;
  const yieldToUi =
    services.yieldToUi || createYieldToUi({ documentObj: resolvedDocumentObj, windowObj: resolvedWindowObj });
  let importer = services.importer || null;
  let exporter = services.exporter || null;
  let gridChangeUnsubscribe = null;

  const getType = () => controller.getState().selectedFormat;
  const getState = () => controller.getState();

  const render = () => {
    view?.render?.();
  };

  const setTextFromString = (value, { previewTextDirty = false } = {}) => {
    view?.setTextValue?.(value || '');
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
    const supportsImport = typeof importer?.canImport === 'function' ? importer.canImport(type) : true;
    const supportsExport = typeof exporter?.canExport === 'function' ? exporter.canExport(type) : true;
    const fileExtension =
      importer?.getFileExtensionFor?.(type) || exporter?.getFileExtensionFor?.(type) || `.${type || 'csv'}`;
    controller.setSupportState({ supportsImport, supportsExport, fileExtension });
    render();
  };

  const applyOptionsToTargets = (options) => {
    const activeType = getType();
    applySanitizedUiOptionsToTargets({
      requestedFormat: options?.outputFormat || activeType,
      rawOptions: options?.options || options,
      targets: [importer, exporter].filter(Boolean),
      onResolvedFormat: (resolvedFormat) => {
        controller.updateProps({ selectedFormat: resolvedFormat });
      },
    });
    syncSupportState();
  };

  const setCurrentTypeOptions = () => {
    const guiOptions = view?.getOptionsFromGui?.();
    if (!guiOptions) {
      return;
    }
    applyOptionsToTargets(guiOptions);
  };

  const setOptionsViewForFormatType = () => {
    const type = getType();
    view?.renderOptionsPanel?.({
      selectedFormat: type,
      currentOptions: exporter?.getOptionsForType?.(type),
    });
  };

  const renderTextFromGrid = () => {
    const state = getState();
    const type = state.selectedFormat;
    if (!exporter?.canExport?.(type)) {
      showError(`Data Type ${type} not supported for exporting`);
      return '';
    }

    const text =
      state.mode === 'preview'
        ? createPreviewTextFromGrid({ exporter, type, previewRowLimit: state.previewRowLimit })
        : createFullTextFromGrid({ exporter, type });
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
    const type = state.selectedFormat;
    const text = view?.getTextValue?.() || '';

    if (!importer?.canImport?.(type)) {
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
          importer,
          exporter,
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

    await Promise.resolve(importer.importText(type, text));
    return true;
  };

  const readFile = async (file) => {
    if (!file) {
      controller.setBusyState({ importBusy: false });
      setImportStatus('', false);
      return;
    }

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
          importer,
          exporter,
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
        await Promise.resolve(importer?.importText?.(type, importedText));
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
    const type = getType();
    controller.setBusyState({ exportBusy: true });
    setExportStatus('Preparing download...', true);

    try {
      await yieldToUi();
      if (!exporter?.canExport?.(type)) {
        setExportStatus('Export not available for this format.', false);
        return;
      }

      const filename = `export${exporter.getFileExtensionFor(type)}`;
      setExportStatus('Generating export text...', true);
      const text =
        typeof exporter.getGridAsAsync === 'function'
          ? await exporter.getGridAsAsync(type, (message) => {
              if (message) {
                setExportStatus(message, true);
              }
            })
          : exporter.getGridAs(type);

      setExportStatus('Starting download...', true);
      await yieldToUi();
      downloadService.downloadText(filename, text);
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
    clipboardService.copyFromTextArea(textArea || view?.getTextArea?.());
    view?.setCopyButtonText?.('Copied');
    scheduleTimeoutFn(() => {
      if (!button || button.isConnected) {
        view?.setCopyButtonText?.('Copy');
      }
    }, 3000);
  };

  const toggleTextEditMode = async () => {
    const state = getState();
    if (state.mode === 'preview') {
      controller.updateProps({ mode: 'edit', previewTextDirty: false });
      render();
      const shouldSetTextFromGrid = await requestConfirm({
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

  const view = new ImportExportWorkspaceView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createImportExportToolbarComponent:
        services.createImportExportToolbarComponent || createImportExportToolbarComponent,
      createTextPreviewEditorComponent: services.createTextPreviewEditorComponent || createTextPreviewEditorComponent,
      createFormatSelectorComponent: services.createFormatSelectorComponent || createFormatSelectorComponent,
      createFileImportBindingsAdapter: services.createFileImportBindingsAdapter || createFileImportBindingsAdapter,
      createFormatOptionsPanel: services.createFormatOptionsPanel || createFormatOptionsPanel,
      onFormatChange: handleFormatChange,
      onToggleMode: toggleTextEditMode,
      onAutoPreviewChange: (enabled) => {
        controller.updateProps({ autoPreviewEnabled: enabled });
        render();
        if (enabled && getState().mode === 'preview') {
          renderTextFromGrid();
        }
      },
      onPreviewRowLimitChange: (previewRowLimit) => {
        controller.updateProps({
          previewRowLimit: normalizePreviewRowLimit(previewRowLimit, getState().previewRowLimit),
        });
        render();
      },
      onTextInput: () => {
        if (getState().mode === 'preview') {
          controller.markPreviewTextDirty(true);
          render();
        }
      },
      onCopyText: copyText,
      onSetTextFromGrid: renderTextFromGrid,
      onSetGridFromText: importTextArea,
      onDownload: fileDownload,
      onFileSelected: loadFile,
      onApplyOptions: ({ sanitized }) => {
        applyOptionsToTargets(sanitized);
        setOptionsViewForFormatType();
        renderTextFromGrid();
      },
    },
  });

  view.mount();
  syncSupportState();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      syncSupportState();
      setOptionsViewForFormatType();
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
      syncSupportState();
    },
    setImporter(nextImporter) {
      importer = nextImporter;
      syncSupportState();
    },
    setGridChangeSource(gridChangeSource) {
      if (typeof gridChangeUnsubscribe === 'function') {
        gridChangeUnsubscribe();
        gridChangeUnsubscribe = null;
      }
      if (typeof gridChangeSource?.onGridChanged === 'function') {
        gridChangeUnsubscribe = gridChangeSource.onGridChanged(maybeAutoPreviewFromGridChange);
      }
    },
    renderTextFromGrid,
    setFileFormatType: syncSupportState,
    setOptionsViewForFormatType,
    setCurrentTypeOptions,
    applyCurrentTypeOptions(options) {
      applyOptionsToTargets(options);
      setOptionsViewForFormatType();
      return renderTextFromGrid();
    },
    importTextArea,
    loadFile,
    readFile,
    fileDownload,
    copyText,
    toggleTextEditMode,
    getPreviewRowLimit() {
      return getState().previewRowLimit;
    },
    isPreviewTextMode() {
      return getState().mode === 'preview';
    },
    getTextValue() {
      return view.getTextValue();
    },
    setTextFromString,
  };
}

export { createImportExportWorkspaceComponent, ImportExportWorkspaceController, ImportExportWorkspaceView };
