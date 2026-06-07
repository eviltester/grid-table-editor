/*
 * Responsibilities:
 * - App-page host adapter props for the shared schema-editor component.
 */

import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../shared/test-data/schema/schema-examples.js';
import { buildSchemaModeHelpHtml } from '../../../shared/test-data/help/schema-mode-help-builder.js';

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
    buildModeHelpHtml: buildSchemaModeHelpHtml,
    schemaErrorDisplay: schemaTextSyncState?.schemaErrorDisplay,
    validateSchemaRows,
    updatePairwiseButtonVisibility,
  };
}

export { createAppSchemaDefinitionProps };
