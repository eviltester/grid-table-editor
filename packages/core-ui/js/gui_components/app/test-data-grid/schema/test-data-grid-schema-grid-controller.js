/*
 * Responsibilities:
 * - App-page host adapter for the shared schema-editor controller.
 */

import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../shared/test-data/schema/index.js';
import { createSharedSchemaDefinitionComponent } from '../../../shared/schema-definition/index.js';
import { getDefaultDocumentObj } from '../../../shared/dom/default-objects.js';

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
    headingClassName: 'generator-schema-heading-row',
    addButtonClassName: 'add-schema-row-button',
    // These IDs remain intentional app-page selector contracts because the
    // embedded schema editor still interoperates with focused harnesses,
    // browser page objects, and compatibility tests that target the app page
    // as a black-box host rather than the shared schema internals directly.
    ids: {
      rows: 'testDataSchemaRows',
      textContainer: 'testDataSchemaTextContainer',
      text: 'testDataSchemaText',
      addButton: 'testDataAddSchemaRowButton',
      toggleButton: 'testDataSchemaModeToggleButton',
      helpIcon: 'testDataSchemaModeHelpIcon',
      error: 'testdata-schema-error',
    },
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

function createSchemaGridController({
  documentObj = getDefaultDocumentObj(),
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaTextSyncState,
  updatePairwiseButtonVisibility,
  setTestDataStatus,
  faker,
  RandExp,
  getMethodPickerOptions = () => [],
  fakerCommands = [],
  getVisibleDomainCommandOptions = () => [],
  mapRuleToRow,
  validateSchemaRows,
}) {
  let schemaDefinition = null;

  function createTestDataGrid() {
    const root = documentObj.getElementById('testDataSchemaDefinition');
    schemaDefinition?.destroy?.();
    schemaDefinition = createSharedSchemaDefinitionComponent({
      root,
      documentObj,
      props: createAppSchemaDefinitionProps({
        schemaTextToDataRules,
        dataRulesToSchemaText,
        schemaTextSyncState,
        updatePairwiseButtonVisibility,
        faker,
        RandExp,
        getMethodPickerOptions,
        fakerCommands,
        getVisibleDomainCommandOptions,
        mapRuleToRow,
        validateSchemaRows,
      }),
      callbacks: {
        onSchemaError: (message) => schemaTextSyncState?.schemaErrorDisplay?.show?.(message),
        onSchemaClear: () => schemaTextSyncState?.schemaErrorDisplay?.clear?.(),
        onSchemaParseError: () => setTestDataStatus?.('', false),
      },
    });
  }

  return {
    destroy: () => schemaDefinition?.destroy?.(),
    createTestDataGrid,
    populateGridFromTextSchema: () => schemaDefinition?.syncFromText({ showErrors: true, force: true }),
    validateSchemaRows: ({ syncFromText = true } = {}) => {
      if (!syncFromText) {
        return schemaDefinition?.validateRows?.() || { rows: [], errors: [] };
      }
      const isTextMode = schemaDefinition?.getState?.()?.isTextMode === true;
      if (isTextMode) {
        const parsed = schemaDefinition?.syncFromText?.({ showErrors: true, force: true }) || { rows: [], errors: [] };
        if (parsed?.errors?.length > 0) {
          return parsed;
        }
      }
      return schemaDefinition?.validateRows?.() || { rows: [], errors: [] };
    },
    syncSchemaTextFromGridBeforeGenerate: () => schemaDefinition?.syncTextFromRows?.(),
    insertSampleSchema: () => schemaDefinition?.insertSampleSchema?.(),
  };
}

export { buildAppSchemaModeHelpHtml, createAppSchemaDefinitionProps, createSchemaGridController };
