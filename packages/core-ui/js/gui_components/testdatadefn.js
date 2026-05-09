/*
  Definition data is of the format:

  rulename
  regex
  rulename
  regex

 */

/*
  Useful Regex Templates:

  https://projects.lukehaas.me/regexhub/
  https://www.regular-expressions.info/examples.html
  http://fent.github.io/randexp.js/

 */

// TODO :wrap this as a class and make components
// Also this is too AG Grid specific

import { TestDataGenerator } from '@anywaydata/core/data_generation/testDataGenerator.js';
import { Debouncer } from '@anywaydata/core/utils/debouncer.js';
import { GridExtension as AgGridExtension } from './data-grid-editor/ag-grid/gridExtension-ag-grid.js';
import { GridExtension as TabulatorGridExtension } from './data-grid-editor/tabulator/gridExtension-tabulator.js';
import { SelectFilterEditor } from './data-grid-editor/ag-grid/select-filter-editor.js';
import { TEST_DATA_MODES, createAmendedTable, createTableFromGenerator, normaliseCount } from './test-data-amend.js';
import { getKnownFakerCommandsAlphabetical, getKnownFakerCommandsLongestFirst } from './faker-commands.js';
import { PairwiseTestDataGenerator } from '@anywaydata/core/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

import { faker } from 'https://cdn.skypack.dev/@faker-js/faker@v9.7.0';

var debouncer = new Debouncer();
let importer = undefined;
let textPreviewRenderer = undefined;
let mainGridExtras = undefined;
let testDataStatusResetTimeoutId = null;
let activeDefnCellEdit = null;
let schemaSampleButtonClickHandler = null;

function getRulesParserFromTextArea() {
  // faker imported in script.js
  // RandExp brought in via index.html script
  const generator = new TestDataGenerator(faker, RandExp);
  const schemaTextArea = document.getElementById('testdatadefntext');
  if (!schemaTextArea) {
    generator.importSpec('');
    generator.compile();
    return generator;
  }
  const areaText = schemaTextArea.value;
  generator.importSpec(areaText);
  generator.compile();
  console.log(generator.compilationReport());

  return generator;
}

// https://www.npmjs.com/package/randexp
async function generatePairwiseTestData() {
  debouncer.clear('populateTestDataGrid');
  syncSchemaTextFromGridBeforeGenerate();
  const generateButton = document.getElementById('generateallpairs');
  setTestDataStatus('Generating pairwise...', true);
  if (generateButton) {
    generateButton.disabled = true;
  }

  try {
    const generator = getRulesParserFromTextArea();

    if (!generator.isValid()) {
      console.log(generator.errors());
      alert(generator.errors().join('\n'));
      setTestDataStatus('Schema validation failed.', false);
      return;
    }

    const enumCount = countEnumRules(generator.testDataRules());
    if (enumCount < 2) {
      alert('Pairwise generation requires at least 2 enum columns.');
      setTestDataStatus('Insufficient enum columns.', false);
      return;
    }

    await yieldToUi();
    setTestDataStatus('Generating pairwise combinations...', true);
    await yieldToUi();

    const dataTable = createPairwiseTableFromGenerator(generator);
    if (!dataTable) {
      alert('Failed to generate pairwise data.');
      setTestDataStatus('Pairwise generation failed.', false);
      return;
    }

    if (dataTable) {
      setTestDataStatus('Applying data to grid...', true);
      await yieldToUi();
      await Promise.resolve(importer.setGridFromGenericDataTable(dataTable));
    }

    setTestDataStatus(`Generated ${dataTable.getRowCount()} pairwise combinations.`, false);
    await yieldToUi();
  } catch (error) {
    console.error('Pairwise generation error:', error);
    alert(`Pairwise generation failed: ${error.message}`);
    setTestDataStatus('Pairwise generation failed.', false);
  } finally {
    if (generateButton) {
      generateButton.disabled = false;
    }
  }
}

function createPairwiseTableFromGenerator(generator) {
  try {
    // Pass the same faker and RandExp instances used by the main generator
    const pairwiseGenerator = new PairwiseTestDataGenerator(faker, RandExp);
    const initResult = pairwiseGenerator.initializeFromRules(generator.testDataRules());

    if (initResult.isError) {
      console.error('Pairwise initialization error:', initResult.errorMessage);
      return null;
    }

    const dataResult = pairwiseGenerator.generateAllDataRecordsAsRows();
    if (dataResult.isError) {
      console.error('Pairwise generation error:', dataResult.errorMessage);
      return null;
    }

    // Convert to the expected data table format
    const dataTable = new GenericDataTable();
    const [headers, ...rows] = dataResult.data.data; // Access the nested data array
    dataTable.setHeaders(headers);
    rows.forEach((row) => {
      dataTable.appendDataRow(row);
    });

    return dataTable;
  } catch (error) {
    console.error('Pairwise table creation error:', error);
    return null;
  }
}

function countEnumRules(rules) {
  return rules.filter((rule) => rule.type === 'enum').length;
}

function updatePairwiseButtonVisibility() {
  const generator = getRulesParserFromTextArea();
  if (!generator.isValid()) {
    hidePairwiseButton();
    return;
  }

  const enumCount = countEnumRules(generator.testDataRules());
  if (enumCount >= 2) {
    showPairwiseButton();
  } else {
    hidePairwiseButton();
  }
}

function showPairwiseButton() {
  const button = document.getElementById('generateallpairs');
  if (button) {
    button.style.display = '';
  }
}

function hidePairwiseButton() {
  const button = document.getElementById('generateallpairs');
  if (button) {
    button.style.display = 'none';
  }
}

async function generateTestData() {
  debouncer.clear('populateTestDataGrid');
  syncSchemaTextFromGridBeforeGenerate();
  const generateButton = document.getElementById('generatedata');
  setTestDataStatus('Validating schema...', true);
  if (generateButton) {
    generateButton.disabled = true;
  }

  try {
    const desiredRowCountRaw = document.getElementById('generateCount').value;
    const desiredRowCountParsed = Number.parseInt(desiredRowCountRaw, 10);
    const desiredRowCount = normaliseCount(desiredRowCountRaw);
    const generationMode = getGenerationMode();

    const generator = getRulesParserFromTextArea();

    if (!generator.isValid()) {
      console.log(generator.errors());
      alert(generator.errors().join('\n'));
      setTestDataStatus('Schema validation failed.', false);
      return;
    }

    if (!Number.isFinite(desiredRowCountParsed) || desiredRowCountParsed < 0) {
      alert('Enter how many rows to generate.');
      setTestDataStatus('Invalid row count.', false);
      return;
    }

    await yieldToUi();
    setTestDataStatus(
      generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generating rows...' : 'Preparing table amend...',
      true
    );
    await yieldToUi();

    let dataTable;
    if (generationMode === TEST_DATA_MODES.NEW_TABLE) {
      dataTable = createTableFromGenerator(desiredRowCount, generator);
    } else {
      const gridExtras = getMainGridExtras();
      if (!gridExtras) {
        alert('Grid interface unavailable for amend mode.');
        setTestDataStatus('Grid interface unavailable.', false);
        return;
      }

      const selectedRowIndexes =
        generationMode === TEST_DATA_MODES.AMEND_SELECTED ? gridExtras.getSelectedRowIndexes() : [];

      // Fast path for Tabulator (and any engine that supports direct amend):
      // update only targeted rows/columns without full table export/import.
      if (typeof gridExtras.applyGeneratedSchemaAmend === 'function') {
        setTestDataStatus('Amending rows...', true);
        await yieldToUi();
        const directAmendResult = await Promise.resolve(
          gridExtras.applyGeneratedSchemaAmend({
            mode: generationMode,
            desiredRowCount,
            schemaHeaders: generator.generateHeadersArray(),
            generateRow: () => generator.generateRow(),
            selectedRowIndexes,
          })
        );

        if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && directAmendResult?.noSelectedRows) {
          alert('No rows selected.');
          setTestDataStatus('No selected rows to amend.', false);
          return;
        }

        dataTable = null;
      } else {
        const currentDataTable = gridExtras.getGridAsGenericDataTable();
        const amendResult = createAmendedTable({
          mode: generationMode,
          desiredRowCount,
          generator,
          currentDataTable,
          selectedRowIndexes,
        });

        if (generationMode === TEST_DATA_MODES.AMEND_SELECTED && amendResult.noSelectedRows) {
          alert('No rows selected.');
          setTestDataStatus('No selected rows to amend.', false);
          return;
        }

        dataTable = amendResult.dataTable;
      }
    }

    if (dataTable) {
      setTestDataStatus('Applying data to grid...', true);
      await yieldToUi();
      await Promise.resolve(importer.setGridFromGenericDataTable(dataTable));
    }

    const completedModeLabel = generationMode === TEST_DATA_MODES.NEW_TABLE ? 'Generate' : 'Amend';
    setTestDataStatus(`${completedModeLabel} complete. Refresh text preview if needed.`, false);
  } catch (error) {
    console.error('Generate/amend failed', error);
    setTestDataStatus('Generate failed. Check console for details.', false);
    alert('Generate failed. Check console for details.');
  } finally {
    if (generateButton) {
      generateButton.disabled = false;
    }
  }
}

async function refreshTestDataPreview() {
  if (!textPreviewRenderer) {
    return;
  }
  const refreshButton = document.getElementById('refreshtestdatapreview');
  clearPendingTestDataStatusReset();
  setTestDataStatus('Refreshing text preview...', true);
  if (refreshButton) {
    refreshButton.disabled = true;
  }

  try {
    await yieldToUi();
    await Promise.resolve(textPreviewRenderer.renderTextFromGrid());
    setTestDataStatus('Text preview refreshed.', false);
    scheduleTestDataStatusReset();
  } catch (error) {
    console.error('Failed to refresh text preview', error);
    setTestDataStatus('Text preview refresh failed. Check console for details.', false);
  } finally {
    if (refreshButton) {
      refreshButton.disabled = false;
    }
  }
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

function setTestDataStatus(message, isLoading) {
  const statusElement = document.getElementById('testdata-status');
  if (!statusElement) {
    return;
  }
  statusElement.textContent = message || '';
  statusElement.style.display = message ? 'inline-block' : 'none';
  statusElement.classList.toggle('is-loading', isLoading === true);
}

function clearPendingTestDataStatusReset() {
  if (testDataStatusResetTimeoutId === null) {
    return;
  }
  clearTimeout(testDataStatusResetTimeoutId);
  testDataStatusResetTimeoutId = null;
}

function scheduleTestDataStatusReset(delayMs = 1800) {
  clearPendingTestDataStatusReset();
  testDataStatusResetTimeoutId = setTimeout(() => {
    setTestDataStatus('', false);
    testDataStatusResetTimeoutId = null;
  }, delayMs);
}

function yieldToUi() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame !== 'function') {
      setTimeout(resolve, 0);
      return;
    }
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}

function loadSampleSchemaIntoTextArea() {
  const schemaTextArea = document.getElementById('testdatadefntext');
  if (!schemaTextArea) {
    return;
  }

  schemaTextArea.value = `Literal Example
Pending Review
Enum Example
enum("Open","In Progress","Closed")
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

  const generator = getRulesParserFromTextArea();

  if (!generator.isValid()) {
    return;
  }

  // clear data then add rules
  defnGridBridge.clearRows();

  const rowsToAdd = [];
  for (let rule of generator.testDataRules()) {
    let data = {};
    data.columnName = rule.name;
    data.comments = String(rule.comments ?? '');
    if (rule.type == 'faker') {
      // remove faker.
      let fakerFreeRule = rule.ruleSpec;
      if (fakerFreeRule.startsWith('faker.')) {
        fakerFreeRule = fakerFreeRule.replace('faker.', '');
      }
      const fakerCommand = findFakerCommand(fakerFreeRule);
      if (fakerCommand == '') {
        console.log(`Unknown faker command in ruleSpec ${fakerFreeRule}`);
        data.type = '';
        data.value = fakerFreeRule;
      } else {
        data.type = fakerCommand;
        data.value = fakerFreeRule.replace(fakerCommand, '');
      }
    } else if (rule.type == 'enum') {
      data.type = 'enum';
      data.value = rule.ruleSpec;
    } else {
      data.type = 'RegEx';
      data.value = rule.ruleSpec;
    }

    rowsToAdd.push(data);
  }
  defnGridBridge.addRows(rowsToAdd);
  updatePairwiseButtonVisibility();
}

const FAKER_COMMANDS = [];
const FAKER_COMMANDS_LONGEST_FIRST = [];

// TODO: add fakerCommand to the TestDataRule already parsed out
function findFakerCommand(aString) {
  for (let command of FAKER_COMMANDS_LONGEST_FIRST) {
    if (aString.startsWith(command)) {
      return command;
    }
  }
  return null;
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
  } catch (e) {
    // Silently skip commands that error during probing
    return null;
  }
}

function identifyFakerCommands() {
  FAKER_COMMANDS.length = 0;
  FAKER_COMMANDS_LONGEST_FIRST.length = 0;

  getKnownFakerCommandsAlphabetical().forEach((command) => FAKER_COMMANDS.push(command));
  getKnownFakerCommandsLongestFirst().forEach((command) => FAKER_COMMANDS_LONGEST_FIRST.push(command));
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
    defnGridBridge.addRows([{ columnName: '', type: 'RegEx', value: '', comments: '' }]);
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
      cellEditorParams: { values: FAKER_COMMANDS },
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
      defnGridApi.forEachNode((rowNode) => rows.push({ ...rowNode.data }));
      return rows;
    },
  };
}

function setupTabulatorDefnEditor(tableDiv) {
  defnGridApi = new Tabulator(tableDiv, {
    data: [],
    columns: [
      { title: 'columnName', field: 'columnName', editor: 'input' },
      {
        title: 'type',
        field: 'type',
        editor: 'list',
        editorParams: { values: FAKER_COMMANDS },
      },
      { title: 'value', field: 'value', editor: 'input' },
    ],
    selectableRows: true,
    movableRows: true,
    columnDefaults: { resizable: true },
    cellEditing: (cell) => {
      beginTabulatorDraftTracking(cell);
    },
    cellEdited: () => {
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

  const outputLines = [];
  defnGridBridge.getRows().forEach((rowData) => {
    const resolvedRowData =
      activeDefnCellEdit?.rowData === rowData
        ? { ...rowData, [activeDefnCellEdit.field]: activeDefnCellEdit.value }
        : rowData;
    const leadingComments = String(resolvedRowData.comments ?? '');
    if (leadingComments.length > 0) {
      outputLines.push(...leadingComments.split('\n'));
    }

    outputLines.push(resolvedRowData.columnName || '');

    let ruleLine = '';
    switch (resolvedRowData.type) {
      case 'RegEx':
        ruleLine = resolvedRowData.value || '';
        break;
      case 'enum':
        ruleLine = resolvedRowData.value || '';
        break;
      // TODO Literal
      default: {
        let dataType = resolvedRowData.type || '';
        if (dataType.startsWith('faker.')) {
          dataType = dataType.replace('faker.', '');
        }
        if (FAKER_COMMANDS.includes(dataType)) {
          ruleLine = dataType + (resolvedRowData.value || '');
        } else {
          // throw error? ignore? don't know what the command is so it won't parse
          // ignoring
          console.log(`UNKNOWN COMMAND: ${dataType} ${resolvedRowData.value}`);
        }
      }
    }
    outputLines.push(ruleLine);
  });

  document.getElementById('testdatadefntext').value = outputLines.join('\n');
  updatePairwiseButtonVisibility();
}

function enableTestDataGenerationInterface(parentId, anImporter, aTextPreviewRenderer, aGridExtras) {
  // dynamically setup the faker commands from loaded library
  // and check for any changes
  identifyFakerCommands(faker);

  importer = anImporter;
  textPreviewRenderer = aTextPreviewRenderer;
  mainGridExtras = aGridExtras;

  let parentElem = document.getElementById(parentId);
  parentElem.innerHTML = `
        <div>
            <button id="generatedata">Generate</button>
            <button id="generateallpairs" style="display:none;">Generate Pairwise</button>
            <button id="refreshtestdatapreview">Refresh Text Preview</button>
            <label> How Many?<input type="number" id="generateCount"/></label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.NEW_TABLE}" checked>New Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_TABLE}">Amend Table</label>
            <label><input type="radio" name="testDataGenerationMode" value="${TEST_DATA_MODES.AMEND_SELECTED}">Amend Selected</label>
            <span id="testdata-status" class="import-progress-status" style="display:none;" aria-live="polite"></span>
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

export { enableTestDataGenerationInterface, probeCommandReturnType, identifyFakerCommands, getFakerCommands };

/**
 * Getter function for FAKER_COMMANDS array (for testing purposes).
 * @returns {string[]} Array of discovered faker commands
 */
function getFakerCommands() {
  return [...FAKER_COMMANDS];
}
