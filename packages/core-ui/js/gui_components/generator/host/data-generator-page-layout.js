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
            <div id="generatorSchemaDefinition"></div>
          </section>

            <div id="generatorControlsRoot"></div>

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

export { GENERATE_TO_FILE_HELP_URL, renderDataGeneratorPageShell };
