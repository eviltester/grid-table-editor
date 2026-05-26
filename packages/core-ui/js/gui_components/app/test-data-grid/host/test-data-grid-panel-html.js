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
            <label> How Many?<input type="number" id="generateCount" min="1" step="1"/></label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.NEW_TABLE}" checked>New Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_TABLE}">Amend Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_SELECTED}">Amend Selected</label>
            <span id="testdata-status" class="import-progress-status" style="display:none;" aria-live="polite"></span>
            <span id="testdata-schema-error" class="generator-schema-error-text" aria-live="polite" role="status"></span>
        </div>
        <div class="test-data-schema-edit-zone">
            <div class="test-data-schema-grid-container" id="testDataSchemaGrid" class="ag-theme-alpine">
            </div>
            <div class="test-data-schema-text-container">
                <p>
                  Test Data Text Schema
                  <span
                    data-help="test-data-text-schema-help"
                    class="helpicon option-help-icon"
                  ></span>
                </p>
                <textarea class="testDataSchemaTextArea" name="testDataSchemaText" id="testDataSchemaText"></textarea>
            </div>
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
