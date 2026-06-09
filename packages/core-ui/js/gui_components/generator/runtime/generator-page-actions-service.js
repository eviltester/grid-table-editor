import {
  buildPreviewDataTable,
  buildPairwiseDataTable,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
} from '../generation/data-generator-generation-actions.js';
import { applyGeneratorFormatOptions } from '../options/apply-generator-format-options.js';

function createGeneratorPageActionsService({ runtime, DownloadClass, faker, RandExp } = {}) {
  const getResolvedViewState = () => runtime?.generatorViewState || null;
  const getResolvedSchemaRuntime = () => runtime?.generatorSchemaRuntime || null;
  const getResolvedSchemaGenerationService = () => runtime?.generatorSchemaGenerationService || null;
  const getResolvedSchemaState = () => runtime?.generatorSchemaState || null;

  return {
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
}

export { createGeneratorPageActionsService };
