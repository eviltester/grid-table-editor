import { assertGeneratorRuntimeMountable } from './assert-generator-runtime-mountable.js';
import { createGeneratorPageRuntimeMount } from './create-generator-page-runtime-mount.js';
import { createGeneratorPageBaseState } from './create-generator-page-base-state.js';
import { createGeneratorPageServices } from './create-generator-page-services.js';
import { defineGeneratorPageSchemaState } from './define-generator-page-schema-state.js';
import { createGeneratorUnavailableRowCountResult } from './create-generator-unavailable-row-count-result.js';

function createGeneratorPageService({
  options = {},
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  dataRulesToSchemaText,
  sampleSchemaText,
  createBaseState = createGeneratorPageBaseState,
  createPageServices = createGeneratorPageServices,
  createPageRuntimeMount = createGeneratorPageRuntimeMount,
  assertPageMountable = assertGeneratorRuntimeMountable,
  defineSchemaState = defineGeneratorPageSchemaState,
  createUnavailableRowCountResult = createGeneratorUnavailableRowCountResult,
} = {}) {
  const pageService = {
    ...createBaseState({
      options,
    }),
    schemaErrorDisplay: undefined,
    schemaDefinition: undefined,
    generatorControls: undefined,
    generatorPreview: undefined,
    generatorPage: undefined,
  };

  Object.assign(pageService, {
    init() {
      assertPageMountable(pageService);
      Object.assign(
        pageService,
        createPageRuntimeMount({
          runtime: pageService,
        })
      );
    },

    destroy() {
      pageService.generatorPage?.destroy?.();
    },

    getSelectedOutputType() {
      return pageService.generatorViewState.getSelectedOutputType();
    },

    syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat = pageService.getSelectedOutputType()) {
      return pageService.generatorViewState.syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat);
    },

    applyCurrentTypeOptions(optionsToApply) {
      return pageService.generatorRuntimeActions.applyCurrentTypeOptions(optionsToApply);
    },

    renderSchemaRows() {
      pageService.generatorSchemaState.renderSchemaRows();
    },

    getPreviewRowCount() {
      return pageService.generatorViewState.getPreviewRowCount();
    },

    getGenerateRowCount() {
      return pageService.generatorViewState.getGenerateRowCount();
    },

    previewData() {
      return pageService.generatorRuntimeActions.previewData();
    },

    async generateDataFile() {
      await pageService.generatorRuntimeActions.generateDataFile();
    },

    async generateAllPairsDataFile() {
      await pageService.generatorRuntimeActions.generateAllPairsDataFile();
    },

    updateAllPairsButtonVisibility() {
      return pageService.generatorRuntimeActions.updateAllPairsButtonVisibility();
    },
  });

  Object.assign(
    pageService,
    createPageServices({
      runtime: pageService,
      faker: pageService.faker,
      RandExp: pageService.RandExp,
      TestDataGeneratorClass: pageService.TestDataGeneratorClass,
      DownloadClass: pageService.DownloadClass,
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      mapRuleToRow: (rule, index) => pageService.generatorSchemaDefinitionSupport.mapRuleToRow(rule, index),
      dataRulesToSchemaText,
      sampleSchemaText,
      createUnavailableRowCountResult,
    })
  );

  defineSchemaState(pageService, {
    getPageService: () => pageService,
  });

  return pageService;
}

export { createGeneratorPageService };
