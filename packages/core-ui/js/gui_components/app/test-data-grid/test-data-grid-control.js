/*
 * Responsibilities:
 * - Main controller for the test-data grid panel in the app page.
 * - Wires DOM events, grid editors, schema text sync triggers, and generation actions.
 * - Delegates command catalog logic and UI status behavior to focused helper modules.
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
import { renderSchemaTextFromGridRows } from '../../shared/test-data/schema-editor-core.js';
import {
  bindPrimaryActions,
  bindGenerateCountInput,
  bindModeRadios,
  bindSchemaSampleShortcut,
} from './test-data-grid-ui-bindings.js';
import {
  createSchemaTextSyncState,
  showSchemaError,
  populateGridFromSchemaText,
  bindSchemaTextareaSync,
  initializeSchemaErrorDisplay,
} from './test-data-grid-schema-text-sync.js';
import { applyTestDataGridLayout } from './test-data-grid-layout.js';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../shared/test-data/schema-examples.js';
import { mapDataRuleToGridRow, mapGridRowToSchemaRow } from './test-data-grid-schema-row-mappers.js';
import { createGridChromeElements, bindGridChromeControls } from './test-data-grid-controls.js';

import { faker } from 'https://cdn.skypack.dev/@faker-js/faker@v9.7.0';

var debouncer = new Debouncer();
let importer = undefined;
let textPreviewRenderer = undefined;
let mainGridExtras = undefined;
let activeDefnCellEdit = null;
let schemaSampleButtonClickHandler = null;
const schemaTextSyncState = createSchemaTextSyncState();
let generationService = null;

function showTestDataSchemaError(message) {
  showSchemaError(schemaTextSyncState, message);
}

function getSchemaTextFromEditor() {
  const schemaTextArea = document.getElementById('testdatadefntext');
  if (!schemaTextArea) {
    return '';
  }
  return schemaTextArea.value || '';
}

function updatePairwiseButtonVisibility() {
  generationService?.updatePairwiseButtonVisibility?.();
}

async function generatePairwiseTestData() {
  await generationService?.generatePairwiseTestData?.();
}

async function generateTestData() {
  await generationService?.generateTestData?.();
}

async function refreshTestDataPreview() {
  await generationService?.refreshTestDataPreview?.({
    clearPendingStatusReset: clearPendingTestDataStatusReset,
    scheduleStatusReset: scheduleTestDataStatusReset,
  });
}

function syncSchemaTextFromGridBeforeGenerate() {
  // Tabulator keeps editor value in-flight until edit is committed; blur first so
  // clicking Generate while typing still captures the latest schema values.
  if (typeof document !== 'undefined' && typeof document.activeElement?.blur === 'function') {
    document.activeElement.blur();
  }

  if (defnGridBridge) {
    convertGridToText();
  }
}

function getMainGridExtras() {
  return mainGridExtras || importer?.gridExtensions;
}

function getGenerationMode() {
  const selectedOption = document.querySelector('input[name="testDataGenerationMode"]:checked');
  if (!selectedOption) {
    return TEST_DATA_MODES.NEW_TABLE;
  }
  return selectedOption.value;
}

function setGenerateCountToCurrentRows() {
  const gridExtras = getMainGridExtras();
  if (!gridExtras) {
    return;
  }
  document.getElementById('generateCount').value = gridExtras.getRowCount();
}

function setGenerateCountToSelectedRows() {
  const gridExtras = getMainGridExtras();
  if (!gridExtras) {
    return;
  }
  document.getElementById('generateCount').value = gridExtras.getSelectedRowIndexes().length;
}

function applyModeDefaultRowCount(mode) {
  if (mode === TEST_DATA_MODES.AMEND_TABLE) {
    setGenerateCountToCurrentRows();
    return;
  }
  if (mode === TEST_DATA_MODES.AMEND_SELECTED) {
    setGenerateCountToSelectedRows();
  }
}

function loadSampleSchemaIntoTextArea() {
  const schemaTextArea = document.getElementById('testdatadefntext');
  if (!schemaTextArea) {
    return;
  }
  schemaTextArea.value = TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT;
  populateGridFromTextSchema();
}

function createTestDataGrid() {
  var gridDiv = document.querySelector('#defngrid');
  setupTestDataEditGrid(gridDiv);

  var textEdit = document.querySelector('.defn-text-container');
  var zone = document.querySelector('.defn-edit-zone');
  applyTestDataGridLayout({
    gridDiv,
    textEdit,
    zone,
    hasGridApi: Boolean(defnGridApi),
  });
}

// todo: this all really needs to be wrapped in a class
var defnGridApi;
var defnGridExtras;
var defnGridBridge;

// populate Test Data Grid From Rules in Text Area
function populateGridFromTextSchema() {
  populateGridFromSchemaText({
    state: schemaTextSyncState,
    defnGridBridge,
    schemaTextToDataRules,
    schemaErrorsToText: generationService?.schemaErrorsToText,
    setTestDataStatus,
    updatePairwiseButtonVisibility,
    mapRuleToRow: mapDataRuleToGridRow,
    faker,
    RandExp,
  });
}

function setupTestDataEditGrid(gridDiv) {
  const { tableDiv, addNewRowButton, deleteRowsButton } = createGridChromeElements(gridDiv);

  const setupResult = setupDefnGridEditor({
    tableDiv,
    convertGridToText,
    onDraftCellEditChange: (draftCellEdit) => {
      activeDefnCellEdit = draftCellEdit;
    },
    getAgGridTypeEditorValues,
    getTabulatorTypeEditorValues,
    FAKER_SECTION_VALUE,
    DOMAIN_SECTION_VALUE,
  });
  if (!setupResult) {
    console.warn('No supported grid library loaded; test data definition grid editor disabled.');
    return;
  }
  defnGridApi = setupResult.defnGridApi;
  defnGridExtras = setupResult.defnGridExtras;
  defnGridBridge = setupResult.defnGridBridge;

  bindGridChromeControls({
    addNewRowButton,
    deleteRowsButton,
    getBridge: () => defnGridBridge,
    getExtras: () => defnGridExtras,
    onSchemaChanged: convertGridToText,
  });
}

function convertGridToText() {
  if (!defnGridBridge) {
    return;
  }
  const schemaText = renderSchemaTextFromGridRows({
    rows: defnGridBridge.getRows(),
    activeDraftCellEdit: activeDefnCellEdit,
    mapGridRowToSchemaRow: (rowData) =>
      mapGridRowToSchemaRow(rowData, {
        FAKER_SECTION_VALUE,
        DOMAIN_SECTION_VALUE,
        FAKER_COMMANDS,
        DOMAIN_COMMANDS,
      }),
    buildRuleSpecFromSchemaRow,
    dataRulesToSchemaText,
    schemaTokens: schemaTextSyncState.schemaTextTokens,
  });
  document.getElementById('testdatadefntext').value = schemaText;
  updatePairwiseButtonVisibility();
}

function enableTestDataGenerationInterface(parentId, anImporter, aTextPreviewRenderer, aGridExtras) {
  // dynamically setup the faker commands from loaded library
  // and check for any changes
  identifyFakerCommands(faker);

  importer = anImporter;
  textPreviewRenderer = aTextPreviewRenderer;
  mainGridExtras = aGridExtras;
  generationService = createTestDataGenerationService({
    schemaTextToDataRules,
    TestDataGeneratorClass: TestDataGenerator,
    PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
    GenericDataTableClass: GenericDataTable,
    TEST_DATA_MODES,
    normaliseCount,
    createTableFromGenerator,
    createAmendedTable,
    faker,
    RandExp,
    debouncer,
    syncSchemaTextFromGridBeforeGenerate,
    setTestDataStatus,
    showSchemaError: showTestDataSchemaError,
    yieldToUi,
    getSchemaText: getSchemaTextFromEditor,
    getImporter: () => importer,
    getTextPreviewRenderer: () => textPreviewRenderer,
    getMainGridExtras: () => getMainGridExtras(),
    getGenerationMode,
  });

  let parentElem = document.getElementById(parentId);
  parentElem.innerHTML = `
        <div>
            <button id="generatedata">Generate</button>
            <button id="generateallpairs" style="display:none;">Generate Pairwise</button>
            <button id="refreshtestdatapreview">Refresh Text Preview</button>
            <label> How Many?<input type="number" id="generateCount" min="1" step="1"/></label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.NEW_TABLE}" checked>New Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_TABLE}">Amend Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_SELECTED}">Amend Selected</label>
            <span id="testdata-status" class="import-progress-status" style="display:none;" aria-live="polite"></span>
            <span id="testdata-schema-error" class="generator-schema-error-text" aria-live="polite" role="status"></span>
        </div>
        <div class="defn-edit-zone">
            <div class="defn-grid-container" id="defngrid" class="ag-theme-alpine">
            </div>
            <div class="defn-text-container">
                <p>
                  Test Data Text Schema
                  <span
                    data-help="test-data-text-schema-help"
                    class="helpicon option-help-icon"
                  ></span>
                </p>
                <textarea class="testDataDefn" name="testdatadefntext" id="testdatadefntext"></textarea>
            </div>
        </div>
    `;

  bindPrimaryActions({
    onGenerate: generateTestData,
    onGeneratePairwise: generatePairwiseTestData,
    onRefreshPreview: refreshTestDataPreview,
  });
  bindGenerateCountInput();
  bindModeRadios({
    parentElem,
    applyModeDefaultRowCount,
  });

  createTestDataGrid();

  initializeSchemaErrorDisplay(schemaTextSyncState);
  bindSchemaTextareaSync({
    debouncer,
    onPopulateRequested: populateGridFromTextSchema,
  });

  schemaSampleButtonClickHandler = bindSchemaSampleShortcut({
    currentHandler: schemaSampleButtonClickHandler,
    onSampleRequested: loadSampleSchemaIntoTextArea,
  });

  if (typeof window !== 'undefined' && typeof window.updateHelpHints === 'function') {
    window.updateHelpHints();
  }
}

export {
  enableTestDataGenerationInterface,
  identifyFakerCommands,
  getFakerCommands,
  getDomainCommands,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
};

/**
 * Getter function for FAKER_COMMANDS array (for testing purposes).
 * @returns {string[]} Array of discovered faker commands
 */
