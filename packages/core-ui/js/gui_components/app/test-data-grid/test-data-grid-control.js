/*
 * Responsibilities:
 * - Exposes the app-page entrypoint for the embedded test-data generation panel.
 * - Creates per-instance controller state instead of relying on singleton module variables.
 * - Composes the focused helpers for panel HTML, schema-grid sync, generation, and UI bindings.
 */

import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Debouncer } from '@anywaydata/core/utils/debouncer.js';
import { TEST_DATA_MODES, createAmendedTable, createTableFromGenerator, normaliseCount } from './test-data-amend.js';
import { schemaTextToDataRules, dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { buildRuleSpecFromSchemaRow } from '../../shared/schema-row-rule-mapper.js';
import {
  FAKER_COMMANDS,
  DOMAIN_COMMANDS,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
  identifyFakerCommands,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
  getFakerCommands,
  getDomainCommands,
} from './test-data-type-catalog.js';
import {
  setTestDataStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
} from './test-data-ui-status.js';
import { createTestDataGenerationService } from './test-data-generation-service.js';
import { setupDefnGridEditor } from './test-data-grid-engine-setup.js';
import {
  bindPrimaryActions,
  bindGenerateCountInput,
  bindModeRadios,
  bindSchemaSampleShortcut,
} from './test-data-grid-ui-bindings.js';
import {
  createSchemaTextSyncState,
  showSchemaError,
  bindSchemaTextareaSync,
  initializeSchemaErrorDisplay,
} from './test-data-grid-schema-text-sync.js';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../shared/test-data/schema-examples.js';
import { mapDataRuleToGridRow, mapGridRowToSchemaRow } from './test-data-grid-schema-row-mappers.js';
import {
  getGenerationMode as getGenerationModeFromUi,
  applyModeDefaultRowCount as applyModeDefaultRowCountShared,
} from './test-data-grid-generation-mode.js';
import {
  renderTestDataGenerationPanel,
  loadSampleSchemaIntoTextArea as loadSampleSchemaIntoTextAreaShared,
} from './test-data-grid-panel-html.js';
import { createSchemaGridController } from './test-data-grid-schema-grid-controller.js';
import { setupTestDataGenerationPanel } from './test-data-grid-panel-coordinator.js';
import { createTestDataGridActionAdapter } from './test-data-grid-action-adapter.js';

import { faker } from 'https://cdn.skypack.dev/@faker-js/faker@v9.7.0';

function createTestDataGridControl({
  documentObj,
  windowObj,
  DebouncerClass = Debouncer,
  schemaTextToDataRulesFn = schemaTextToDataRules,
  dataRulesToSchemaTextFn = dataRulesToSchemaText,
  createTestDataGenerationServiceFn = createTestDataGenerationService,
  createSchemaGridControllerFn = createSchemaGridController,
  renderTestDataGenerationPanelFn = renderTestDataGenerationPanel,
  bindPrimaryActionsFn = bindPrimaryActions,
  bindGenerateCountInputFn = bindGenerateCountInput,
  bindModeRadiosFn = bindModeRadios,
  bindSchemaSampleShortcutFn = bindSchemaSampleShortcut,
  bindSchemaTextareaSyncFn = bindSchemaTextareaSync,
  initializeSchemaErrorDisplayFn = initializeSchemaErrorDisplay,
  loadSampleSchemaIntoTextAreaFn = loadSampleSchemaIntoTextAreaShared,
  setupTestDataGenerationPanelFn = setupTestDataGenerationPanel,
  showSchemaErrorFn = showSchemaError,
  setTestDataStatusFn = setTestDataStatus,
  clearPendingStatusResetFn = clearPendingTestDataStatusReset,
  scheduleStatusResetFn = scheduleTestDataStatusReset,
  yieldToUiFn = yieldToUi,
  setupDefnGridEditorFn = setupDefnGridEditor,
  identifyFakerCommandsFn = identifyFakerCommands,
  createTestDataGridActionAdapterFn = createTestDataGridActionAdapter,
} = {}) {
  const state = {
    debouncer: new DebouncerClass(),
    importer: undefined,
    textPreviewRenderer: undefined,
    mainGridExtras: undefined,
    schemaSampleButtonClickHandler: null,
    schemaTextSyncState: createSchemaTextSyncState(),
    generationService: null,
    schemaGridController: null,
    actionAdapter: null,
  };

  function showTestDataSchemaError(message) {
    showSchemaErrorFn(state.schemaTextSyncState, message);
  }

  function getResolvedDocument() {
    return documentObj || globalThis.document;
  }

  function getResolvedWindow() {
    return windowObj || globalThis.window;
  }

  function getSchemaTextFromEditor() {
    const schemaTextArea = getResolvedDocument()?.getElementById('testdatadefntext');
    if (!schemaTextArea) {
      return '';
    }
    return schemaTextArea.value || '';
  }

  function getMainGridExtras() {
    return state.mainGridExtras || state.importer?.gridExtensions;
  }

  function getGenerationMode() {
    return getGenerationModeFromUi({
      documentObj: getResolvedDocument(),
      defaultMode: TEST_DATA_MODES.NEW_TABLE,
    });
  }

  function applyModeDefaultRowCount(mode) {
    applyModeDefaultRowCountShared({
      mode,
      documentObj: getResolvedDocument(),
      gridExtras: getMainGridExtras(),
      amendTableMode: TEST_DATA_MODES.AMEND_TABLE,
      amendSelectedMode: TEST_DATA_MODES.AMEND_SELECTED,
    });
  }

  function updatePairwiseButtonVisibility() {
    state.generationService?.updatePairwiseButtonVisibility?.();
  }

  function populateGridFromTextSchema() {
    state.schemaGridController?.populateGridFromTextSchema?.();
  }

  function loadSampleSchemaIntoTextArea() {
    loadSampleSchemaIntoTextAreaFn({
      documentObj: getResolvedDocument(),
      sampleSchemaText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
      onSchemaUpdated: populateGridFromTextSchema,
    });
  }

  function createGenerationService() {
    return createTestDataGenerationServiceFn({
      schemaTextToDataRules: schemaTextToDataRulesFn,
      TestDataGeneratorClass: TestDataGenerator,
      PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
      GenericDataTableClass: GenericDataTable,
      TEST_DATA_MODES,
      normaliseCount,
      createTableFromGenerator,
      createAmendedTable,
      faker,
      RandExp,
      debouncer: state.debouncer,
      syncSchemaTextFromGridBeforeGenerate: () => state.schemaGridController?.syncSchemaTextFromGridBeforeGenerate?.(),
      setTestDataStatus: setTestDataStatusFn,
      showSchemaError: showTestDataSchemaError,
      yieldToUi: yieldToUiFn,
      getSchemaText: getSchemaTextFromEditor,
      getImporter: () => state.importer,
      getTextPreviewRenderer: () => state.textPreviewRenderer,
      getMainGridExtras,
      getGenerationMode,
    });
  }

  function createGridController() {
    return createSchemaGridControllerFn({
      documentObj: getResolvedDocument(),
      setupDefnGridEditor: setupDefnGridEditorFn,
      createGridRowToSchemaRowMapper: () => (rowData) =>
        mapGridRowToSchemaRow(rowData, {
          FAKER_SECTION_VALUE,
          DOMAIN_SECTION_VALUE,
          FAKER_COMMANDS,
          DOMAIN_COMMANDS,
        }),
      buildRuleSpecFromSchemaRow,
      dataRulesToSchemaText: dataRulesToSchemaTextFn,
      schemaTextSyncState: state.schemaTextSyncState,
      updatePairwiseButtonVisibility,
      schemaTextToDataRules: schemaTextToDataRulesFn,
      schemaErrorsToText: state.generationService?.schemaErrorsToText,
      setTestDataStatus: setTestDataStatusFn,
      mapRuleToRow: mapDataRuleToGridRow,
      faker,
      RandExp,
      getAgGridTypeEditorValues,
      getTabulatorTypeEditorValues,
      FAKER_SECTION_VALUE,
      DOMAIN_SECTION_VALUE,
    });
  }

  function enableTestDataGenerationInterface(parentId, importer, textPreviewRenderer, gridExtras) {
    identifyFakerCommandsFn(faker);

    state.importer = importer;
    state.textPreviewRenderer = textPreviewRenderer;
    state.mainGridExtras = gridExtras;
    state.generationService = createGenerationService();
    state.actionAdapter = createTestDataGridActionAdapterFn({
      getGenerationService: () => state.generationService,
      clearPendingStatusReset: clearPendingStatusResetFn,
      scheduleStatusReset: scheduleStatusResetFn,
    });

    const parentElem = getResolvedDocument()?.getElementById(parentId);
    state.schemaGridController = createGridController();
    const activeWindow = getResolvedWindow();
    const panelSetupResult = setupTestDataGenerationPanelFn({
      parentElem,
      TEST_DATA_MODES,
      renderTestDataGenerationPanelFn,
      bindPrimaryActionsFn,
      bindGenerateCountInputFn,
      bindModeRadiosFn,
      initializeSchemaErrorDisplayFn,
      bindSchemaTextareaSyncFn,
      bindSchemaSampleShortcutFn,
      schemaTextSyncState: state.schemaTextSyncState,
      debouncer: state.debouncer,
      onGenerate: () => state.actionAdapter.generateTestData(),
      onGeneratePairwise: () => state.actionAdapter.generatePairwiseTestData(),
      onRefreshPreview: () => state.actionAdapter.refreshTestDataPreview(),
      applyModeDefaultRowCount,
      onPopulateRequested: populateGridFromTextSchema,
      onSampleRequested: loadSampleSchemaIntoTextArea,
      createTestDataGrid: () => state.schemaGridController.createTestDataGrid(),
      previousSampleHandler: state.schemaSampleButtonClickHandler,
      updateHelpHints:
        typeof activeWindow?.updateHelpHints === 'function' ? () => activeWindow.updateHelpHints() : undefined,
    });
    state.schemaSampleButtonClickHandler = panelSetupResult?.sampleHandler ?? state.schemaSampleButtonClickHandler;

    return state;
  }

  return {
    enableTestDataGenerationInterface,
    getState: () => state,
  };
}

const defaultTestDataGridControl = createTestDataGridControl();

function enableTestDataGenerationInterface(parentId, importer, textPreviewRenderer, gridExtras) {
  return defaultTestDataGridControl.enableTestDataGenerationInterface(
    parentId,
    importer,
    textPreviewRenderer,
    gridExtras
  );
}

export {
  createTestDataGridControl,
  enableTestDataGenerationInterface,
  identifyFakerCommands,
  getFakerCommands,
  getDomainCommands,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
};
