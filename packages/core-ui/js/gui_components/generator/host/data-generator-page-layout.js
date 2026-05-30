/*
 * Responsibilities:
 * - Generator page shell HTML and output format select population.
 * - Keeps static generator-page markup out of the controller entrypoint.
 */

const GENERATE_TO_FILE_HELP_URL = 'https://anywaydata.com/docs/test-data/generate-to-file';

function renderDataGeneratorPageShell({ parentElement }) {
  parentElement.innerHTML = `
        <section class="generator-page" aria-label="Data Generator">
          <section class="generator-schema" id="generatorSchemaSection" data-section-order="2" aria-labelledby="generatorSchemaHeading">
                    <div class="generator-schema-head">
              <strong id="generatorSchemaHeading">Schema</strong>
                        <span id="generatorSchemaErrorText" class="generator-schema-error-text" aria-live="polite" role="status"></span>
                        <span class="generator-button-with-help">
                          <span id="schemaModeHelpIcon" class="helpicon" data-help="generator-schema-mode-help"></span>
                          <button id="schemaModeToggleButton" class="icon-button" title="Toggle schema text mode">Edit as Text</button>
                        </span>
                    </div>
                    <div id="generatorSchemaRows" class="generator-schema-rows"></div>
                    <div id="generatorSchemaTextContainer" class="generator-schema-text">
                        <textarea id="generatorSchemaText" class="testDataSchemaTextArea" placeholder="Column Name&#10;rule&#10;Column Name&#10;rule"></textarea>
                    </div>
                    <div class="generator-schema-footer">
                        <button id="addSchemaRowButton" title="Add field">+ Add Field</button>
                    </div>
          </section>

            <section class="generator-controls" id="generatorGenerateOptionsSection" data-section-order="3" aria-labelledby="generatorGenerateOptionsHeading">
                      <div class="generator-controls-head">
              <strong id="generatorGenerateOptionsHeading">Generate Data and Options</strong>
                      </div>
                      <div id="generateRowsCountControl"></div>
                      <label>Output Format
                        <select id="generatorOutputFormat"></select>
                      </label>
                      <span class="generator-button-with-help">
                        <span
                          class="helpicon"
                          data-help="generator-generate-data-help"
                          data-help-text='
                            <p>Generate Data for currently defined rows and output format to file.</p>
                            <p><a class="helplink" href="https://anywaydata.com/docs/test-data/generate-to-file" target="_blank" rel="noopener noreferrer">Generate To File docs</a></p>
                          '
                        ></span>
                        <button id="generateDataButton"><span class="generator-file-icon" aria-hidden="true"></span>Generate Data</button>
                      </span>
                      <span class="generator-button-with-help" id="generateAllPairsButtonWrapper" style="display:none;">
                        <span
                          class="helpicon"
                          data-help="generator-pairwise-help"
                          data-help-text='
                            <p>Generate Pairwise Data from schema to a file.</p>
                            <p><a class="helplink" href="https://anywaydata.com/docs/test-data/pairwise-testing" target="_blank" rel="noopener noreferrer">Pairwise testing docs</a></p>
                          '
                        ></span>
                        <button id="generateAllPairsButton"><span class="generator-file-icon" aria-hidden="true"></span>Generate Pairwise</button>
                      </span>
                      <div class="generator-options-wrapper">
                        <div id="generatorOptionsPanel" class="generator-options-panel"></div>
                        <div id="generatorStatusText" class="generator-status-text" aria-live="polite" role="status"></div>
                      </div>
                    </section>

                <section class="generator-preview" id="generatorPreviewSection" data-section-order="4" aria-labelledby="generatorPreviewHeading">
                    <div class="generator-preview-head">
                        <strong id="generatorPreviewHeading">Preview</strong>
                    </div>
                      <div class="generator-preview-controls" id="generatorPreviewControlsSection" data-subsection-order="1" aria-label="Preview Controls">
                        <div id="previewRowsCountControl"></div>
                        <span class="generator-button-with-help">
                          <span
                            class="helpicon"
                            data-help="generator-preview-help"
                            data-help-text='
                              <p>Show a preview of the defined items count in the Output Preview area.</p>
                            '
                          ></span>
                          <button id="previewDataButton">Preview</button>
                        </span>
                      </div>
                      <div class="generator-output-preview" id="generatorOutputPreviewSection" data-subsection-order="2" aria-label="Output Preview">
                        <label for="generatorOutputPreview">Output Preview</label>
                        <textarea id="generatorOutputPreview" readonly spellcheck="false"></textarea>
                      </div>
                      <div class="generator-data-table-preview" id="generatorDataTablePreviewSection" data-subsection-order="3" aria-label="Data Table Preview">
                        <label for="generator-preview-grid">Data Table Preview</label>
                        <div id="generator-preview-grid" class="ag-theme-alpine"></div>
                      </div>
                </section>
            </section>
        `;
}

function populateGeneratorFormatOptions({ documentObj, exporter, getOutputFormatGroupsFn }) {
  const outputSelect = documentObj.getElementById('generatorOutputFormat');
  if (!outputSelect) {
    return;
  }

  const formatGroups = getOutputFormatGroupsFn();
  formatGroups.core.forEach(({ type, label }) => {
    if (!exporter?.canExport?.(type) && exporter) {
      return;
    }
    const option = documentObj.createElement('option');
    option.value = type;
    option.textContent = label;
    outputSelect.appendChild(option);
  });

  const codeGroup = documentObj.createElement('optgroup');
  codeGroup.label = '-- Code --';
  formatGroups.code.forEach(({ type, label }) => {
    if (!exporter?.canExport?.(type) && exporter) {
      return;
    }
    const option = documentObj.createElement('option');
    option.value = type;
    option.textContent = label;
    codeGroup.appendChild(option);
  });
  if (codeGroup.children.length > 0) {
    outputSelect.appendChild(codeGroup);
  }

  const unitTestCodeGroup = documentObj.createElement('optgroup');
  unitTestCodeGroup.label = '-- Code (Unit Test) --';
  formatGroups.unitTest.forEach(({ type, label }) => {
    if (!exporter?.canExport?.(type) && exporter) {
      return;
    }
    const option = documentObj.createElement('option');
    option.value = type;
    option.textContent = label;
    unitTestCodeGroup.appendChild(option);
  });
  if (unitTestCodeGroup.children.length > 0) {
    outputSelect.appendChild(unitTestCodeGroup);
  }

  outputSelect.value = 'csv';
}

export { GENERATE_TO_FILE_HELP_URL, renderDataGeneratorPageShell, populateGeneratorFormatOptions };
