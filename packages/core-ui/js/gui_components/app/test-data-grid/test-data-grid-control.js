/*
 * Responsibilities:
 * - Main controller for the test-data grid panel in the app page.
 * - Wires DOM events, grid editors, schema text sync triggers, and generation actions.
 * - Delegates command catalog logic and UI status behavior to focused helper modules.
 */

import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Debouncer } from '@anywaydata/core/utils/debouncer.js';
import { GridExtension as AgGridExtension } from '../../data-grid-editor/ag-grid/gridExtension-ag-grid.js';
import { GridExtension as TabulatorGridExtension } from '../../data-grid-editor/tabulator/gridExtension-tabulator.js';
import { SelectFilterEditor } from '../../data-grid-editor/ag-grid/select-filter-editor.js';
import { TEST_DATA_MODES, createAmendedTable, createTableFromGenerator, normaliseCount } from './test-data-amend.js';
import { schemaTextToDataRules, dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { TimedErrorDisplay } from '../../shared/timed-error-display.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  normaliseFakerCommand,
} from '../../shared/schema-row-rule-mapper.js';
import {
  FAKER_COMMANDS,
  DOMAIN_COMMANDS,
  FAKER_SECTION_VALUE,
  DOMAIN_SECTION_VALUE,
  findFakerCommand,
  extractDomainCommandAndParams,
  identifyFakerCommands,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
  getFakerCommands,
  getDomainCommands,
} from './test-data-type-catalog.js';
import {
  setTestDataStatus,
  clearPendingTestDataStatusReset,
  scheduleTestDataStatusReset,
  yieldToUi,
} from './test-data-ui-status.js';
import { createTestDataGenerationService } from './test-data-generation-service.js';

import { faker } from 'https://cdn.skypack.dev/@faker-js/faker@v9.7.0';

var debouncer = new Debouncer();
let importer = undefined;
let textPreviewRenderer = undefined;
let mainGridExtras = undefined;
let activeDefnCellEdit = null;
let schemaSampleButtonClickHandler = null;
let testDataSchemaErrorDisplay = null;
let schemaTextTokens = [];
let generationService = null;

function showTestDataSchemaError(message) {
  const text = String(message || '').trim();
  if (!text) {
    return;
  }
  testDataSchemaErrorDisplay?.show(text);
}

function getSchemaTextFromEditor() {
  const schemaTextArea = document.getElementById('testdatadefntext');
  if (!schemaTextArea) {
    return '';
  }
  return schemaTextArea.value || '';
}

function updatePairwiseButtonVisibility() {
  generationService?.updatePairwiseButtonVisibility?.();
}

async function generatePairwiseTestData() {
  await generationService?.generatePairwiseTestData?.();
}

async function generateTestData() {
  await generationService?.generateTestData?.();
}

async function refreshTestDataPreview() {
  await generationService?.refreshTestDataPreview?.({
    clearPendingStatusReset: clearPendingTestDataStatusReset,
    scheduleStatusReset: scheduleTestDataStatusReset,
  });
}

function syncSchemaTextFromGridBeforeGenerate() {
  // Tabulator keeps editor value in-flight until edit is committed; blur first so
  // clicking Generate while typing still captures the latest schema values.
  if (typeof document !== 'undefined' && typeof document.activeElement?.blur === 'function') {
    document.activeElement.blur();
  }

  if (defnGridBridge) {
    convertGridToText();
  }
}

function getMainGridExtras() {
  return mainGridExtras || importer?.gridExtensions;
}

function getGenerationMode() {
  const selectedOption = document.querySelector('input[name="testDataGenerationMode"]:checked');
  if (!selectedOption) {
    return TEST_DATA_MODES.NEW_TABLE;
  }
  return selectedOption.value;
}

function setGenerateCountToCurrentRows() {
  const gridExtras = getMainGridExtras();
  if (!gridExtras) {
    return;
  }
  document.getElementById('generateCount').value = gridExtras.getRowCount();
}

function setGenerateCountToSelectedRows() {
  const gridExtras = getMainGridExtras();
  if (!gridExtras) {
    return;
  }
  document.getElementById('generateCount').value = gridExtras.getSelectedRowIndexes().length;
}

function applyModeDefaultRowCount(mode) {
  if (mode === TEST_DATA_MODES.AMEND_TABLE) {
    setGenerateCountToCurrentRows();
    return;
  }
  if (mode === TEST_DATA_MODES.AMEND_SELECTED) {
    setGenerateCountToSelectedRows();
  }
}

function loadSampleSchemaIntoTextArea() {
  const schemaTextArea = document.getElementById('testdatadefntext');
  if (!schemaTextArea) {
    return;
  }

  schemaTextArea.value = `Literal Example
literal(Pending Review)
Enum Example
enum("Open","In Progress","Closed")
Enum Example 2
enum("High","Medium","Low")
Regex Example
[A-Z]{3}-\\d{4}
Faker Example
person.fullName`;
  populateTestDataGridFromRules();
}

function createTestDataGrid() {
  var gridDiv = document.querySelector('#defngrid');
  const editorPaneHeight = '220px';
  gridDiv.style.height = editorPaneHeight;
  gridDiv.style.width = '70%';
  setupTestDataEditGrid(gridDiv);

  var textEdit = document.querySelector('.defn-text-container');
  textEdit.style.width = defnGridApi ? '30%' : '100%';
  textEdit.style.paddingTop = '0';
  textEdit.style.height = editorPaneHeight;
  textEdit.style.display = 'flex';
  textEdit.style.flexDirection = 'column';

  const textHeading = textEdit.querySelector('p');
  if (textHeading) {
    textHeading.style.margin = '0 0 0.4rem 0';
  }

  const textArea = textEdit.querySelector('textarea');
  if (textArea) {
    textArea.style.flex = '1';
    textArea.style.width = '100%';
    textArea.style.height = '100%';
    textArea.style.boxSizing = 'border-box';
  }

  var zone = document.querySelector('.defn-edit-zone');
  zone.style.height = editorPaneHeight;
  zone.style.display = 'flex';
  zone.style.alignItems = 'flex-start';
  zone.style.gap = '0.75rem';
}

// todo: this all really needs to be wrapped in a class
var defnGridOptions;
var defnGridApi;
var defnGridExtras;
var defnGridBridge;

// populate Test Data Grid From Rules in Text Area
function populateTestDataGridFromRules() {
  if (!defnGridBridge) {
    return;
  }

  const schemaTextArea = document.getElementById('testdatadefntext');
  const parseResult = schemaTextToDataRules({
    schemaText: schemaTextArea?.value || '',
    faker,
    RandExp,
  });
  if (parseResult.errors.length > 0) {
    const errorText = generationService?.schemaErrorsToText?.(parseResult.errors) || '';
    showTestDataSchemaError(errorText);
    setTestDataStatus('', false);
    return;
  }

  // clear data then add rules
  defnGridBridge.clearRows();
  schemaTextTokens = Array.isArray(parseResult.schemaTokens) ? parseResult.schemaTokens : [];
  const leadingTextLinesByRuleIndex = [];
  if (schemaTextTokens.length > 0) {
    let pendingLeadingTextLines = [];
    let ruleIndex = 0;
    schemaTextTokens.forEach((token) => {
      if (token?.kind === 'comment' || token?.kind === 'blank') {
        pendingLeadingTextLines.push(String(token?.text ?? ''));
        return;
      }
      if (token?.kind === 'rule') {
        leadingTextLinesByRuleIndex[ruleIndex] = pendingLeadingTextLines.slice();
        pendingLeadingTextLines = [];
        ruleIndex += 1;
      }
    });
  }

  const rowsToAdd = [];
  for (const [ruleIndex, rule] of parseResult.dataRules.entries()) {
    rowsToAdd.push(mapDataRuleToGridRow(rule, leadingTextLinesByRuleIndex[ruleIndex] || []));
  }
  defnGridBridge.addRows(rowsToAdd);
  updatePairwiseButtonVisibility();
}

function mapDataRuleToGridRow(rule, leadingTextLines = []) {
  const data = {
    columnName: String(rule?.name ?? ''),
    comments: String(rule?.comments ?? ''),
    leadingTextLines: Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [],
    type: '',
    value: '',
  };
  if (rule?.type === SOURCE_TYPE_FAKER) {
    const fakerFreeRule = normaliseFakerCommand(rule.ruleSpec);
    const fakerCommand = findFakerCommand(fakerFreeRule);
    if (!fakerCommand) {
      data.type = '';
      data.value = fakerFreeRule;
      return data;
    }
    data.type = fakerCommand;
    data.value = fakerFreeRule.slice(fakerCommand.length);
    return data;
  }
  if (rule?.type === SOURCE_TYPE_DOMAIN) {
    const domainParts = extractDomainCommandAndParams(rule.ruleSpec);
    if (!domainParts.command) {
      data.type = '';
      data.value = String(rule?.ruleSpec ?? '').trim();
      return data;
    }
    data.type = domainParts.command;
    data.value = domainParts.params;
    return data;
  }
  if (rule?.type === SOURCE_TYPE_ENUM) {
    data.type = SOURCE_TYPE_ENUM;
    data.value = String(rule?.ruleSpec ?? '');
    return data;
  }
  if (rule?.type === SOURCE_TYPE_LITERAL) {
    data.type = SOURCE_TYPE_LITERAL;
    data.value = extractLiteralValueFromRuleSpec(rule?.ruleSpec);
    return data;
  }
  data.type = SOURCE_TYPE_REGEX;
  data.value = extractRegexValueFromRuleSpec(rule?.ruleSpec);
  return data;
}

/**
 * Helper function to safely probe a faker command and detect its return type.
 * Used during dropdown discovery to identify commands that return objects (unsuitable for literals).
 * @param {string} command - The faker command (e.g., 'airline.airplane')
 * @param {object} fakerLib - The faker library instance
 * @returns {string|null} 'primitive' if returns primitive, 'object' if returns object, null if error
 * @deprecated - This function is kept for backward compatibility but is no longer used
 */
function probeCommandReturnType(command, fakerLib) {
  try {
    // Execute command with no arguments, e.g., `faker.airline.airplane()`
    const fakerPrefix = 'this.';
    const commandToRun = `return ${fakerPrefix}${command}()`;
    const result = Function(commandToRun).bind(fakerLib)();

    // Classify return type
    const typeOfResult = typeof result;
    if (
      typeOfResult === 'string' ||
      typeOfResult === 'number' ||
      typeOfResult === 'boolean' ||
      typeOfResult === 'bigint'
    ) {
      return 'primitive';
    }
    if (typeOfResult === 'object' && result !== null && !(result instanceof Date) && !Array.isArray(result)) {
      return 'object';
    }
    return null; // null, undefined, function, or other unsupported type
  } catch {
    // Silently skip commands that error during probing
    return null;
  }
}

function tabulatorTypeSelectEditor(cell, onRendered, success, cancel) {
  const editor = document.createElement('select');
  editor.style.width = '100%';
  editor.style.boxSizing = 'border-box';
  let completed = false;

  const values = getTabulatorTypeEditorValues(cell.getValue());
  values.forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry.value;
    option.textContent = entry.label;
    if (entry.value === FAKER_SECTION_VALUE || entry.value === DOMAIN_SECTION_VALUE) {
      option.disabled = true;
    }
    editor.appendChild(option);
  });

  const currentValue = String(cell.getValue() ?? '').trim();
  editor.value = currentValue;

  onRendered(() => {
    editor.focus();
  });

  const finishEdit = () => {
    if (completed) {
      return;
    }
    const selectedValue = String(editor.value ?? '').trim();
    if (selectedValue === FAKER_SECTION_VALUE || selectedValue === DOMAIN_SECTION_VALUE) {
      completed = true;
      cancel();
      return;
    }
    completed = true;
    success(selectedValue);
  };

  editor.addEventListener('change', finishEdit);
  editor.addEventListener('blur', finishEdit);

  return editor;
}

function setupTestDataEditGrid(gridDiv) {
  const tableDiv = document.createElement('div');
  tableDiv.style.height = '160px';
  tableDiv.style.width = '100%';
  gridDiv.appendChild(tableDiv);

  const addNewRowButton = document.createElement('button');
  addNewRowButton.innerText = '+ Add Column';
  gridDiv.appendChild(addNewRowButton);

  const deleteRowsButton = document.createElement('button');
  deleteRowsButton.innerText = ' - Delete Selected';
  gridDiv.appendChild(deleteRowsButton);

  if (typeof agGrid !== 'undefined' && typeof agGrid.createGrid === 'function') {
    setupAgGridDefnEditor(tableDiv);
  } else if (typeof Tabulator !== 'undefined') {
    setupTabulatorDefnEditor(tableDiv);
  } else {
    console.warn('No supported grid library loaded; test data definition grid editor disabled.');
    return;
  }

  addNewRowButton.addEventListener('click', function () {
    if (!defnGridBridge) {
      return;
    }
    defnGridBridge.addRows([{ columnName: '', type: 'regex', value: '', comments: '' }]);
    convertGridToText();
  });

  deleteRowsButton.addEventListener('click', function () {
    if (!defnGridExtras) {
      return;
    }
    defnGridExtras.deleteSelectedRows();
    convertGridToText();
  });
}

function setupAgGridDefnEditor(tableDiv) {
  const defnRowData = [];
  const defnColumnDefs = [
    { field: 'columnName' },
    {
      field: 'type',
      cellEditor: SelectFilterEditor,
      cellEditorParams: (params) => ({ values: getAgGridTypeEditorValues(params?.value) }),
    },
    { field: 'value' },
  ];

  defnGridOptions = {
    columnDefs: defnColumnDefs,
    rowData: defnRowData,
    defaultColDef: {
      wrapText: true,
      autoHeight: true,
      resizable: true,
      editable: true,
      rowDrag: true,
      sortable: false,
    },
    suppressMovableColumns: true,
    rowDragManaged: true,
    rowDragMultiRow: true,
    rowSelection: {
      mode: 'multiRow',
      checkboxes: false,
      headerCheckbox: false,
      enableClickSelection: true,
    },
    onCellEditingStopped: () => {
      convertGridToText();
    },
    onRowDragEnd: () => {
      convertGridToText();
    },
  };

  tableDiv.classList.add('ag-theme-alpine');
  defnGridApi = agGrid.createGrid(tableDiv, defnGridOptions);
  defnGridExtras = new AgGridExtension(defnGridApi);
  defnGridBridge = {
    clearRows: () => defnGridApi.setGridOption('rowData', []),
    addRows: (rows) => {
      if (rows && rows.length > 0) {
        defnGridApi.applyTransaction({ add: rows });
      }
    },
    getRows: () => {
      const rows = [];
      // Respect the current visual order (including row drag reorder) when syncing to text schema.
      defnGridApi.forEachNodeAfterFilterAndSort((rowNode) => rows.push({ ...rowNode.data }));
      return rows;
    },
  };
}

function setupTabulatorDefnEditor(tableDiv) {
  defnGridApi = new Tabulator(tableDiv, {
    data: [],
    layout: 'fitColumns',
    columns: [
      { title: 'columnName', field: 'columnName', editor: 'input', headerSort: false, widthGrow: 1 },
      {
        title: 'type',
        field: 'type',
        editor: tabulatorTypeSelectEditor,
        headerSort: false,
        widthGrow: 1,
      },
      { title: 'value', field: 'value', editor: 'input', headerSort: false, widthGrow: 2 },
    ],
    selectableRows: true,
    selectableRowsRangeMode: 'click',
    movableRows: true,
    columnDefaults: { resizable: true },
    cellEditing: (cell) => {
      beginTabulatorDraftTracking(cell);
    },
    cellEdited: (cell) => {
      const field = cell?.getField?.() || cell?.getColumn?.()?.getDefinition?.()?.field;
      if (field === 'type') {
        const selectedValue = String(cell?.getValue?.() ?? '').trim();
        if (selectedValue === FAKER_SECTION_VALUE) {
          const previousValue = cell?.getOldValue?.();
          cell?.setValue?.(previousValue || '', true);
        }
      }
      convertGridToText();
    },
    rowMoved: () => {
      convertGridToText();
    },
  });

  tableDiv.addEventListener('focusout', () => {
    setTimeout(() => {
      clearTabulatorDraftTracking();
      convertGridToText();
    }, 0);
  });

  tableDiv.addEventListener('change', () => {
    setTimeout(() => {
      clearTabulatorDraftTracking();
      convertGridToText();
    }, 0);
  });

  defnGridExtras = new TabulatorGridExtension(defnGridApi);
  defnGridBridge = {
    clearRows: () => defnGridApi.setData([]),
    addRows: (rows) => {
      if (rows && rows.length > 0) {
        defnGridApi.addData(rows);
      }
    },
    getRows: () => defnGridApi.getData(),
  };
}

function beginTabulatorDraftTracking(cell) {
  setTimeout(() => {
    const editorElement = cell?.getElement?.()?.querySelector?.('input, select, textarea');
    const rowData = cell?.getRow?.()?.getData?.();
    const field = cell?.getField?.() || cell?.getColumn?.()?.getDefinition?.()?.field;
    if (!editorElement || !rowData || !field) {
      return;
    }

    activeDefnCellEdit = {
      field,
      rowData,
      value: editorElement.value ?? '',
    };

    const pushDraftValueToText = () => {
      if (activeDefnCellEdit?.rowData !== rowData || activeDefnCellEdit?.field !== field) {
        return;
      }
      activeDefnCellEdit.value = editorElement.value ?? '';
      convertGridToText();
    };

    editorElement.addEventListener('input', pushDraftValueToText);
    editorElement.addEventListener('change', pushDraftValueToText);
    pushDraftValueToText();
  }, 0);
}

function clearTabulatorDraftTracking() {
  activeDefnCellEdit = null;
}

function convertGridToText() {
  if (!defnGridBridge) {
    return;
  }

  const dataRules = [];
  defnGridBridge.getRows().forEach((rowData) => {
    const resolvedRowData =
      activeDefnCellEdit?.rowData === rowData
        ? { ...rowData, [activeDefnCellEdit.field]: activeDefnCellEdit.value }
        : rowData;

    const schemaRow = mapGridRowToSchemaRow(resolvedRowData);
    const ruleLine = buildRuleSpecFromSchemaRow(schemaRow);
    dataRules.push({
      name: String(resolvedRowData.columnName || ''),
      ruleSpec: String(ruleLine || ''),
      comments: String(resolvedRowData.comments ?? ''),
      leadingTextLines: Array.isArray(resolvedRowData.leadingTextLines)
        ? resolvedRowData.leadingTextLines.map((line) => String(line ?? ''))
        : [],
    });
  });

  const renderResult = dataRulesToSchemaText({ dataRules, schemaTokens: schemaTextTokens });
  document.getElementById('testdatadefntext').value = renderResult.text;
  updatePairwiseButtonVisibility();
}

function mapGridRowToSchemaRow(rowData) {
  const resolvedType = String(rowData?.type || '').trim();
  const lowerType = resolvedType.toLowerCase();
  if (lowerType === SOURCE_TYPE_REGEX) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_REGEX,
      value: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === SOURCE_TYPE_ENUM) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_ENUM,
      value: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === SOURCE_TYPE_LITERAL) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_LITERAL,
      value: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === FAKER_SECTION_VALUE || lowerType === DOMAIN_SECTION_VALUE) {
    return { name: String(rowData?.columnName || ''), sourceType: SOURCE_TYPE_REGEX, value: '' };
  }

  let dataType = resolvedType;
  if (dataType.startsWith('faker.')) {
    dataType = dataType.replace('faker.', '');
  }

  if (DOMAIN_COMMANDS.includes(dataType)) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_DOMAIN,
      command: dataType,
      params: String(rowData?.value ?? ''),
    };
  }
  if (FAKER_COMMANDS.includes(dataType)) {
    return {
      name: String(rowData?.columnName || ''),
      sourceType: SOURCE_TYPE_FAKER,
      command: dataType,
      params: String(rowData?.value ?? ''),
    };
  }
  if (lowerType === SOURCE_TYPE_FAKER) {
    return { name: String(rowData?.columnName || ''), sourceType: SOURCE_TYPE_FAKER, command: '', params: '' };
  }
  return { name: String(rowData?.columnName || ''), sourceType: SOURCE_TYPE_REGEX, value: '' };
}

function enableTestDataGenerationInterface(parentId, anImporter, aTextPreviewRenderer, aGridExtras) {
  // dynamically setup the faker commands from loaded library
  // and check for any changes
  identifyFakerCommands(faker);

  importer = anImporter;
  textPreviewRenderer = aTextPreviewRenderer;
  mainGridExtras = aGridExtras;
  generationService = createTestDataGenerationService({
    schemaTextToDataRules,
    TestDataGeneratorClass: TestDataGenerator,
    PairwiseTestDataGeneratorClass: PairwiseTestDataGenerator,
    GenericDataTableClass: GenericDataTable,
    TEST_DATA_MODES,
    normaliseCount,
    createTableFromGenerator,
    createAmendedTable,
    faker,
    RandExp,
    debouncer,
    syncSchemaTextFromGridBeforeGenerate,
    setTestDataStatus,
    showSchemaError: showTestDataSchemaError,
    yieldToUi,
    getSchemaText: getSchemaTextFromEditor,
    getImporter: () => importer,
    getTextPreviewRenderer: () => textPreviewRenderer,
    getMainGridExtras: () => getMainGridExtras(),
    getGenerationMode,
  });

  let parentElem = document.getElementById(parentId);
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
        <div class="defn-edit-zone">
            <div class="defn-grid-container" id="defngrid" class="ag-theme-alpine">
            </div>
            <div class="defn-text-container">
                <p>
                  Test Data Text Schema
                  <span
                    data-help="test-data-text-schema-help"
                    class="helpicon option-help-icon"
                  ></span>
                </p>
                <textarea class="testDataDefn" name="testdatadefntext" id="testdatadefntext"></textarea>
            </div>
        </div>
    `;

  var element = document.querySelector('#generatedata');
  element.addEventListener('click', generateTestData, false);
  document.querySelector('#generateallpairs').addEventListener('click', generatePairwiseTestData, false);
  document.querySelector('#refreshtestdatapreview').addEventListener('click', refreshTestDataPreview, false);
  const generateCountInput = document.getElementById('generateCount');
  generateCountInput.value = '1';
  generateCountInput.setAttribute('min', '1');
  generateCountInput.setAttribute('step', '1');
  generateCountInput.addEventListener('input', () => {
    const parsedCount = Number.parseInt(generateCountInput.value, 10);
    if (!Number.isFinite(parsedCount) || parsedCount < 1) {
      generateCountInput.value = '1';
    }
  });

  parentElem.querySelectorAll('input[name="testDataGenerationMode"]').forEach((modeRadio) => {
    modeRadio.addEventListener('change', () => {
      if (!modeRadio.checked) {
        return;
      }
      applyModeDefaultRowCount(modeRadio.value);
    });
  });

  createTestDataGrid();

  var inputarea = document.getElementById('testdatadefntext');
  testDataSchemaErrorDisplay = new TimedErrorDisplay({
    documentObj: document,
    elementId: 'testdata-schema-error',
    timeoutMs: 5000,
  });
  // https://stackoverflow.com/questions/2823733/textarea-onchange-detection/14029861?noredirect=1#comment19596202_14029861

  inputarea.addEventListener(
    'input',
    function () {
      // debounce a call to set the grid from the text area
      debouncer.debounce('populateTestDataGrid', populateTestDataGridFromRules, 1000);
    },
    false
  );

  if (schemaSampleButtonClickHandler) {
    document.removeEventListener('click', schemaSampleButtonClickHandler);
  }
  schemaSampleButtonClickHandler = (event) => {
    if (!event.target.closest('.testdata-schema-sample-button')) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    loadSampleSchemaIntoTextArea();
  };
  document.addEventListener('click', schemaSampleButtonClickHandler);

  if (typeof window !== 'undefined' && typeof window.updateHelpHints === 'function') {
    window.updateHelpHints();
  }
}

export {
  enableTestDataGenerationInterface,
  probeCommandReturnType,
  identifyFakerCommands,
  getFakerCommands,
  getDomainCommands,
  getTabulatorTypeEditorValues,
  getAgGridTypeEditorValues,
};

/**
 * Getter function for FAKER_COMMANDS array (for testing purposes).
 * @returns {string[]} Array of discovered faker commands
 */
