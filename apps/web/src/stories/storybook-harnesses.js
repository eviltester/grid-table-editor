import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createTestDataGridControl } from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/index.js';
import { ImportExportControls } from '../../../../packages/core-ui/js/gui_components/app/import-export-controls.js';
import { TabbedTextControl } from '../../../../packages/core-ui/js/gui_components/app/tabbed-text-control.js';
import { DataGeneratorPage } from '../../../../packages/core-ui/js/gui_components/generator/index.js';
import {
  getCodeLanguageSubtasks,
  getUnitTestLanguageSubtasks,
} from '../../../../packages/core-ui/js/gui_components/generator/options/index.js';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/index.js';

let storySurfaceCounter = 0;

class ImmediateDebouncer {
  debounce(_name, callback) {
    callback();
  }

  clear() {}
}

class StoryTabulator {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
}

class StoryPreviewGrid {
  constructor() {
    this.lastDataTable = null;
  }

  setGridFromGenericDataTable(dataTable) {
    this.lastDataTable = cloneGenericDataTable(dataTable);
  }

  getGridAsGenericDataTable() {
    return cloneGenericDataTable(this.lastDataTable);
  }

  getHeadersFromGrid() {
    return this.lastDataTable?.getHeaders?.() || [];
  }
}

const DIRECT_EXPORT_FORMATS = new Set([
  'markdown',
  'csv',
  'dsv',
  'json',
  'jsonl',
  'xml',
  'sql',
  'gherkin',
  'html',
  'asciitable',
]);

const CODE_EXPORT_FORMATS = new Set(getCodeLanguageSubtasks().map((subtask) => subtask.type));
const UNIT_TEST_EXPORT_FORMATS = new Set(
  getUnitTestLanguageSubtasks().flatMap((subtask) => subtask.types || [subtask.type])
);

const EXPORT_FORMAT_STORY_LABELS = {
  markdown: 'Markdown',
  csv: 'CSV',
  dsv: 'Delimited',
  json: 'JSON',
  jsonl: 'JSONL',
  xml: 'XML',
  sql: 'SQL',
  javascript: 'Code JavaScript',
  jest: 'Code Unit Test Jest',
  gherkin: 'Gherkin',
  html: 'HTML',
  asciitable: 'ASCII',
};

function createStorySurface(sectionName) {
  storySurfaceCounter += 1;
  const section = document.createElement('section');
  section.className = 'main-app';
  section.dataset.storySurface = `${sectionName}-${storySurfaceCounter}`;
  return section;
}

function withScopedDocument(surface, callback) {
  if (!surface || typeof callback !== 'function') {
    return callback?.();
  }

  const originalQuerySelector = document.querySelector.bind(document);
  const originalQuerySelectorAll = document.querySelectorAll.bind(document);
  const originalGetElementById = document.getElementById.bind(document);

  document.querySelector = (selector) => surface.querySelector(selector) || originalQuerySelector(selector);
  document.querySelectorAll = (selector) => {
    const scopedMatches = surface.querySelectorAll(selector);
    return scopedMatches.length > 0 ? scopedMatches : originalQuerySelectorAll(selector);
  };
  document.getElementById = (id) => surface.querySelector(`#${id}`) || originalGetElementById(id);

  try {
    return callback();
  } finally {
    document.querySelector = originalQuerySelector;
    document.querySelectorAll = originalQuerySelectorAll;
    document.getElementById = originalGetElementById;
  }
}

function cloneGenericDataTable(sourceTable, maxRows) {
  const cloned = new GenericDataTable();
  if (!sourceTable) {
    return cloned;
  }

  cloned.setHeaders(sourceTable.getHeaders?.() || []);
  const rowCount = sourceTable.getRowCount?.() || 0;
  const limit = Number.isFinite(maxRows) ? Math.min(rowCount, Math.max(0, Math.floor(maxRows))) : rowCount;
  for (let rowIndex = 0; rowIndex < limit; rowIndex += 1) {
    cloned.appendDataRow([...(sourceTable.getRow?.(rowIndex) || [])]);
  }
  return cloned;
}

function createSampleGridData() {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(['First Name', 'Last Name', 'Department', 'Role', 'Status']);
  dataTable.appendDataRow(['Ava', 'Nguyen', 'Engineering', 'QA Engineer', 'Active']);
  dataTable.appendDataRow(['Liam', 'Patel', 'Sales', 'Account Executive', 'Onboarding']);
  dataTable.appendDataRow(['Noah', 'Carter', 'Finance', 'Analyst', 'Active']);
  dataTable.appendDataRow(['Mia', 'Roberts', 'Support', 'Team Lead', 'On Leave']);
  dataTable.appendDataRow(['Ezra', 'Kim', 'Design', 'Researcher', 'Active']);
  dataTable.appendDataRow(['Sofia', 'Brooks', 'Operations', 'Coordinator', 'Paused']);
  dataTable.appendDataRow(['Owen', 'Price', 'Security', 'Engineer', 'Escalated']);
  dataTable.appendDataRow(['Chloe', 'Ward', 'Legal', 'Counsel', 'Review']);
  dataTable.appendDataRow(['Ivy', 'Flores', 'Marketing', 'Manager', 'Active']);
  dataTable.appendDataRow(['Leo', 'Hayes', 'Data', 'Scientist', 'Pilot']);
  dataTable.appendDataRow(['Nora', 'Bell', 'Product', 'Owner', 'Backlog']);
  dataTable.appendDataRow(['Mason', 'Gray', 'Support', 'Specialist', 'Resolved']);
  return dataTable;
}

class StoryMemoryGrid {
  constructor(initialTable = new GenericDataTable()) {
    this.table = cloneGenericDataTable(initialTable);
    this.changeCallbacks = new Set();
  }

  getGridAsGenericDataTable(maxRows) {
    return cloneGenericDataTable(this.table, maxRows);
  }

  getHeadersFromGrid() {
    return [...(this.table.getHeaders?.() || [])];
  }

  getRowCount() {
    return this.table.getRowCount?.() || 0;
  }

  getSelectedRowIndexes() {
    return [];
  }

  setGridFromGenericDataTable(dataTable) {
    this.table = cloneGenericDataTable(dataTable);
    this.notifyGridChanged();
    return Promise.resolve(this.table);
  }

  clearGrid() {
    this.table = new GenericDataTable();
    this.notifyGridChanged();
  }

  onGridChanged(callback) {
    this.changeCallbacks.add(callback);
    return () => {
      this.changeCallbacks.delete(callback);
    };
  }

  notifyGridChanged() {
    this.changeCallbacks.forEach((callback) => callback());
  }
}

function installStoryGlobals() {
  globalThis.RandExp = RandExp;
  globalThis.faker = faker;
  if (typeof document.execCommand !== 'function') {
    document.execCommand = () => true;
  }
}

function dispatchTextInput(input, value) {
  if (!input) {
    return;
  }
  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
}

function dispatchStoryClick(element) {
  element?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function selectExportFormat(surface, format) {
  if (DIRECT_EXPORT_FORMATS.has(format)) {
    dispatchStoryClick(surface.querySelector(`.type-select-action[data-type="${format}"]`));
    return;
  }

  if (CODE_EXPORT_FORMATS.has(format)) {
    dispatchStoryClick(surface.querySelector('.type-select-action[data-group="code"]'));
    dispatchStoryClick(surface.querySelector(`.subtask-select-action[data-type="${format}"]`));
    return;
  }

  if (UNIT_TEST_EXPORT_FORMATS.has(format)) {
    dispatchStoryClick(surface.querySelector('.type-select-action[data-group="code-unit-test"]'));
    dispatchStoryClick(surface.querySelector(`.subtask-select-action[data-type="${format}"]`));
  }
}

function setCheckboxValue(input, checked) {
  if (!input) {
    return;
  }
  input.checked = checked === true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function setPreviewRowLimit(surface, value) {
  const previewButton = surface.querySelector('#previewEditModeButton');
  if (!previewButton) {
    return;
  }
  previewButton.textContent = `Preview (${value})`;
}

function getSurfaceActiveExportType(surface) {
  const activeAction =
    surface.querySelector('.subtask-select.active-type .subtask-select-action') ||
    surface.querySelector('.type-select.active-type .type-select-action');
  return activeAction?.getAttribute('data-type') || 'csv';
}

function setSurfacePreviewText(surface, exporter, previewRowLimit) {
  const previewTextArea = surface.querySelector('#markdownarea');
  if (!previewTextArea) {
    return;
  }
  const type = getSurfaceActiveExportType(surface);
  const previewDataTable = exporter.getGridAsGenericDataTable(previewRowLimit);
  previewTextArea.value = exporter.getDataTableAs(type, previewDataTable) || '';
}

function scopeImportExportControllerToSurface(surface, importExportController) {
  const methodNames = [
    'renderTextFromGrid',
    'setFileFormatType',
    'setOptionsViewForFormatType',
    'applyCurrentTypeOptions',
    'setCurrentTypeOptions',
    'toggleTextEditMode',
    'importTextArea',
    '_syncGridFromTextButtonState',
    '_bindPreviewTextInputIfAvailable',
    '_bindAutoPreviewCheckboxIfAvailable',
    '_syncAutoPreviewControlState',
    '_getActiveType',
  ];

  methodNames.forEach((methodName) => {
    const originalMethod = importExportController[methodName];
    if (typeof originalMethod !== 'function') {
      return;
    }
    importExportController[methodName] = (...args) =>
      withScopedDocument(surface, () => originalMethod.apply(importExportController, args));
  });

  const exportControlMethodNames = ['renderTextFromGrid', 'setTextFromString', 'copyText', 'fileDownload'];
  exportControlMethodNames.forEach((methodName) => {
    const originalMethod = importExportController.exportControls?.[methodName];
    if (typeof originalMethod !== 'function') {
      return;
    }
    importExportController.exportControls[methodName] = (...args) =>
      withScopedDocument(surface, () => originalMethod.apply(importExportController.exportControls, args));
  });
}

function applyExportFormatOptions(importExportController, format, options = {}) {
  if (format === 'json' || format === 'jsonl') {
    importExportController.applyCurrentTypeOptions({
      outputFormat: format,
      options: {
        prettyPrint: options.prettyPrint !== false,
        prettyPrintDelimiter: options.prettyPrintDelimiter || '  ',
        asObject: options.asObject === true,
        asPropertyNamed: options.asPropertyNamed || '',
      },
    });
    return;
  }

  if (format === 'csv' || format === 'dsv') {
    importExportController.applyCurrentTypeOptions({
      outputFormat: format,
      options: {
        delimiter: format === 'dsv' ? options.delimiter || '\t' : ',',
        quotes: options.quotes === true,
        header: options.header === true,
        quoteChar: options.quoteChar || '"',
        escapeChar: options.escapeChar || '"',
      },
    });
  }
}

function renderEmbeddedTestDataStory({ scenario = 'empty' } = {}) {
  installStoryGlobals();

  const surface = createStorySurface('embedded-panel');
  document.body.appendChild(surface);
  const controlsId = `story-testdata-panel-${storySurfaceCounter}`;
  const previewId = `story-testdata-preview-${storySurfaceCounter}`;
  surface.innerHTML = `
    <section class="testDataSchemaGui">
      <details open>
        <summary>Test Data</summary>
        <div id="${controlsId}"></div>
      </details>
    </section>
    <section class="importexport">
      <label for="${previewId}">Preview Capture</label>
      <textarea id="${previewId}" class="textrepresentation" readonly rows="12"></textarea>
    </section>
  `;

  const latestData = { table: null };
  const memoryGrid = new StoryMemoryGrid();
  const exporter = new Exporter(memoryGrid);
  const importer = new Importer(memoryGrid);
  const textPreviewRenderer = {
    async renderTextFromGrid() {
      const previewText = latestData.table ? exporter.getDataTableAs('csv', latestData.table) : '';
      surface.querySelector(`#${previewId}`).value = previewText;
      return previewText;
    },
  };
  const control = createTestDataGridControl({
    documentObj: document,
    windowObj: window,
    DebouncerClass: ImmediateDebouncer,
  });

  const originalSetGridFromGenericDataTable = importer.setGridFromGenericDataTable.bind(importer);
  importer.setGridFromGenericDataTable = (dataTable) => {
    latestData.table = cloneGenericDataTable(dataTable);
    return originalSetGridFromGenericDataTable(dataTable);
  };

  control.enableTestDataGenerationInterface(controlsId, importer, textPreviewRenderer, memoryGrid);
  const controller = control.getState().schemaGridController;

  if (scenario === 'sample' || scenario === 'text-mode') {
    controller.insertSampleSchema();
  }
  if (scenario === 'text-mode') {
    surface.querySelector('#testDataSchemaModeToggleButton')?.click();
  }
  if (scenario === 'validation') {
    controller.insertSampleSchema();
    dispatchTextInput(surface.querySelector('#testDataSchemaRows [data-field="name"]'), '');
  }

  surface.__storybookCleanup = () => control.destroy();
  return surface;
}

function renderGeneratorStory({ scenario = 'empty' } = {}) {
  installStoryGlobals();

  const surface = createStorySurface('generator');
  document.body.appendChild(surface);
  const host = document.createElement('div');
  surface.appendChild(host);

  const page = new DataGeneratorPage({
    parentElement: host,
    documentObj: document,
    faker,
    RandExp,
    TabulatorCtor: StoryTabulator,
    GridExtensionClass: StoryPreviewGrid,
  });
  page.init();

  if (scenario === 'sample' || scenario === 'text-mode') {
    page.insertExampleSchema();
  }
  if (scenario === 'text-mode') {
    surface.querySelector('#schemaModeToggleButton')?.click();
  }
  if (scenario === 'validation') {
    page.insertExampleSchema();
    dispatchTextInput(surface.querySelector('#generatorSchemaRows [data-field="name"]'), '');
  }

  surface.__storybookCleanup = () => page.destroy?.();
  return surface;
}

function renderGridPreviewStory({
  format = 'csv',
  state = 'start-blank',
  previewRowLimit = 10,
  prettyPrint = true,
  asObject = false,
  asPropertyNamed = '',
  quotes = false,
  header = false,
  delimiter = '\t',
} = {}) {
  installStoryGlobals();

  const surface = createStorySurface('grid-preview');
  document.body.appendChild(surface);
  const controlsHost = document.createElement('div');
  controlsHost.id = `story-import-export-${storySurfaceCounter}`;
  controlsHost.className = 'importexport';
  const tabHost = document.createElement('div');
  tabHost.id = `story-tabbed-text-${storySurfaceCounter}`;
  tabHost.className = 'tabbedTextArea';
  surface.appendChild(controlsHost);
  surface.appendChild(tabHost);

  const memoryGrid = new StoryMemoryGrid(createSampleGridData());
  const importer = new Importer(memoryGrid);
  const exporter = new Exporter(memoryGrid);
  const importExportController = new ImportExportControls({
    requestConfirm: () => true,
  });
  importExportController.addHTMLtoGui(controlsHost);
  const tabbedTextControl = new TabbedTextControl(tabHost, importExportController);
  tabbedTextControl.addToGui();
  importExportController.setImporter(importer);
  importExportController.setExporter(exporter);
  importExportController.setGridChangeSource(memoryGrid);
  scopeImportExportControllerToSurface(surface, importExportController);

  importExportController.previewRowLimit = previewRowLimit;
  setPreviewRowLimit(surface, previewRowLimit);
  withScopedDocument(surface, () => {
    selectExportFormat(surface, format);
    applyExportFormatOptions(importExportController, format, {
      prettyPrint,
      asObject,
      asPropertyNamed,
      quotes,
      header,
      delimiter,
    });
    importExportController.setFileFormatType();
    importExportController.setOptionsViewForFormatType();
  });

  const autoPreviewCheckbox = surface.querySelector('#autoPreviewCheckbox');
  if (state === 'auto-previewed') {
    withScopedDocument(surface, () => {
      setCheckboxValue(autoPreviewCheckbox, true);
      importExportController.renderTextFromGrid();
    });
    setSurfacePreviewText(surface, exporter, previewRowLimit);
  } else {
    withScopedDocument(surface, () => {
      setCheckboxValue(autoPreviewCheckbox, false);
    });
    const previewTextArea = surface.querySelector('#markdownarea');
    if (previewTextArea) {
      previewTextArea.value = '';
    }
  }

  return surface;
}

export {
  EXPORT_FORMAT_STORY_LABELS,
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
  createSampleGridData,
  renderEmbeddedTestDataStory,
  renderGeneratorStory,
  renderGridPreviewStory,
};
