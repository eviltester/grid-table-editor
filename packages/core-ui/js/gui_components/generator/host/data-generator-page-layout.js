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

            <div id="generatorPreviewRoot"></div>
            </section>
        `;
}

export { GENERATE_TO_FILE_HELP_URL, renderDataGeneratorPageShell };
