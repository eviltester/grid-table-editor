/*
 * Responsibilities:
 * - Owns the embedded schema-grid setup and schema text/grid synchronization orchestration.
 * - Keeps grid-library wiring and row/text conversion out of the main app-page controller.
 */

import { renderSchemaTextFromGridRows } from '../../../shared/test-data/schema/schema-editor-core.js';
import { populateGridFromSchemaText } from '../schema/test-data-grid-schema-text-sync.js';
import { applyTestDataGridLayout } from '../host/test-data-grid-layout.js';
import { createGridChromeElements, bindGridChromeControls } from '../host/test-data-grid-host.js';

function createSchemaGridController({
  documentObj = document,
  setupDefnGridEditor,
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
  getAgGridTypeEditorValues,
  getTabulatorTypeEditorValues,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
}) {
  const state = {
    defnGridApi: undefined,
    defnGridExtras: undefined,
    defnGridBridge: undefined,
    activeDraftCellEdit: null,
  };

  function convertGridToText() {
    if (!state.defnGridBridge) {
      return;
    }

    const schemaText = renderSchemaTextFromGridRowsFn({
      rows: state.defnGridBridge.getRows(),
      activeDraftCellEdit: state.activeDraftCellEdit,
      mapGridRowToSchemaRow: createGridRowToSchemaRowMapper(),
      buildRuleSpecFromSchemaRow,
      dataRulesToSchemaText,
      schemaTokens: schemaTextSyncState.schemaTextTokens,
    });

    const textArea = documentObj.getElementById('testdatadefntext');
    if (textArea) {
      textArea.value = schemaText;
    }
    updatePairwiseButtonVisibility();
  }

  function populateGridFromTextSchema() {
    populateGridFromSchemaTextFn({
      state: schemaTextSyncState,
      defnGridBridge: state.defnGridBridge,
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

    if (state.defnGridBridge) {
      convertGridToText();
    }
  }

  function setupTestDataEditGrid(gridDiv) {
    const { tableDiv, addNewRowButton, deleteRowsButton } = createGridChromeElementsFn(gridDiv);

    const setupResult = setupDefnGridEditor({
      tableDiv,
      convertGridToText,
      onDraftCellEditChange: (draftCellEdit) => {
        state.activeDraftCellEdit = draftCellEdit;
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

    state.defnGridApi = setupResult.defnGridApi;
    state.defnGridExtras = setupResult.defnGridExtras;
    state.defnGridBridge = setupResult.defnGridBridge;

    bindGridChromeControlsFn({
      addNewRowButton,
      deleteRowsButton,
      getBridge: () => state.defnGridBridge,
      getExtras: () => state.defnGridExtras,
      onSchemaChanged: convertGridToText,
    });
  }

  function createTestDataGrid() {
    const gridDiv = documentObj.querySelector('#defngrid');
    setupTestDataEditGrid(gridDiv);

    const textEdit = documentObj.querySelector('.defn-text-container');
    const zone = documentObj.querySelector('.defn-edit-zone');
    applyTestDataGridLayoutFn({
      gridDiv,
      textEdit,
      zone,
      hasGridApi: Boolean(state.defnGridApi),
    });
  }

  return {
    createTestDataGrid,
    populateGridFromTextSchema,
    syncSchemaTextFromGridBeforeGenerate,
    getDefnGridApi: () => state.defnGridApi,
    getDefnGridExtras: () => state.defnGridExtras,
    getDefnGridBridge: () => state.defnGridBridge,
  };
}

export { createSchemaGridController };
