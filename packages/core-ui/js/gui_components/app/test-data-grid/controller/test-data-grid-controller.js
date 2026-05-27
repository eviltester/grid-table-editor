/*
 * Responsibilities:
 * - Exposes the app-page entrypoint for the embedded test-data generation panel.
 * - Creates per-instance controller state instead of relying on singleton module variables.
 * - Composes the focused helpers for panel HTML, schema-grid sync, generation, and UI bindings.
 */

import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Debouncer } from '@anywaydata/core/utils/debouncer.js';
import {
  TEST_DATA_MODES,
  createAmendedTable,
  createTableFromGenerator,
  normaliseCount,
  createTestDataGenerationService,
} from '../generation/index.js';
import { schemaTextToDataRules, dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { FAKER_COMMANDS, identifyFakerCommands, getMethodPickerOptions } from '../schema/index.js';
import {
  setTestDataStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
} from '../ui/test-data-ui-status.js';
import { bindPrimaryActions, bindGenerateCountInput, bindModeRadios, bindSchemaSampleShortcut } from '../host/index.js';
import {
  createSchemaTextSyncState,
  showSchemaError,
  bindSchemaTextareaSync,
  initializeSchemaErrorDisplay,
} from '../schema/index.js';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../shared/test-data/schema/index.js';
import { mapDataRuleToSchemaRow } from '../../../shared/test-data/schema/index.js';
import {
  getGenerationMode as getGenerationModeFromUi,
  applyModeDefaultRowCount as applyModeDefaultRowCountShared,
} from '../controller/test-data-grid-generation-mode.js';
import {
  renderTestDataGenerationPanel,
  loadSampleSchemaIntoTextArea as loadSampleSchemaIntoTextAreaShared,
} from '../host/index.js';
import { createSchemaGridController } from '../schema/index.js';
import { setupTestDataGenerationPanel } from '../host/index.js';
import { createTestDataGridActionAdapter } from '../controller/test-data-grid-action-adapter.js';

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
    const schemaTextArea = getResolvedDocument()?.getElementById('testDataSchemaText');
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
    if (typeof state.schemaGridController?.insertSampleSchema === 'function') {
      state.schemaGridController.insertSampleSchema();
      return;
    }
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
      dataRulesToSchemaText: dataRulesToSchemaTextFn,
      schemaTextSyncState: state.schemaTextSyncState,
      updatePairwiseButtonVisibility,
      schemaTextToDataRules: schemaTextToDataRulesFn,
      setTestDataStatus: setTestDataStatusFn,
      mapRuleToRow: mapDataRuleToSchemaRow,
      faker,
      RandExp,
      getMethodPickerOptions,
      fakerCommands: FAKER_COMMANDS.filter((command) => command !== 'RegEx' && command.startsWith('helpers.')),
      getVisibleDomainCommandOptions: (currentValue) => {
        const options = getMethodPickerOptions(currentValue).filter((option) => option.sourceType === 'domain');
        return options.map((option) => ({ value: option.command, label: option.command }));
      },
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

export { createTestDataGridControl, enableTestDataGenerationInterface };
