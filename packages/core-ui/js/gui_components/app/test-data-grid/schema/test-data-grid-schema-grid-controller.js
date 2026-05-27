/*
 * Responsibilities:
 * - Owns the embedded schema-grid setup and schema text/grid synchronization orchestration.
 * - Keeps grid-library wiring and row/text conversion out of the main app-page controller.
 */

import { renderSchemaTextFromGridRows } from '../../../shared/test-data/schema/index.js';
import { populateGridFromSchemaText } from '../schema/index.js';
import { applyTestDataGridLayout, createGridChromeElements, bindGridChromeControls } from '../host/index.js';

function createSchemaGridController({
  documentObj = document,
  setupSchemaGridEditor,
  createGridChromeElementsFn = createGridChromeElements,
  bindGridChromeControlsFn = bindGridChromeControls,
  applyTestDataGridLayoutFn = applyTestDataGridLayout,
  renderSchemaTextFromGridRowsFn = renderSchemaTextFromGridRows,
  populateGridFromSchemaTextFn = populateGridFromSchemaText,
  createGridRowToSchemaRowMapper,
  buildRuleSpecFromSchemaRow,
  dataRulesToSchemaText,
  schemaTextSyncState,
  updatePairwiseButtonVisibility,
  schemaTextToDataRules,
  schemaErrorsToText,
  setTestDataStatus,
  mapRuleToRow,
  faker,
  RandExp,
  getAgGridCommandEditorValues,
  getMethodPickerOptions,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
}) {
  const state = {
    schemaGridApi: undefined,
    schemaGridExtras: undefined,
    schemaGridBridge: undefined,
    activeDraftCellEdit: null,
  };

  function convertGridToText() {
    if (!state.schemaGridBridge) {
      return;
    }

    const schemaText = renderSchemaTextFromGridRowsFn({
      rows: state.schemaGridBridge.getRows(),
      activeDraftCellEdit: state.activeDraftCellEdit,
      mapGridRowToSchemaRow: createGridRowToSchemaRowMapper(),
      buildRuleSpecFromSchemaRow,
      dataRulesToSchemaText,
      schemaTokens: schemaTextSyncState.schemaTextTokens,
    });

    const textArea = documentObj.getElementById('testDataSchemaText');
    if (textArea) {
      textArea.value = schemaText;
    }
    updatePairwiseButtonVisibility();
  }

  function populateGridFromTextSchema() {
    populateGridFromSchemaTextFn({
      state: schemaTextSyncState,
      schemaGridBridge: state.schemaGridBridge,
      schemaTextToDataRules,
      schemaErrorsToText,
      setTestDataStatus,
      updatePairwiseButtonVisibility,
      mapRuleToRow,
      faker,
      RandExp,
    });
  }

  function syncSchemaTextFromGridBeforeGenerate() {
    if (typeof documentObj?.activeElement?.blur === 'function') {
      documentObj.activeElement.blur();
    }

    if (state.schemaGridBridge) {
      convertGridToText();
    }
  }

  function setupTestDataEditGrid(gridDiv) {
    const { tableDiv, addNewRowButton, deleteRowsButton } = createGridChromeElementsFn(gridDiv);

    const setupResult = setupSchemaGridEditor({
      tableDiv,
      convertGridToText,
      onDraftCellEditChange: (draftCellEdit) => {
        state.activeDraftCellEdit = draftCellEdit;
      },
      getAgGridCommandEditorValues,
      getMethodPickerOptions,
      FAKER_SECTION_VALUE,
      DOMAIN_SECTION_VALUE,
    });

    if (!setupResult) {
      console.warn('No supported grid library loaded; test data schema grid editor disabled.');
      return;
    }

    state.schemaGridApi = setupResult.schemaGridApi;
    state.schemaGridExtras = setupResult.schemaGridExtras;
    state.schemaGridBridge = setupResult.schemaGridBridge;

    bindGridChromeControlsFn({
      addNewRowButton,
      deleteRowsButton,
      getBridge: () => state.schemaGridBridge,
      getExtras: () => state.schemaGridExtras,
      onSchemaChanged: convertGridToText,
    });
  }

  function createTestDataGrid() {
    const gridDiv = documentObj.querySelector('#testDataSchemaGrid');
    setupTestDataEditGrid(gridDiv);

    const textEdit = documentObj.querySelector('.test-data-schema-text-container');
    const zone = documentObj.querySelector('.test-data-schema-edit-zone');
    applyTestDataGridLayoutFn({
      gridDiv,
      textEdit,
      zone,
      hasGridApi: Boolean(state.schemaGridApi),
    });
  }

  return {
    createTestDataGrid,
    populateGridFromTextSchema,
    syncSchemaTextFromGridBeforeGenerate,
    getSchemaGridApi: () => state.schemaGridApi,
    getSchemaGridExtras: () => state.schemaGridExtras,
    getSchemaGridBridge: () => state.schemaGridBridge,
  };
}

export { createSchemaGridController };
