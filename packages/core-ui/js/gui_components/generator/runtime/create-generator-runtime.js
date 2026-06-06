import { assertGeneratorRuntimeMountable } from './assert-generator-runtime-mountable.js';
import { createGeneratorPageRuntimeMount } from './create-generator-page-runtime-mount.js';
import { createGeneratorRuntimeBaseState } from './create-generator-runtime-base-state.js';
import { createGeneratorRuntimeCollaborators } from './create-generator-runtime-collaborators.js';
import { defineGeneratorRuntimeSchemaState } from './create-generator-runtime-schema-state.js';
import { createGeneratorUnavailableRowCountResult } from './create-generator-unavailable-row-count-result.js';

function createGeneratorRuntime({
  options = {},
  schemaTextToDataRules,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
  dataRulesToSchemaText,
  sampleSchemaText,
  createBaseState = createGeneratorRuntimeBaseState,
  createRuntimeCollaboratorsFn = createGeneratorRuntimeCollaborators,
  createPageRuntimeMount = createGeneratorPageRuntimeMount,
  assertRuntimeMountable = assertGeneratorRuntimeMountable,
  defineSchemaState = defineGeneratorRuntimeSchemaState,
  createUnavailableRowCountResult = createGeneratorUnavailableRowCountResult,
} = {}) {
  const runtime = {
    ...createBaseState({
      options,
    }),
    schemaErrorDisplay: undefined,
    schemaDefinition: undefined,
    generatorControls: undefined,
    generatorPreview: undefined,
    generatorPage: undefined,
  };

  Object.assign(runtime, {
    init() {
      assertRuntimeMountable(runtime);
      Object.assign(
        runtime,
        createPageRuntimeMount({
          runtime,
        })
      );
    },

    destroy() {
      runtime.generatorPage?.destroy?.();
    },

    getSelectedOutputType() {
      return runtime.generatorViewState.getSelectedOutputType();
    },

    syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat = runtime.getSelectedOutputType()) {
      return runtime.generatorViewState.syncGeneratorControlsFormatStateIfChanged(nextFormat, previousFormat);
    },

    applyCurrentTypeOptions(optionsToApply) {
      return runtime.generatorRuntimeActions.applyCurrentTypeOptions(optionsToApply);
    },

    renderSchemaRows() {
      runtime.generatorSchemaState.renderSchemaRows();
    },

    getPreviewRowCount() {
      return runtime.generatorViewState.getPreviewRowCount();
    },

    getGenerateRowCount() {
      return runtime.generatorViewState.getGenerateRowCount();
    },

    previewData() {
      return runtime.generatorRuntimeActions.previewData();
    },

    async generateDataFile() {
      await runtime.generatorRuntimeActions.generateDataFile();
    },

    async generateAllPairsDataFile() {
      await runtime.generatorRuntimeActions.generateAllPairsDataFile();
    },

    updateAllPairsButtonVisibility() {
      return runtime.generatorRuntimeActions.updateAllPairsButtonVisibility();
    },
  });

  Object.assign(
    runtime,
    createRuntimeCollaboratorsFn({
      runtime,
      faker: runtime.faker,
      RandExp: runtime.RandExp,
      TestDataGeneratorClass: runtime.TestDataGeneratorClass,
      DownloadClass: runtime.DownloadClass,
      schemaTextToDataRules,
      schemaRowsToSpec,
      schemaRowsToSpecWithTokens,
      validateSchemaRows,
      mapRuleToRow: (rule, index) => runtime.generatorSchemaDefinitionSupport.mapRuleToRow(rule, index),
      dataRulesToSchemaText,
      sampleSchemaText,
      createUnavailableRowCountResult,
    })
  );

  defineSchemaState(runtime, {
    getRuntime: () => runtime,
  });

  return runtime;
}

export { createGeneratorRuntime };
