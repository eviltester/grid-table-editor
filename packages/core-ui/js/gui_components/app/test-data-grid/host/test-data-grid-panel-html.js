/*
 * Responsibilities:
 * - Renders the embedded app-page test-data panel shell.
 * - Provides sample-schema text insertion for the app-page textarea.
 */

function renderTestDataGenerationPanel({ parentElem, TEST_DATA_MODES }) {
  parentElem.innerHTML = `
        <div>
            <button id="generatedata">Generate</button>
            <button id="generateallpairs" style="display:none;">Generate Pairwise</button>
            <button id="refreshtestdatapreview">Refresh Text Preview</button>
            <span id="generateCountControl"></span>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.NEW_TABLE}" checked>New Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_TABLE}">Amend Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_SELECTED}">Amend Selected</label>
            <span id="testdata-status" class="import-progress-status" style="display:none;" aria-live="polite"></span>
        </div>
        <div class="test-data-schema-edit-zone generator-schema">
            <div id="testDataSchemaDefinition"></div>
        </div>
    `;
}

function loadSampleSchemaIntoTextArea({ documentObj, sampleSchemaText, onSchemaUpdated }) {
  const schemaTextArea = documentObj?.getElementById('testDataSchemaText');
  if (!schemaTextArea) {
    return;
  }
  schemaTextArea.value = sampleSchemaText;
  onSchemaUpdated?.();
}

export { renderTestDataGenerationPanel, loadSampleSchemaIntoTextArea };
