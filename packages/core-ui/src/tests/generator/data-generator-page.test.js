import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import {
  DataGeneratorPage,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  schemaRowsToSpec,
  schemaRowsToSpecWithTokens,
  validateSchemaRows,
} from '../../../js/gui_components/generator/index.js';
import { getOutputFormatGroups } from '../../../js/gui_components/generator/options/index.js';
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

describe('DataGeneratorPage', () => {
  let dom;
  let alertFn;

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

  test('schema helper mapping supports faker, domain, regex and literal', () => {
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'faker', command: 'faker.person.firstName', params: '()' })).toBe(
      'person.firstName()'
    );
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'domain', command: 'number.int', params: '(1,10)' })).toBe(
      'number.int(1,10)'
    );
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'regex', value: '[A-Z]{3}' })).toBe('[A-Z]{3}');
    expect(buildRuleSpecFromSchemaRow({ name: 'Code', sourceType: 'regex', value: '   ' })).toBe('regex("")');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'literal', value: 'Fixed' })).toBe('literal(Fixed)');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'literal', value: '   ' })).toBe('literal("")');

    const spec = schemaRowsToSpec([
      { name: 'A', sourceType: 'faker', command: 'word.noun', params: '()' },
      { name: 'B', sourceType: 'literal', value: 'x' },
    ]);
    expect(spec).toBe('A\nword.noun()\nB\nliteral(x)');
  });

  test('literal rule extraction unwraps literal(...) variants for generation', () => {
    expect(extractLiteralValueFromRuleSpec('literal(Fixed)')).toBe('Fixed');
    expect(extractLiteralValueFromRuleSpec('literal("")')).toBe('');
    expect(extractLiteralValueFromRuleSpec('datatype.literal(   123)')).toBe('   123');
    expect(extractLiteralValueFromRuleSpec('awd.datatype.literal(value)')).toBe('value');
    expect(extractLiteralValueFromRuleSpec('plain value')).toBe('plain value');
  });

  test('regex rule extraction unwraps regex(...) variants for generation', () => {
    expect(extractRegexValueFromRuleSpec('regex("[A-Z]{3}")')).toBe('"[A-Z]{3}"');
    expect(extractRegexValueFromRuleSpec('regex("")')).toBe('');
    expect(extractRegexValueFromRuleSpec('datatype.regex(\\d{2})')).toBe('\\d{2}');
    expect(extractRegexValueFromRuleSpec('plain regex')).toBe('plain regex');
  });

  test('schemaRowsToSpec omits fully blank rows', () => {
    const spec = schemaRowsToSpec([{ name: '', sourceType: 'regex', value: '' }]);
    expect(spec).toBe('');
  });

  test('schema source type dropdown uses enum, literal, regex, faker, domain order', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const sourceTypeSelect = document.querySelector('[data-field="sourceType"]');
    const optionValues = Array.from(sourceTypeSelect.querySelectorAll('option')).map((option) => option.value);

    expect(optionValues).toEqual(['enum', 'literal', 'regex', 'faker', 'domain']);
  });

  test('schemaRowsToSpecWithTokens preserves comments and blank lines', () => {
    const spec = schemaRowsToSpecWithTokens(
      [
        { name: 'Priority', sourceType: 'enum', value: 'enum(high,medium,low)' },
        { name: 'Status', sourceType: 'enum', value: 'enum(active,inactive,pending)' },
      ],
      [{ kind: 'comment', text: '# top' }, { kind: 'rule' }, { kind: 'blank', text: '' }, { kind: 'rule' }]
    );
    expect(spec).toBe('# top\nPriority\nenum(high,medium,low)\n\nStatus\nenum(active,inactive,pending)');
  });

  test('uses curated alphabetical faker command list in schema editor', () => {
    const page = new DataGeneratorPage({
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
    page.init();
    page.schemaRows[0].sourceType = 'faker';
    page.renderSchemaRows();

    const commandSelect = document.querySelector('[data-field="command"]');
    const optionValues = Array.from(commandSelect.querySelectorAll('option'))
      .map((option) => option.value)
      .filter(Boolean);
    const airplaneEntries = optionValues.filter((value) => value.startsWith('airline.airplane.'));
    const sortedOptionValues = [...optionValues].sort((left, right) => left.localeCompare(right));

    expect(optionValues).toContain('airline.airplane.name');
    expect(optionValues).toContain('airline.airplane.iataTypeCode');
    expect(optionValues).not.toContain('airline.airplane');
    expect(optionValues).toEqual(sortedOptionValues);
    expect(airplaneEntries).toEqual(['airline.airplane.iataTypeCode', 'airline.airplane.name']);
  });

  test('schema validation reports missing column names and faker command', () => {
    const result = validateSchemaRows([
      { name: '', sourceType: 'regex', value: '[0-9]' },
      { name: 'First', sourceType: 'faker', command: '' },
    ]);
    expect(result.errors.map((error) => error.code)).toEqual(['missing_column_name', 'missing_faker_command']);
    expect(result.errors.map((error) => error.message)).toEqual([
      'Row 1: column name is required.',
      'Row 2: faker command is required.',
    ]);
  });

  test('schema validation reports missing domain command', () => {
    const result = validateSchemaRows([{ name: 'First', sourceType: 'domain', command: '' }]);
    expect(result.errors.map((error) => error.code)).toEqual(['missing_domain_command']);
    expect(result.errors.map((error) => error.message)).toEqual(['Row 1: domain command is required.']);
  });

  test('schema validation rejects helpers in domain source rows', () => {
    const result = validateSchemaRows([{ name: 'First', sourceType: 'domain', command: 'helpers.fake' }]);
    expect(result.errors.map((error) => error.code)).toEqual(['helpers_not_supported_in_domain']);
    expect(result.errors.map((error) => error.message)).toEqual([
      'Row 1: helpers.* is faker-only; use faker.helpers.*',
    ]);
  });

  test('schema validation allows helpers in faker source rows', () => {
    const result = validateSchemaRows([
      { name: 'First', sourceType: 'faker', command: 'helpers.fake', params: '("x")' },
    ]);
    expect(result.errors).toEqual([]);
  });

  test('preview generates data into tabulator grid extension', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [
      { id: '1', name: 'Name', sourceType: 'faker', command: 'person.firstName', params: '()', value: '' },
      { id: '2', name: 'Code', sourceType: 'regex', command: '', params: '', value: '[A-Z]{3}' },
    ];
    page.renderSchemaRows();
    document.getElementById('previewRowsCount').value = '3';

    document.getElementById('previewDataButton').click();

    expect(alertFn).not.toHaveBeenCalled();
    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(tableArg.getRowCount()).toBe(3);
    expect(tableArg.getHeaders()).toEqual(['Name', 'Code']);
    expect(document.getElementById('generatorOutputPreview').value).toBe('csv:sync:3');
  });

  test('preview serializes object-returning domain values as JSON', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [
      { id: '1', name: 't4', sourceType: 'domain', command: 'science.chemicalElement', params: '', value: '' },
    ];
    page.renderSchemaRows();
    document.getElementById('previewRowsCount').value = '1';

    page.previewData();

    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    const renderedValue = tableArg.getRow(0)[0];
    expect(typeof renderedValue).toBe('string');
    expect(renderedValue.startsWith('{')).toBe(true);
    expect(renderedValue).toContain('"name"');
    expect(renderedValue).not.toContain('[object Object]');
  });

  test('empty literal schema value generates blank data cell', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 't', sourceType: 'literal', command: '', params: '', value: '' }];
    page.renderSchemaRows();
    document.getElementById('previewRowsCount').value = '1';
    page.previewData();

    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(tableArg.getCell(0, 0)).toBe('');
  });

  test('literal row value entered as literal(...) generates raw literal content', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 't', sourceType: 'literal', command: '', params: '', value: 'literal(abc)' }];
    page.renderSchemaRows();
    document.getElementById('previewRowsCount').value = '1';
    page.previewData();

    const tableArg = FakeGridExtension.lastInstance.setGridFromGenericDataTable.mock.calls[0][0];
    expect(tableArg.getCell(0, 0)).toBe('abc');
  });

  test('preview rows input defaults to 10 and has max 50', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const previewRowsInput = document.getElementById('previewRowsCount');
    expect(previewRowsInput.value).toBe('10');
    expect(previewRowsInput.max).toBe('50');
  });

  test('preview rows above max show validation error', () => {
    const page = new DataGeneratorPage({
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
    page.init();
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();

    document.getElementById('previewRowsCount').value = '51';
    page.previewData();

    expect(document.getElementById('generatorStatusText').textContent).toBe(
      'previewRowsCount must be less than or equal to 50.'
    );
    expect(FakeGridExtension.lastInstance.setGridFromGenericDataTable).not.toHaveBeenCalled();
  });

  test('output preview updates when changing output type after preview', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('previewRowsCount').value = '2';
    page.previewData();

    const previewOutput = document.getElementById('generatorOutputPreview');
    expect(previewOutput.value).toBe('csv:sync:2');

    const outputSelect = document.getElementById('generatorOutputFormat');
    outputSelect.value = 'json';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(previewOutput.value).toBe('json:sync:2');
  });

  test('generate downloads file using selected output format', async () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('generateRowsCount').value = '4';
    document.getElementById('generatorOutputFormat').value = 'json';

    await page.generateDataFile();

    expect(alertFn).not.toHaveBeenCalled();
    expect(FakeExporter.lastInstance.getDataTableAsAsync).toHaveBeenCalledTimes(1);
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.json',
      text: 'json:async:4',
    });
  });

  test('renders options panel and applies options for selected type', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    expect(document.querySelector('#generatorOptionsPanel .delimited-options')).not.toBeNull();
    expect(FakeExporter.lastInstance.getOptionsForType).toHaveBeenCalledWith('csv');

    const outputSelect = document.getElementById('generatorOutputFormat');
    outputSelect.value = 'json';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(document.querySelector('#generatorOptionsPanel .json-options')).not.toBeNull();
    expect(FakeExporter.lastInstance.getOptionsForType).toHaveBeenCalledWith('json');

    const applyButton = document.querySelector('#generatorOptionsPanel .apply-options');
    expect(applyButton.disabled).toBe(true);

    const dirtyTrigger = document.querySelector('#generatorOptionsPanel input[type="checkbox"]');
    dirtyTrigger.checked = !dirtyTrigger.checked;
    dirtyTrigger.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    expect(applyButton.disabled).toBe(false);

    applyButton.click();

    expect(FakeExporter.lastInstance.setOptionsForType).toHaveBeenCalledTimes(1);
    expect(FakeExporter.lastInstance.setOptionsForType.mock.calls[0][0]).toBe('json');
    expect(document.getElementById('generatorStatusText').textContent).toContain('JSON options applied.');
    expect(applyButton.disabled).toBe(true);
  });

  test('generate falls back to sync export when async export utility is unavailable', async () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('generateRowsCount').value = '2';
    document.getElementById('generatorOutputFormat').value = 'csv';

    delete FakeExporter.lastInstance.getDataTableAsAsync;

    await page.generateDataFile();

    expect(FakeExporter.lastInstance.getDataTableAs).toHaveBeenCalledTimes(1);
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.csv',
      text: 'csv:sync:2',
    });
  });

  test('shows command selector and params for faker/domain and value for regex/literal', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'A', sourceType: 'regex', command: 'word.noun', params: '()', value: '[A-Z]' }];
    page.renderSchemaRows();

    let rowElem = document.querySelector('.generator-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).toBeNull();
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').hidden).toBe(false);
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').getAttribute('href')).toBe(
      'https://anywaydata.com/docs/test-data/regex-test-data'
    );
    expect(rowElem.querySelector('[data-field="params"]')).toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).not.toBeNull();

    rowElem.querySelector('[data-field="sourceType"]').value = 'faker';
    rowElem.querySelector('[data-field="sourceType"]').dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    rowElem = document.querySelector('.generator-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').hidden).toBe(false);
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').getAttribute('href')).toBe(
      'https://fakerjs.dev/api/word'
    );
    expect(rowElem.querySelector('[data-field="params"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).toBeNull();

    rowElem.querySelector('[data-field="sourceType"]').value = 'domain';
    rowElem.querySelector('[data-field="sourceType"]').dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    rowElem = document.querySelector('.generator-schema-row');
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
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'A', sourceType: 'domain', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    const options = Array.from(document.querySelector('[data-field="command"]').querySelectorAll('option')).map(
      (option) => option.value
    );
    expect(options).toContain('number.int');
    expect(options).not.toContain('science.chemicalElement');
    expect(options).not.toContain('finance.currency');
  });

  test('preserves selected non-scalar domain command for existing parsed row', () => {
    const page = new DataGeneratorPage({
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
    page.init();

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
    const page = new DataGeneratorPage({
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
    page.init();

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
    expect(helpLink.getAttribute('href')).toBe('https://fakerjs.dev/api/helpers');
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
    const page = new DataGeneratorPage({
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
    page.init();

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
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'Age', sourceType: 'domain', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    const help = document.querySelector('[data-field="faker-doc-link"]');
    expect(help).not.toBeNull();
    expect(help.getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/domain/domain-test-data');
  });

  test('shows command metadata summary and params in faker help tooltip', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'X', sourceType: 'faker', command: 'number.int', params: '', value: '' }];
    page.renderSchemaRows();

    const helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    expect(helpLink.getAttribute('href')).toBe('https://fakerjs.dev/api/number');
    expect(helpLink.getAttribute('aria-label')).toBe('Faker command help: number.int');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>faker.number.int</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Call:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Params:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Schema params field:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('<strong>Example:</strong>');
    expect(helpLink.getAttribute('data-help-text')).toContain('Learn more: faker.number.int');
  });

  test('rebinds help hints when schema rows are re-rendered', () => {
    window.updateHelpHints = jest.fn();

    const page = new DataGeneratorPage({
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
    page.init();

    window.updateHelpHints.mockClear();
    page.renderSchemaRows();

    expect(window.updateHelpHints).toHaveBeenCalledTimes(1);
  });

  test('populateFormatOptions adds Code optgroup after other format options', () => {
    class FakeExporterWithCode extends FakeExporter {
      canExport(type) {
        return allOutputFormats.includes(type);
      }
    }

    const page = new DataGeneratorPage({
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
    page.init();

    const outputSelect = document.getElementById('generatorOutputFormat');
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

    const page = new DataGeneratorPage({
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
    page.init();

    const outputSelect = document.getElementById('generatorOutputFormat');
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

  test('default validation errors surface inline and do not throw', () => {
    const page = new DataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });
    page.init();
    page.schemaRows = [{ id: '1', name: '', sourceType: 'regex', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    expect(() => page.previewData()).not.toThrow();
    expect(document.getElementById('generatorSchemaErrorText').textContent).toBe('Row 1: column name is required.');
  });

  test('toggles between schema controls and text editing with round trip', () => {
    const page = new DataGeneratorPage({
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
    page.init();
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'faker', command: 'word.noun', params: '()', value: '' }];
    page.renderSchemaRows();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();

    const textArea = document.getElementById('generatorSchemaText');
    expect(document.getElementById('generatorSchemaTextContainer').style.display).toBe('block');
    expect(document.getElementById('generatorSchemaRows').style.display).toBe('none');
    expect(toggle.textContent).toBe('Edit as Schema');
    expect(textArea.value).toContain('Name');
    expect(textArea.value).toContain('word.noun()');

    textArea.value = 'City\n[A-Z]{4}';
    toggle.click();

    expect(document.getElementById('generatorSchemaTextContainer').style.display).toBe('none');
    expect(document.getElementById('generatorSchemaRows').style.display).toBe('flex');
    expect(toggle.textContent).toBe('Edit as Text');
    expect(page.schemaRows[0].name).toBe('City');
    expect(page.schemaRows[0].value).toBe('[A-Z]{4}');
    expect(page.schemaRows[0].sourceType).toBe('regex');
  });

  test('text to schema to text preserves literal type as literal(...)', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = 'dfffs\nt';
    toggle.click();

    const sourceSelect = document.querySelector('[data-field="sourceType"]');
    const valueInput = document.querySelector('[data-field="value"]');
    sourceSelect.value = 'literal';
    sourceSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    const refreshedValueInput = document.querySelector('[data-field="value"]');
    refreshedValueInput.value = valueInput?.value || 't';
    refreshedValueInput.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    toggle.click();
    expect(document.getElementById('generatorSchemaText').value).toBe('dfffs\nliteral(t)');
  });

  test('row mode to text mode preserves in-progress faker row with empty command', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    page.schemaRows = [{ id: '1', name: 'User Name', sourceType: 'faker', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    document.getElementById('schemaModeToggleButton').click();
    expect(document.getElementById('generatorSchemaText').value).toBe('User Name\n');
  });

  test('row action buttons work immediately after switching from text mode to schema mode', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = 'A\none\nB\ntwo';
    toggle.click();

    expect(page.schemaRows).toHaveLength(2);
    const removeButtons = document.querySelectorAll('[data-action="remove"]');
    removeButtons[1].click();
    expect(page.schemaRows).toHaveLength(1);
  });

  test('toggle clears visible help tooltips before switching schema mode', () => {
    const hideAll = jest.fn();
    window.tippy = { hideAll };

    const page = new DataGeneratorPage({
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
    page.init();

    const hideInstance = jest.fn();
    document.getElementById('schemaModeHelpIcon')._tippy = { hide: hideInstance };
    document.getElementById('schemaModeToggleButton').click();

    expect(hideInstance).toHaveBeenCalledTimes(1);
    expect(hideAll).toHaveBeenCalledWith({ duration: 0 });
  });

  test('schema mode help shows docs link only for Edit as Text and keeps sample button at end', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const helpIcon = document.getElementById('schemaModeHelpIcon');
    const editAsTextHtml = helpIcon.getAttribute('data-help-text');
    expect(editAsTextHtml).toContain('Generate To File docs');
    expect(editAsTextHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);

    document.getElementById('schemaModeToggleButton').click();
    const editAsSchemaHtml = helpIcon.getAttribute('data-help-text');
    expect(editAsSchemaHtml).not.toContain('Generate To File docs');
    expect(editAsSchemaHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);
  });

  test('text mode preserves comments while schema rows exclude them', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();

    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = '# note\nPriority\nenum(high,medium,low)\n\nStatus\nenum(active,inactive,pending)';
    toggle.click();

    expect(page.schemaRows.length).toBe(2);
    expect(page.schemaRows[0].name).toBe('Priority');
    expect(page.schemaRows[1].name).toBe('Status');

    toggle.click();
    expect(document.getElementById('generatorSchemaText').value).toContain('# note');
  });

  test('text mode round-trip preserves blank lines exactly', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const originalText = '# note\n\nPriority\nenum(high,medium,low)\n\n\nStatus\nenum(active,inactive,pending)';
    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = originalText;

    toggle.click();
    toggle.click();

    expect(document.getElementById('generatorSchemaText').value).toBe(originalText);
  });

  test('text mode accepts hash-prefixed rule text after a column name', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();

    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = 'Color\n#[A-F0-9]{6}';
    toggle.click();

    expect(alertFn).not.toHaveBeenCalled();
    expect(page.schemaRows.length).toBe(1);
    expect(page.schemaRows[0].name).toBe('Color');
    expect(page.schemaRows[0].value).toBe('#[A-F0-9]{6}');
  });

  test('maps science.chemicalElement.name to domain command without treating trailing name as params', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const parsed = page.parseSchemaTextToRows('Element\nscience.chemicalElement.name');
    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0].sourceType).toBe('domain');
    expect(parsed.rows[0].command).toBe('chemicalElement.name');
    expect(parsed.rows[0].params).toBe('');
  });

  test('adding schema rows does not discard existing parsed comments', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    let toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = '# note one\nFirst\none\n\n# note two\nSecond\ntwo';
    toggle.click();

    page.addRowAfter(page.schemaRows.length - 1);
    const newRow = page.schemaRows[page.schemaRows.length - 1];
    newRow.name = 'Third';
    newRow.sourceType = 'literal';
    newRow.value = 'three';

    toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const rebuilt = document.getElementById('generatorSchemaText').value;
    expect(rebuilt).toContain('# note one');
    expect(rebuilt).toContain('# note two');
    expect(rebuilt).toContain('Third\nliteral(three)');
  });

  test('adding schema rows preserves whitespace-only blank lines in parsed comment blocks', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    let toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = '# note one\n   \nFirst\none\n\n# note two\nSecond\ntwo';
    toggle.click();

    page.addRowAfter(page.schemaRows.length - 1);
    const newRow = page.schemaRows[page.schemaRows.length - 1];
    newRow.name = 'Third';
    newRow.sourceType = 'literal';
    newRow.value = 'three';

    toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const rebuilt = document.getElementById('generatorSchemaText').value;

    expect(rebuilt).toContain('# note one\n   \nFirst');
    expect(rebuilt).toContain('# note two');
    expect(rebuilt).toContain('Third\nliteral(three)');
  });

  test('reordering schema rows keeps blank line before moved response-time row', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();
    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = `# pairwise enums
HTTP Method
enum(GET,POST,PUT,DELETE)

# pairwise enums
Content Type
enum("application/json","application/xml","text/plain")

# randomized fields
User ID
number.int
Request Timestamp
date.recent
Email Address
internet.email

Response Time
number.int

Authorization Token
[A-Fa-f0-9]{32}`;
    toggle.click();

    const responseIndex = page.schemaRows.findIndex((row) => row.name === 'Response Time');
    page.moveRow(responseIndex, -1);
    toggle.click();

    const rebuilt = document.getElementById('generatorSchemaText').value;
    expect(rebuilt).toMatch(
      /Request Timestamp\s*\ndate\.recent\s*\n\s*\nResponse Time\s*\nnumber\.int\s*\nEmail Address\s*\ninternet\.email/
    );
  });

  test('edit as text shows empty textarea for untouched blank schema', () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();

    const textArea = document.getElementById('generatorSchemaText');
    expect(textArea.value).toBe('');
  });

  test('can generate directly from text mode without toggling back to schema mode', async () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();

    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = 'City\nLondon';
    document.getElementById('generateRowsCount').value = '2';

    await page.generateDataFile();

    expect(alertFn).not.toHaveBeenCalled();
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.csv',
      text: 'csv:async:2',
    });
  });

  test('invalid text schema shows inline missing-definition error for 5 seconds when toggling to schema mode', () => {
    jest.useFakeTimers();
    try {
      const page = new DataGeneratorPage({
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
      page.init();

      const toggle = document.getElementById('schemaModeToggleButton');
      toggle.click();

      const textArea = document.getElementById('generatorSchemaText');
      textArea.value = 't1\n';
      toggle.click();

      const schemaErrorStatus = document.getElementById('generatorSchemaErrorText');
      expect(schemaErrorStatus.textContent).toBe(
        'column t1 requires a data definition, use \'literal("")\' for blank data'
      );
      expect(document.getElementById('generatorStatusText').textContent).toBe('');
      expect(alertFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(4999);
      expect(schemaErrorStatus.textContent).toBe(
        'column t1 requires a data definition, use \'literal("")\' for blank data'
      );

      jest.advanceTimersByTime(1);
      expect(schemaErrorStatus.textContent).toBe('');
    } finally {
      jest.useRealTimers();
    }
  });

  test('empty text mode schema keeps zero rows and shows add-row validation', async () => {
    const page = new DataGeneratorPage({
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
    page.init();

    const toggle = document.getElementById('schemaModeToggleButton');
    toggle.click();

    const textArea = document.getElementById('generatorSchemaText');
    textArea.value = '';

    await page.generateDataFile();

    expect(document.getElementById('generatorSchemaErrorText').textContent).toBe('Add at least one schema row.');
    expect(page.schemaRows).toEqual([]);
  });
});
