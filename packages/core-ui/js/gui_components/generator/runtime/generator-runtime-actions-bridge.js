import {
  buildPreviewDataTable,
  buildPairwiseDataTable,
  previewGeneratorData,
  generateGeneratorDataFile,
  generateGeneratorAllPairsDataFile,
} from '../generation/index.js';
import { applyGeneratorFormatOptions } from '../options/index.js';

function createGeneratorRuntimeActionsBridge({
  getCurrentSelectedType,
  getExporter,
  getDownloadClass,
  getFaker,
  getRandExp,
  getViewState,
  getSchemaRuntime,
  getSchemaGeneration,
} = {}) {
  const getResolvedViewState = () => getViewState?.() || null;
  const getResolvedSchemaRuntime = () => getSchemaRuntime?.() || null;
  const getResolvedSchemaGeneration = () => getSchemaGeneration?.() || null;

  return {
    applyCurrentTypeOptions(options) {
      return applyGeneratorFormatOptions({
        options,
        currentSelectedType: getCurrentSelectedType?.(),
        exporter: getExporter?.(),
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
        createConfiguredGenerator: () => getResolvedSchemaGeneration()?.createConfiguredGenerator?.(),
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
        createConfiguredGenerator: () => getResolvedSchemaGeneration()?.createConfiguredGenerator?.(),
        getSelectedOutputType: () => getCurrentSelectedType?.(),
        exporter: getExporter?.(),
        clearGenerationStatus: () => getResolvedViewState()?.clearGenerationStatus?.(),
        setGenerationButtonBusy: (isBusy) => getResolvedViewState()?.setGenerationButtonsBusy?.(isBusy),
        setGenerationStatus: (message, options) => getResolvedViewState()?.setGenerationStatus?.(message, options),
        showGenerationLoadingStatus: (message) => getResolvedViewState()?.showGenerationLoadingStatus?.(message),
        buildDataTable: (generator, rowCount) => buildPreviewDataTable({ generator, rowCount }),
        DownloadClass: getDownloadClass?.(),
        surfacePageError: (message, options) => getResolvedSchemaRuntime()?.surfacePageError?.(message, options),
        clearPageError: () => getResolvedSchemaRuntime()?.clearSchemaErrorStatus?.(),
        scheduleClearGenerationStatus: (delay) => getResolvedViewState()?.scheduleClearGenerationStatus?.(delay),
      });
    },

    async generateAllPairsDataFile() {
      await generateGeneratorAllPairsDataFile({
        createConfiguredGenerator: () => getResolvedSchemaGeneration()?.createConfiguredGenerator?.(),
        countEnumColumns: () => getResolvedSchemaGeneration()?.countEnumColumns?.() || 0,
        getSelectedOutputType: () => getCurrentSelectedType?.(),
        exporter: getExporter?.(),
        clearGenerationStatus: () => getResolvedViewState()?.clearGenerationStatus?.(),
        setGenerationButtonBusy: (isBusy) => getResolvedViewState()?.setGenerationButtonsBusy?.(isBusy),
        setGenerationStatus: (message, options) => getResolvedViewState()?.setGenerationStatus?.(message, options),
        showGenerationLoadingStatus: (message) => getResolvedViewState()?.showGenerationLoadingStatus?.(message),
        buildAllPairsDataTable: (generator) =>
          buildPairwiseDataTable({
            generator,
            faker: getFaker?.(),
            RandExp: getRandExp?.(),
          }),
        DownloadClass: getDownloadClass?.(),
        surfacePageError: (message, options) => getResolvedSchemaRuntime()?.surfacePageError?.(message, options),
        clearPageError: () => getResolvedSchemaRuntime()?.clearSchemaErrorStatus?.(),
        scheduleClearGenerationStatus: (delay) => getResolvedViewState()?.scheduleClearGenerationStatus?.(delay),
      });
    },

    updateAllPairsButtonVisibility({ getCurrentSchemaState } = {}) {
      const isVisible = getResolvedSchemaGeneration()?.getPairwiseVisibility?.({
        getCurrentSchemaState,
      });
      getResolvedViewState()?.setPairwiseVisible?.(isVisible);
      return isVisible;
    },
  };
}

export { createGeneratorRuntimeActionsBridge };
