/*
 * Responsibilities:
 * - App-page host adapter props for the shared schema-editor component.
 */

import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../shared/test-data/schema/index.js';

function buildAppSchemaModeHelpHtml({ inTextMode }) {
  if (inTextMode) {
    return `
      <p><strong>Edit as Schema</strong></p>
      <p>You are currently editing as text. Click <strong>Edit as Schema</strong> to return to row-based editing.</p>
      <p>Text schema uses name/rule pairs, for example:</p>
      <pre>First Name
person.firstName

Status
enum(active,inactive,pending)</pre>
      <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
    `;
  }

  return `
    <p><strong>Edit as Text</strong></p>
    <p>You are currently using row-based schema editing. Click <strong>Edit as Text</strong> to switch to text schema mode.</p>
    <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
  `;
}

function createAppSchemaDefinitionProps({
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaTextSyncState,
  updatePairwiseButtonVisibility,
  faker,
  RandExp,
  getMethodPickerOptions = () => [],
  fakerCommands = [],
  getVisibleDomainCommandOptions = () => [],
  mapRuleToRow,
  validateSchemaRows,
} = {}) {
  let rowIdCounter = 1;

  return {
    addButtonClassName: 'add-schema-row-button',
    schemaTextToDataRules,
    dataRulesToSchemaText,
    faker,
    RandExp,
    createBlankRow: () => ({
      id: `test-data-schema-row-${rowIdCounter++}`,
      name: '',
      sourceType: 'regex',
      command: '',
      params: '',
      value: '',
      comments: '',
      leadingTextLines: [],
    }),
    mapRuleToRow,
    getMethodPickerOptions,
    getVisibleDomainCommands: (currentCommand) =>
      getVisibleDomainCommandOptions(currentCommand).map((entry) => entry.value),
    fakerCommands,
    sampleSchemaText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
    buildModeHelpHtml: buildAppSchemaModeHelpHtml,
    schemaErrorDisplay: schemaTextSyncState?.schemaErrorDisplay,
    validateSchemaRows,
    updatePairwiseButtonVisibility,
  };
}

export { buildAppSchemaModeHelpHtml, createAppSchemaDefinitionProps };
