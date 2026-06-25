import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { createDataGeneratorPage } from '../../../js/gui_components/generator/runtime/create-generator-page.js';
import { getOutputFormatGroups } from '../../../js/gui_components/generator/options/options-ui-schema.js';
import { FORBIDDEN_FAKER_COMMANDS } from '../../../js/gui_components/shared/faker-commands.js';
import { TestDataGenerator } from '../../../../core/js/data_generation/testDataGenerator.js';

class FakeTabulator {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
}

class FakeGridExtension {
  constructor() {
    this.setGridFromGenericDataTable = jest.fn();
    FakeGridExtension.lastInstance = this;
  }
}

class FakeExporter {
  constructor() {
    this.options = {
      csv: { options: { header: true, quoteChar: '"' } },
      json: { options: { prettyPrint: false } },
      markdown: { options: { prettyPrint: true } },
    };
    this.getDataTableAsAsync = jest.fn(async (type, dataTable, progressCallback) => {
      progressCallback?.(`Formatting ${type}`);
      return `${type}:async:${dataTable.getRowCount()}`;
    });
    this.getDataTableAs = jest.fn((type, dataTable) => `${type}:sync:${dataTable.getRowCount()}`);
    this.setOptionsForType = jest.fn((type, options) => {
      this.options[type] = options;
    });
    this.getOptionsForType = jest.fn((type) => this.options[type]);
    FakeExporter.lastInstance = this;
  }

  canExport(type) {
    return ['csv', 'json', 'markdown'].includes(type);
  }

  getFileExtensionFor(type) {
    if (type === 'json') {
      return '.json';
    }
    if (type === 'markdown') {
      return '.md';
    }
    return '.csv';
  }
}

class FakeDownload {
  constructor(filename) {
    this.filename = filename;
  }

  downloadFile(text) {
    FakeDownload.lastDownload = { filename: this.filename, text };
  }
}

const outputFormatGroups = getOutputFormatGroups();
const coreAndCodeFormats = [...outputFormatGroups.core, ...outputFormatGroups.code].map((entry) => entry.type);
const allOutputFormats = [...coreAndCodeFormats, ...outputFormatGroups.unitTest.map((entry) => entry.type)];

describe('generator page runtime factories', () => {
  let dom;
  let alertFn;

  function createMountedPage(options = {}) {
    return createDataGeneratorPage(options);
  }

  function getSchemaErrorStatus() {
    return document.querySelector('[data-role="generator-schema-definition-root"] [data-role="schema-error"]');
  }

  function getPreviewButton() {
    return document.querySelector('[data-role="generator-preview-button"]');
  }

  function getOutputPreviewTextArea() {
    return document.querySelector('[data-role="generator-output-preview"]');
  }

  function getOutputFormatSelect() {
    return document.querySelector('[data-role="generator-output-format-select"]');
  }

  function getPairwiseButtonWrapper() {
    return document.querySelector('[data-role="generator-pairwise-button-wrapper"]');
  }

  function getGenerationStatus() {
    return document.querySelector('[data-role="generator-status-text"]');
  }

  function getPreviewRowsInput() {
    return document.querySelector('[data-role="preview-rows-count-control"] input');
  }

  function getGenerateRowsInput() {
    return document.querySelector('[data-role="generate-rows-count-control"] input');
  }

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;
    alertFn = jest.fn();
    FakeDownload.lastDownload = undefined;
    FakeGridExtension.lastInstance = undefined;
    FakeExporter.lastInstance = undefined;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('schema source type dropdown uses enum, literal, regex, domain, faker order', () => {
    createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    const sourceTypeSelect = document.querySelector('[data-field="sourceType"]');
    const optionValues = Array.from(sourceTypeSelect.querySelectorAll('option')).map((option) => option.value);

    expect(optionValues).toEqual(['enum', 'literal', 'regex', 'domain', 'faker']);
  });

  test('uses helper-only alphabetical faker command list in schema editor', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
    page.schemaRows[0].sourceType = 'faker';
    page.renderSchemaRows();

    const commandSelect = document.querySelector('[data-field="command"]');
    const optionValues = Array.from(commandSelect.querySelectorAll('option'))
      .map((option) => option.value)
      .filter(Boolean);
    const sortedOptionValues = [...optionValues].sort((left, right) => left.localeCompare(right));

    expect(optionValues).toContain('helpers.fake');
    expect(optionValues).toContain('helpers.arrayElement');
    expect(optionValues).not.toContain('person.firstName');
    expect(optionValues).not.toContain('airline.airplane.name');
    FORBIDDEN_FAKER_COMMANDS.forEach((command) => {
      expect(optionValues).not.toContain(command);
    });
    expect(optionValues).toEqual(sortedOptionValues);
    expect(optionValues.every((value) => value.startsWith('helpers.'))).toBe(true);
  });

  test('mounted shared schema definition remains the source of truth for schema state setters', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaDefinition = {
      setRows: jest.fn(),
      setTokens: jest.fn(),
      setTextMode: jest.fn(),
      getState: jest.fn(() => ({ rows: [{ id: 'mounted-row' }], isTextMode: true })),
      getTokens: jest.fn(() => [{ kind: 'rule' }]),
    };
    page.schemaSession = {
      setRows: jest.fn(),
      setTokens: jest.fn(),
      setTextMode: jest.fn(),
      getRows: jest.fn(() => [{ id: 'session-row' }]),
      getTokens: jest.fn(() => [{ kind: 'session-rule' }]),
      getTextMode: jest.fn(() => false),
      parseTextToRows: jest.fn(() => ({ rows: [], errors: [], tokens: [] })),
    };

    const nextRows = [{ id: 'next-row' }];
    const nextTokens = [{ kind: 'blank' }];

    page.schemaRows = nextRows;
    page.schemaTextTokens = nextTokens;
    page.isTextMode = false;

    expect(page.schemaDefinition.setRows).toHaveBeenCalledWith(nextRows);
    expect(page.schemaDefinition.setTokens).toHaveBeenCalledWith(nextTokens);
    expect(page.schemaDefinition.setTextMode).toHaveBeenCalledWith(false);
    expect(page.schemaSession.setRows).not.toHaveBeenCalled();
    expect(page.schemaSession.setTokens).not.toHaveBeenCalled();
    expect(page.schemaSession.setTextMode).not.toHaveBeenCalled();
    expect(page.schemaRows).toEqual([{ id: 'mounted-row' }]);
    expect(page.schemaTextTokens).toEqual([{ kind: 'rule' }]);
    expect(page.isTextMode).toBe(true);
  });

  test('preview generates data into tabulator grid extension', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [
      { id: '1', name: 'Name', sourceType: 'faker', command: 'person.firstName', params: '()', value: '' },
      { id: '2', name: 'Code', sourceType: 'regex', command: '', params: '', value: '[A-Z]{3}' },
    ];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '3';

    getPreviewButton().click();

    expect(alertFn).not.toHaveBeenCalled();
    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(tableArg.getRowCount()).toBe(3);
    expect(tableArg.getHeaders()).toEqual(['Name', 'Code']);
    expect(getOutputPreviewTextArea().value).toBe('csv:sync:3');
  });

  test('preview blocks blank regex rows with schema validation feedback', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Code', sourceType: 'regex', command: '', params: '', value: '   ' }];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '3';

    page.previewData();

    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).not.toHaveBeenCalled();
    expect(getSchemaErrorStatus().textContent).toBe('Row 1: regex value is required.');
    expect(getOutputPreviewTextArea().value).toBe('');
  });

  test('preview blocks malformed regex rows with schema validation feedback', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Code', sourceType: 'regex', command: '', params: '', value: '[' }];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '3';

    page.previewData();

    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).not.toHaveBeenCalled();
    expect(getSchemaErrorStatus().textContent).toContain('Unterminated character class');
    expect(getOutputPreviewTextArea().value).toBe('');
  });

  test('preview serializes object-returning domain values as JSON', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [
      { id: '1', name: 't4', sourceType: 'domain', command: 'science.chemicalElement', params: '', value: '' },
    ];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '1';

    page.previewData();

    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    const renderedValue = tableArg.getRow(0)[0];
    expect(typeof renderedValue).toBe('string');
    expect(renderedValue.startsWith('{')).toBe(true);
    expect(renderedValue).toContain('"name"');
    expect(renderedValue).not.toContain('[object Object]');
  });

  test('empty literal schema value generates blank data cell', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 't', sourceType: 'literal', command: '', params: '', value: '' }];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '1';
    page.previewData();

    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(tableArg.getCell(0, 0)).toBe('');
  });

  test('literal row value entered as literal(...) generates raw literal content', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 't', sourceType: 'literal', command: '', params: '', value: 'literal(abc)' }];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '1';
    page.previewData();

    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(tableArg.getCell(0, 0)).toBe('abc');
  });

  test('preview rows input defaults to 10 and has max 50', () => {
    createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    const previewRowsInput = getPreviewRowsInput();
    expect(previewRowsInput.value).toBe('10');
    expect(previewRowsInput.max).toBe('50');
  });

  test('preview rows above max show validation error', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();

    getPreviewRowsInput().value = '51';
    page.previewData();

    expect(getGenerationStatus().textContent).toBe('Preview Items Count must be less than or equal to 50.');
    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).not.toHaveBeenCalled();
  });

  test('output preview updates when changing output type after preview', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    getPreviewRowsInput().value = '2';
    page.previewData();

    const previewOutput = getOutputPreviewTextArea();
    expect(previewOutput.value).toBe('csv:sync:2');

    const outputSelect = getOutputFormatSelect();
    outputSelect.value = 'json';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(previewOutput.value).toBe('json:sync:2');
  });

  test('generate downloads file using selected output format', async () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    getGenerateRowsInput().value = '4';
    getOutputFormatSelect().value = 'json';

    await page.generateDataFile();

    expect(alertFn).not.toHaveBeenCalled();
    expect(FakeExporter.lastInstance.getDataTableAsAsync).toHaveBeenCalledTimes(1);
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.json',
      text: 'json:async:4',
    });
  });

  test('explicit row count getters prefer component APIs before page-global DOM ids', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.generatorPreview = {
      getPreviewRowCount: jest.fn(() => ({
        value: 7,
        valid: true,
        errors: [],
      })),
    };
    page.generatorControls = {
      getGenerateRowCount: jest.fn(() => ({
        value: 23,
        valid: true,
        errors: [],
      })),
    };

    expect(page.getPreviewRowCount()).toEqual({
      value: 7,
      valid: true,
      errors: [],
    });
    expect(page.getGenerateRowCount()).toEqual({
      value: 23,
      valid: true,
      errors: [],
    });
    expect(page.generatorPreview.getPreviewRowCount).toHaveBeenCalledTimes(1);
    expect(page.generatorControls.getGenerateRowCount).toHaveBeenCalledTimes(1);
  });

  test('pairwise button visibility updates through GeneratorControls state', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [
      { id: '1', name: 'Browser', sourceType: 'enum', command: '', params: '', value: 'enum(chrome,firefox,safari)' },
      { id: '2', name: 'Plan', sourceType: 'enum', command: '', params: '', value: 'enum(free,pro,enterprise)' },
    ];
    page.renderSchemaRows();

    expect(getPairwiseButtonWrapper().style.display).toBe('inline-flex');
    expect(page.generatorControls.getState().pairwiseVisible).toBe(true);

    page.schemaRows = [{ id: '3', name: 'Only', sourceType: 'enum', command: '', params: '', value: 'enum(one,two)' }];
    page.renderSchemaRows();

    expect(getPairwiseButtonWrapper().style.display).toBe('none');
    expect(page.generatorControls.getState().pairwiseVisible).toBe(false);
  });

  test('updateAllPairsButtonVisibility uses the explicit GeneratorControls pairwise API', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.generatorControls = {
      setPairwiseVisible: jest.fn(),
    };
    page.schemaDefinition = {
      getState: jest.fn(() => ({
        rows: [
          { name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
          { name: 'Plan', sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
        ],
      })),
    };

    page.updateAllPairsButtonVisibility();

    expect(page.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(true);
  });

  test('renders options panel and applies options for selected type', () => {
    createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    expect(document.querySelector('[data-role="generator-options-panel"] .delimited-options')).not.toBeNull();
    expect(FakeExporter.lastInstance.getOptionsForType).toHaveBeenCalledWith('csv');

    const outputSelect = getOutputFormatSelect();
    outputSelect.value = 'json';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(document.querySelector('[data-role="generator-options-panel"] .json-options')).not.toBeNull();
    expect(FakeExporter.lastInstance.getOptionsForType).toHaveBeenCalledWith('json');

    const applyButton = document.querySelector(
      '[data-role="generator-options-panel"] [data-role="apply-options-button"]'
    );
    expect(applyButton.disabled).toBe(true);

    const dirtyTrigger = document.querySelector('[data-role="generator-options-panel"] input[type="checkbox"]');
    dirtyTrigger.checked = !dirtyTrigger.checked;
    dirtyTrigger.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    expect(applyButton.disabled).toBe(false);

    applyButton.click();

    expect(FakeExporter.lastInstance.setOptionsForType).toHaveBeenCalledTimes(1);
    expect(FakeExporter.lastInstance.setOptionsForType.mock.calls[0][0]).toBe('json');
    expect(getGenerationStatus().textContent).toContain('JSON options applied.');
    expect(applyButton.disabled).toBe(true);
  });

  test('generate falls back to sync export when async export utility is unavailable', async () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    getGenerateRowsInput().value = '2';
    getOutputFormatSelect().value = 'csv';

    delete FakeExporter.lastInstance.getDataTableAsAsync;

    await page.generateDataFile();

    expect(FakeExporter.lastInstance.getDataTableAs).toHaveBeenCalledTimes(1);
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.csv',
      text: 'csv:sync:2',
    });
  });

  test('shows command selector and params for faker/domain and value for regex/literal', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'A', sourceType: 'regex', command: 'word.noun', params: '()', value: '[A-Z]' }];
    page.renderSchemaRows();

    let rowElem = document.querySelector('.shared-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).toBeNull();
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').hidden).toBe(false);
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').getAttribute('href')).toBe(
      'https://anywaydata.com/docs/test-data/regex-test-data'
    );
    expect(rowElem.querySelector('[data-field="params"]')).toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).not.toBeNull();

    rowElem.querySelector('[data-field="sourceType"]').value = 'faker';
    rowElem.querySelector('[data-field="sourceType"]').dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    rowElem = document.querySelector('.shared-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').hidden).toBe(false);
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').getAttribute('href')).toBe(
      'https://anywaydata.com/docs/test-data/domain/word'
    );
    expect(rowElem.querySelector('[data-field="params"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).toBeNull();

    rowElem.querySelector('[data-field="sourceType"]').value = 'domain';
    rowElem.querySelector('[data-field="sourceType"]').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    rowElem = document.querySelector('.shared-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="params"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).toBeNull();
    expect(
      Array.from(rowElem.querySelector('[data-field="command"]').querySelectorAll('option')).some(
        (opt) => opt.value === 'number.int'
      )
    ).toBe(true);
  });

  test('hides non-scalar domain commands for new domain rows', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'A', sourceType: 'domain', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    const options = Array.from(document.querySelector('[data-field="command"]').querySelectorAll('option')).map(
      (option) => option.value
    );
    expect(options).toContain('number.int');
    expect(options).toContain('unit.name');
    expect(options).toContain('unit.symbol');
    expect(options).toContain('language.name');
    expect(options).toContain('language.alpha2');
    expect(options).toContain('language.alpha3');
    expect(options).not.toContain('science.chemicalElement');
    expect(options).not.toContain('science.unit');
    expect(options).not.toContain('finance.currency');
    expect(options).not.toContain('location.language');
  });

  test('preserves selected non-scalar domain command for existing parsed row', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [
      { id: '1', name: 'A', sourceType: 'domain', command: 'science.chemicalElement', params: '', value: '' },
    ];
    page.renderSchemaRows();

    const commandSelect = document.querySelector('[data-field="command"]');
    const options = Array.from(commandSelect.querySelectorAll('option')).map((option) => option.value);
    expect(commandSelect.value).toBe('science.chemicalElement');
    expect(options).toContain('science.chemicalElement');
    expect(options).not.toContain('finance.currency');
  });

  test('shows schema help link for faker, regex and literal sources', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Plane', sourceType: 'faker', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    let helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    expect(helpLink.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/faker-test-data');
    expect(helpLink.getAttribute('target')).toBe('_blank');
    expect(helpLink.getAttribute('rel')).toBe('noopener noreferrer');

    const commandSelect = document.querySelector('[data-field="command"]');
    commandSelect.value = 'helpers.fake';
    commandSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    expect(helpLink.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/faker/helpers');
    expect(helpLink.getAttribute('aria-label')).toBe('Faker command help: helpers.fake');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>faker.helpers.fake</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('helpers');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Call:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Schema params field:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('Learn more: faker.helpers.fake');

    page.schemaRows[0].sourceType = 'regex';
    page.renderSchemaRows();
    helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    expect(helpLink.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/regex-test-data');
    expect(helpLink.getAttribute('aria-label')).toBe('Regex data help');
    expect(helpLink.getAttribute('data-help-text')).toContain('Regex patterns generate random values');

    page.schemaRows[0].sourceType = 'literal';
    page.renderSchemaRows();
    helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    expect(helpLink.getAttribute('href')).toBe('https://anywaydata.com/docs/category/generating-data');
    expect(helpLink.getAttribute('aria-label')).toBe('Literal data help');
    expect(helpLink.getAttribute('data-help-text')).toContain('Literal data repeats the exact text');
  });

  test('shows domain help with command metadata when domain command selected', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [
      { id: '1', name: 'Age', sourceType: 'domain', command: 'number.int', params: '(1,10)', value: '' },
    ];
    page.renderSchemaRows();

    const help = document.querySelector('[data-field="faker-doc-link"]');
    expect(help).not.toBeNull();
    expect(help.getAttribute('data-help-text')).toContain('awd.domain.number.int');
    expect(help.getAttribute('data-help-text')).toContain('Params:');
  });

  test('shows domain index help link when domain source has no command selected', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker,
      RandExp,
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'Age', sourceType: 'domain', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    const help = document.querySelector('[data-field="faker-doc-link"]');
    expect(help).not.toBeNull();
    expect(help.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/domain/domain-test-data');
  });

  test('shows command metadata summary and params in faker help tooltip', () => {
    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    page.schemaRows = [{ id: '1', name: 'X', sourceType: 'faker', command: 'number.int', params: '', value: '' }];
    page.renderSchemaRows();

    const helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    expect(helpLink.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/domain/number');
    expect(helpLink.getAttribute('aria-label')).toBe('Faker command help: number.int');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>faker.number.int</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Call:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Params:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Schema params field:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Example:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('Learn more: faker.number.int');
  });

  test('re-renders schema rows without depending on window.updateHelpHints', () => {
    window.updateHelpHints = jest.fn();

    const page = createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    window.updateHelpHints.mockClear();
    page.renderSchemaRows();

    expect(window.updateHelpHints).not.toHaveBeenCalled();
    expect(document.querySelector('[data-field="faker-doc-link"]')).not.toBeNull();
  });

  test('populateFormatOptions adds Code optgroup after other format options', () => {
    class FakeExporterWithCode extends FakeExporter {
      canExport(type) {
        return allOutputFormats.includes(type);
      }
    }

    createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporterWithCode,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    const outputSelect = getOutputFormatSelect();
    const children = Array.from(outputSelect.children);

    const codeGroup = children.find(
      (child) => child.tagName.toLowerCase() === 'optgroup' && child.label === '-- Code --'
    );
    const unitTestGroup = children.find(
      (child) => child.tagName.toLowerCase() === 'optgroup' && child.label === '-- Code (Unit Test) --'
    );
    expect(codeGroup).toBeTruthy();
    expect(unitTestGroup).toBeTruthy();

    const codeOptionValues = Array.from(codeGroup.querySelectorAll('option')).map((o) => o.value);
    expect(codeOptionValues).toContain('java');
    expect(codeOptionValues).toContain('javascript');
    expect(codeOptionValues).toContain('kotlin');
    expect(codeOptionValues).toContain('perl');
    expect(codeOptionValues).toContain('csharp');
    expect(codeOptionValues).toContain('php');
    expect(codeOptionValues).toContain('python');
    expect(codeOptionValues).toContain('ruby');
    expect(codeOptionValues).toContain('typescript');
    expect(codeOptionValues).not.toContain('junit4');

    const unitTestOptionValues = Array.from(unitTestGroup.querySelectorAll('option')).map((o) => o.value);
    expect(unitTestOptionValues).toContain('junit4');
    expect(unitTestOptionValues).toContain('junit5');
    expect(unitTestOptionValues).toContain('junit6');
    expect(unitTestOptionValues).toContain('testng');
    expect(unitTestOptionValues).toContain('pytest');
    expect(unitTestOptionValues).toContain('jest');
    expect(unitTestOptionValues).toContain('xunit');
    expect(unitTestOptionValues).toContain('rspec');
    expect(unitTestOptionValues).toContain('phpunit');
    expect(unitTestOptionValues).toContain('kotest');
    expect(unitTestOptionValues).toContain('test-more');
  });

  test('populateFormatOptions includes all supported output formats', () => {
    class FakeExporterAllFormats extends FakeExporter {
      canExport(type) {
        return allOutputFormats.includes(type);
      }
    }

    createMountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      alertFn,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporterAllFormats,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    const outputSelect = getOutputFormatSelect();
    const optionValues = Array.from(outputSelect.querySelectorAll('option')).map((option) => option.value);

    expect(optionValues).toEqual(
      expect.arrayContaining([
        'csv',
        'json',
        'jsonl',
        'xml',
        'sql',
        'markdown',
        'dsv',
        'html',
        'gherkin',
        'asciitable',
        'csharp',
        'java',
        'javascript',
        'kotlin',
        'perl',
        'php',
        'python',
        'ruby',
        'typescript',
        'junit4',
        'junit5',
        'junit6',
        'testng',
        'pytest',
        'jest',
        'xunit',
        'rspec',
        'phpunit',
        'kotest',
        'test-more',
      ])
    );
  });
});
