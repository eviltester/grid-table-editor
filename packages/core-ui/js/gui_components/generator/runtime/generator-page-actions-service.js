import {
  buildPreviewDataTable,
  buildPairwiseDataTable,
  buildCombinationsDataTable,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
  generateGeneratorCombinationsDataFile,
} from '../generation/data-generator-generation-actions.js';
import { createCombinationsDialogComponent } from '../../shared/combinations-dialog/index.js';
import { applyGeneratorFormatOptions } from '../options/apply-generator-format-options.js';
import { createConfirmDialogService } from '../../shared/dialog-services/confirm-dialog-service.js';

function createGeneratorPageActionsService({
  runtime,
  DownloadClass,
  faker,
  RandExp,
  createCombinationsDialog = createCombinationsDialogComponent,
} = {}) {
  const confirmDialogService = createConfirmDialogService({ documentObj: runtime?.documentObj });
  const getResolvedViewState = () => runtime?.generatorViewState || null;
  const getResolvedSchemaRuntime = () => runtime?.generatorSchemaRuntime || null;
  const getResolvedSchemaGenerationService = () => runtime?.generatorSchemaGenerationService || null;
  const getResolvedSchemaState = () => runtime?.generatorSchemaState || null;
  let combinationsDialog = null;

  function ensureCombinationsDialog(actions) {
    if (combinationsDialog) {
      return combinationsDialog;
    }
    combinationsDialog = createCombinationsDialog({
      documentObj: runtime?.documentObj,
      callbacks: {
        onSubmit: (selection) => {
          void actions.generateCombinationsDataFile(selection);
        },
      },
    });
    return combinationsDialog;
  }

  const actions = {
    applyCurrentTypeOptions(options) {
      return applyGeneratorFormatOptions({
        options,
        currentSelectedType: getResolvedViewState()?.getSelectedOutputType?.(),
        exporter: runtime?.exporter,
        syncFormatStateIfChanged: (nextFormat, previousFormat) =>
          getResolvedViewState()?.syncGeneratorControlsFormatStateIfChanged?.(nextFormat, previousFormat),
        renderOutputPreviewForCurrentSelection: () =>
          getResolvedViewState()?.renderOutputPreviewForCurrentSelection?.(),
        setGenerationStatus: (message) => getResolvedViewState()?.setGenerationStatus?.(message),
        scheduleClearGenerationStatus: () => getResolvedViewState()?.scheduleClearGenerationStatus?.(),
      });
    },

    previewData() {
      return previewGeneratorData({
        getPreviewRowCount: () => getResolvedViewState()?.getPreviewRowCount?.(),
        createConfiguredGenerator: () => getResolvedSchemaGenerationService()?.createConfiguredGenerator?.(),
        buildDataTable: (generator, rowCount) => buildPreviewDataTable({ generator, rowCount }),
        setPreviewDataTable: (dataTable) => getResolvedViewState()?.setPreviewDataTable?.(dataTable),
        renderOutputPreviewForCurrentSelection: () =>
          getResolvedViewState()?.renderOutputPreviewForCurrentSelection?.(),
        surfacePageError: (message, options) => getResolvedSchemaRuntime()?.surfacePageError?.(message, options),
        clearPageError: () => getResolvedSchemaRuntime()?.clearSchemaErrorStatus?.(),
        recordLastUsedSchema: () => runtime?.generatorPage?.recordCurrentSchemaAsLastUsed?.(),
      });
    },

    async generateDataFile() {
      await generateGeneratorDataFile({
        getGenerateRowCount: () => getResolvedViewState()?.getGenerateRowCount?.(),
        createConfiguredGenerator: () => getResolvedSchemaGenerationService()?.createConfiguredGenerator?.(),
        getSelectedOutputType: () => getResolvedViewState()?.getSelectedOutputType?.(),
        exporter: runtime?.exporter,
        clearGenerationStatus: () => getResolvedViewState()?.clearGenerationStatus?.(),
        setGenerationButtonBusy: (isBusy) => getResolvedViewState()?.setGenerationButtonsBusy?.(isBusy),
        setGenerationStatus: (message, options) => getResolvedViewState()?.setGenerationStatus?.(message, options),
        showGenerationLoadingStatus: (message) => getResolvedViewState()?.showGenerationLoadingStatus?.(message),
        getExportEncodingSettings: () => getResolvedViewState()?.getExportEncodingSettings?.(),
        buildDataTable: (generator, rowCount) => buildPreviewDataTable({ generator, rowCount }),
        DownloadClass,
        surfacePageError: (message, options) => getResolvedSchemaRuntime()?.surfacePageError?.(message, options),
        clearPageError: () => getResolvedSchemaRuntime()?.clearSchemaErrorStatus?.(),
        scheduleClearGenerationStatus: (delay) => getResolvedViewState()?.scheduleClearGenerationStatus?.(delay),
        recordLastUsedSchema: () => runtime?.generatorPage?.recordCurrentSchemaAsLastUsed?.(),
      });
    },

    async generateAllPairsDataFile() {
      await generateGeneratorAllPairsDataFile({
        createConfiguredGenerator: () => getResolvedSchemaGenerationService()?.createConfiguredGenerator?.(),
        countEnumColumns: () => getResolvedSchemaGenerationService()?.countEnumColumns?.() || 0,
        getSelectedOutputType: () => getResolvedViewState()?.getSelectedOutputType?.(),
        exporter: runtime?.exporter,
        clearGenerationStatus: () => getResolvedViewState()?.clearGenerationStatus?.(),
        setGenerationButtonBusy: (isBusy) => getResolvedViewState()?.setGenerationButtonsBusy?.(isBusy),
        setGenerationStatus: (message, options) => getResolvedViewState()?.setGenerationStatus?.(message, options),
        showGenerationLoadingStatus: (message) => getResolvedViewState()?.showGenerationLoadingStatus?.(message),
        getExportEncodingSettings: () => getResolvedViewState()?.getExportEncodingSettings?.(),
        buildAllPairsDataTable: (generator) =>
          buildPairwiseDataTable({
            generator,
            faker,
            RandExp,
          }),
        DownloadClass,
        surfacePageError: (message, options) => getResolvedSchemaRuntime()?.surfacePageError?.(message, options),
        clearPageError: () => getResolvedSchemaRuntime()?.clearSchemaErrorStatus?.(),
        scheduleClearGenerationStatus: (delay) => getResolvedViewState()?.scheduleClearGenerationStatus?.(delay),
        recordLastUsedSchema: () => runtime?.generatorPage?.recordCurrentSchemaAsLastUsed?.(),
      });
    },

    openGenerateCombinationsDialog() {
      const enumColumnCount = getResolvedSchemaGenerationService()?.countEnumColumns?.() || 0;
      const enumValueCounts = getResolvedSchemaGenerationService()?.getEnumValueCounts?.() || [];
      if (enumColumnCount < 2) {
        getResolvedSchemaRuntime()?.surfacePageError?.(
          'Combination generation requires at least 2 enum columns because n-wise generation combines finite enum values.'
        );
        return false;
      }
      ensureCombinationsDialog(actions).open({ enumColumnCount, enumValueCounts });
      return true;
    },

    async generateCombinationsDataFile(selection) {
      await generateGeneratorCombinationsDataFile({
        createConfiguredGenerator: () => getResolvedSchemaGenerationService()?.createConfiguredGenerator?.(),
        countEnumColumns: () => getResolvedSchemaGenerationService()?.countEnumColumns?.() || 0,
        getEnumValueCounts: () => getResolvedSchemaGenerationService()?.getEnumValueCounts?.() || [],
        getSelectedOutputType: () => getResolvedViewState()?.getSelectedOutputType?.(),
        exporter: runtime?.exporter,
        clearGenerationStatus: () => getResolvedViewState()?.clearGenerationStatus?.(),
        setGenerationButtonBusy: (isBusy) => getResolvedViewState()?.setGenerationButtonsBusy?.(isBusy),
        setGenerationStatus: (message, options) => getResolvedViewState()?.setGenerationStatus?.(message, options),
        showGenerationLoadingStatus: (message) => getResolvedViewState()?.showGenerationLoadingStatus?.(message),
        buildCombinationsDataTable: (generator, options) =>
          buildCombinationsDataTable({
            generator,
            faker,
            RandExp,
            options,
          }),
        DownloadClass,
        surfacePageError: (message, options) => getResolvedSchemaRuntime()?.surfacePageError?.(message, options),
        clearPageError: () => getResolvedSchemaRuntime()?.clearSchemaErrorStatus?.(),
        scheduleClearGenerationStatus: (delay) => getResolvedViewState()?.scheduleClearGenerationStatus?.(delay),
        selection,
        requestConfirm: confirmDialogService.requestConfirm,
        recordLastUsedSchema: () => runtime?.generatorPage?.recordCurrentSchemaAsLastUsed?.(),
      });
    },

    updateAllPairsButtonVisibility() {
      const isVisible = getResolvedSchemaGenerationService()?.getPairwiseVisibility?.({
        getCurrentSchemaState: () => getResolvedSchemaState()?.getCurrentSchemaState?.(),
      });
      getResolvedViewState()?.setPairwiseVisible?.(isVisible);
      return isVisible;
    },
  };

  return actions;
}

export { createGeneratorPageActionsService };
