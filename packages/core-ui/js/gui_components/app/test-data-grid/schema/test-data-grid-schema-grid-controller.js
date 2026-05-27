/*
 * Responsibilities:
 * - App-page host adapter for the shared schema-editor controller.
 */

import {
  createSharedSchemaEditorController,
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
} from '../../../shared/test-data/schema/index.js';

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
      <button type="button" class="testdata-schema-sample-button">Insert Example Schema</button>
    `;
  }

  return `
    <p><strong>Edit as Text</strong></p>
    <p>You are currently using row-based schema editing. Click <strong>Edit as Text</strong> to switch to text schema mode.</p>
    <button type="button" class="testdata-schema-sample-button">Insert Example Schema</button>
  `;
}

function createSchemaGridController({
  documentObj = document,
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
}) {
  let rowIdCounter = 1;
  const schemaEditor = createSharedSchemaEditorController({
    documentObj,
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
    onSchemaError: (message) => schemaTextSyncState?.schemaErrorDisplay?.show?.(message),
    onSchemaClear: () => schemaTextSyncState?.schemaErrorDisplay?.clear?.(),
    onSchemaParseError: () => setTestDataStatus?.('', false),
    updatePairwiseButtonVisibility,
    idMap: {
      generatorSchemaRows: 'testDataSchemaRows',
      generatorSchemaTextContainer: 'testDataSchemaTextContainer',
      generatorSchemaText: 'testDataSchemaText',
      addSchemaRowButton: 'testDataAddSchemaRowButton',
      schemaModeToggleButton: 'testDataSchemaModeToggleButton',
      schemaModeHelpIcon: 'testDataSchemaModeHelpIcon',
    },
  });

  function createTestDataGrid() {
    const container = documentObj.getElementById('testDataSchemaRows');
    container?.addEventListener('input', schemaEditor.handleInput);
    container?.addEventListener('change', schemaEditor.handleInput);
    container?.addEventListener('click', (event) => {
      void schemaEditor.handleClick(event);
    });

    const addButton = documentObj.getElementById('testDataAddSchemaRowButton');
    addButton?.addEventListener('click', (event) => {
      event.preventDefault();
      schemaEditor.addRow();
    });

    const modeToggleButton = documentObj.getElementById('testDataSchemaModeToggleButton');
    modeToggleButton?.addEventListener('click', (event) => {
      event.preventDefault();
      schemaEditor.toggleMode();
    });

    schemaEditor.init();
  }

  return {
    createTestDataGrid,
    populateGridFromTextSchema: () => schemaEditor.syncFromText({ showErrors: true, force: true }),
    syncSchemaTextFromGridBeforeGenerate: () => schemaEditor.syncTextFromRows(),
    insertSampleSchema: () => schemaEditor.insertSampleSchema(),
  };
}

export { createSchemaGridController };
