import { JSDOM } from 'jsdom';
import {
  DataGeneratorPage,
  buildRuleSpecFromSchemaRow,
  schemaRowsToSpec,
  validateSchemaRows,
} from '../../js/gui_components/data-generator-page.js';

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
      jsonl: { options: { outputAsJsonLines: true, prettyPrint: false, asObject: false } },
      xml: { options: { rootElementName: 'root', itemElementName: 'item', includeXmlHeader: true } },
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
    this.getLastWarningsForType = jest.fn(() => []);
    FakeExporter.lastInstance = this;
  }

  canExport(type) {
    return ['csv', 'json', 'jsonl', 'xml', 'markdown'].includes(type);
  }

  getFileExtensionFor(type) {
    if (type === 'jsonl') {
      return '.jsonl';
    }
    if (type === 'json') {
      return '.json';
    }
    if (type === 'markdown') {
      return '.md';
    }
    if (type === 'xml') {
      return '.xml';
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

class FakeTestDataGenerator {
  constructor() {
    this.rules = [];
    this._errors = [];
    this.compiler = {
      validate: () => {},
    };
  }

  importSpec(text) {
    const lines = text.split('\n');
    this.rules = [];
    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i] === undefined || lines[i + 1] === undefined) {
        continue;
      }
      this.rules.push({
        name: lines[i],
        ruleSpec: lines[i + 1],
        type: '',
      });
    }
  }

  compile() {
    this.rules.forEach((rule) => {
      const spec = String(rule.ruleSpec || '');
      if (spec.startsWith('word.')) {
        rule.type = 'faker';
        return;
      }
      if (spec.startsWith('[') || spec.includes('{')) {
        rule.type = 'regex';
        return;
      }
      rule.type = 'literal';
    });
  }

  testDataRules() {
    return this.rules;
  }

  isValid() {
    return this._errors.length === 0;
  }

  errors() {
    return this._errors;
  }

  generateHeadersArray() {
    return this.rules.map((rule) => rule.name);
  }

  generateRow() {
    return this.rules.map((rule) => `${rule.type}:${rule.ruleSpec}`);
  }
}

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

  test('schema helper mapping supports faker, regex and literal', () => {
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'faker', command: 'faker.person.firstName', params: '()' })).toBe(
      'person.firstName()'
    );
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'regex', value: '[A-Z]{3}' })).toBe('[A-Z]{3}');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'literal', value: 'Fixed' })).toBe('Fixed');

    const spec = schemaRowsToSpec([
      { name: 'A', sourceType: 'faker', command: 'word.noun', params: '()' },
      { name: 'B', sourceType: 'literal', value: 'x' },
    ]);
    expect(spec).toBe('A\nword.noun()\nB\nx');
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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
    expect(result.errors).toContain('Row 1: column name is required.');
    expect(result.errors).toContain('Row 2: faker command is required.');
  });

  test('preview generates data into tabulator grid extension', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    page.schemaRows = [
      { id: '1', name: 'Name', sourceType: 'faker', command: 'word.noun', params: '()', value: '' },
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();

    document.getElementById('previewRowsCount').value = '51';
    page.previewData();

    expect(alertFn).toHaveBeenCalledWith('previewRowsCount must be less than or equal to 50.');
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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

  test('output format list includes JSONL and preview updates for JSONL', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    const outputSelect = document.getElementById('generatorOutputFormat');
    const availableTypes = Array.from(outputSelect.options).map((option) => option.value);
    expect(availableTypes).toContain('jsonl');

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('previewRowsCount').value = '2';
    page.previewData();

    outputSelect.value = 'jsonl';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(document.getElementById('generatorOutputPreview').value).toBe('jsonl:sync:2');
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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

  test('renders JSONL options panel with only number convert option', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    const outputSelect = document.getElementById('generatorOutputFormat');
    outputSelect.value = 'jsonl';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(document.querySelector('#generatorOptionsPanel .jsonl-options')).not.toBeNull();
    expect(document.querySelector("#generatorOptionsPanel input[name='numbersnumeric']")).not.toBeNull();
    expect(document.querySelector("#generatorOptionsPanel input[name='prettyprint']")).toBeNull();
    expect(FakeExporter.lastInstance.getOptionsForType).toHaveBeenCalledWith('jsonl');
  });

  test('generate downloads jsonl file when JSONL format is selected', async () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('generateRowsCount').value = '4';
    document.getElementById('generatorOutputFormat').value = 'jsonl';

    await page.generateDataFile();

    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.jsonl',
      text: 'jsonl:async:4',
    });
  });

  test('renders XML options panel when selected', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    const outputSelect = document.getElementById('generatorOutputFormat');
    outputSelect.value = 'xml';
    outputSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(document.querySelector('#generatorOptionsPanel .xml-options')).not.toBeNull();
    expect(FakeExporter.lastInstance.getOptionsForType).toHaveBeenCalledWith('xml');
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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

  test('preview surfaces export warnings via status and alert function', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    FakeExporter.lastInstance.getLastWarningsForType.mockReturnValue(['Auto-fixed XML item name']);
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('generatorOutputFormat').value = 'xml';
    document.getElementById('previewRowsCount').value = '1';

    page.previewData();

    expect(alertFn).toHaveBeenCalledWith('XML warning:\nAuto-fixed XML item name');
    expect(document.getElementById('generatorStatusText').textContent).toContain('XML warning');
  });

  test('generate surfaces warnings and keeps xml filename', async () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    FakeExporter.lastInstance.getLastWarningsForType.mockReturnValue(['Ignored unknown XML attribute column: Missing']);
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'literal', command: '', params: '', value: 'fixed' }];
    page.renderSchemaRows();
    document.getElementById('generateRowsCount').value = '2';
    document.getElementById('generatorOutputFormat').value = 'xml';

    await page.generateDataFile();

    expect(alertFn).toHaveBeenCalledWith('XML warning:\nIgnored unknown XML attribute column: Missing');
    expect(FakeDownload.lastDownload).toEqual({
      filename: 'generated-data.xml',
      text: 'xml:async:2',
    });
    expect(document.getElementById('generatorStatusText').textContent).toContain('Download ready with warnings');
  });

  test('shows faker fields only for faker source and value only for regex/literal', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    page.schemaRows = [{ id: '1', name: 'A', sourceType: 'regex', command: 'word.noun', params: '()', value: '[A-Z]' }];
    page.renderSchemaRows();

    let rowElem = document.querySelector('.generator-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).toBeNull();
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').hidden).toBe(false);
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').getAttribute('data-help-text')).toContain(
      'https://anywaydata.com/docs/test-data/regex-test-data'
    );
    expect(rowElem.querySelector('[data-field="params"]')).toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).not.toBeNull();

    rowElem.querySelector('[data-field="sourceType"]').value = 'faker';
    rowElem.querySelector('[data-field="sourceType"]').dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    rowElem = document.querySelector('.generator-schema-row');
    expect(rowElem.querySelector('[data-field="command"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').hidden).toBe(false);
    expect(rowElem.querySelector('[data-field="faker-doc-link"]').getAttribute('data-help-text')).toContain(
      'https://fakerjs.dev/api/word'
    );
    expect(rowElem.querySelector('[data-field="params"]')).not.toBeNull();
    expect(rowElem.querySelector('[data-field="value"]')).toBeNull();
  });

  test('shows schema help tippy content for faker, regex and literal sources', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();

    page.schemaRows = [{ id: '1', name: 'Plane', sourceType: 'faker', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    let helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    let helpText = helpLink.getAttribute('data-help-text');
    expect(helpText).toContain('Faker');
    expect(helpText).toContain('https://anywaydata.com/docs/test-data/faker-test-data');

    const commandSelect = document.querySelector('[data-field="command"]');
    commandSelect.value = 'person.firstName';
    commandSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    helpText = helpLink.getAttribute('data-help-text');
    expect(helpText).toContain('faker.person.firstName');
    expect(helpText).toContain('https://fakerjs.dev/api/person');
    expect(helpText).toContain('Params:');
    expect(helpText).toContain("sex?: 'female' | 'male'");
    expect(helpText).toContain('Example:');

    page.schemaRows[0].sourceType = 'regex';
    page.renderSchemaRows();
    helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    helpText = helpLink.getAttribute('data-help-text');
    expect(helpText).toContain('Regex');
    expect(helpText).toContain('https://anywaydata.com/docs/test-data/regex-test-data');

    page.schemaRows[0].sourceType = 'literal';
    page.renderSchemaRows();
    helpLink = document.querySelector('[data-field="faker-doc-link"]');
    expect(helpLink.hidden).toBe(false);
    helpText = helpLink.getAttribute('data-help-text');
    expect(helpText).toContain('Literal');
    expect(helpText).toContain('https://anywaydata.com/docs/category/generating-data');
  });

  test('default alert invocation does not throw on validation errors', () => {
    dom.window.alert = jest.fn();
    const page = new DataGeneratorPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: FakeTestDataGenerator,
    });
    page.init();
    page.schemaRows = [{ id: '1', name: '', sourceType: 'regex', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    expect(() => page.previewData()).not.toThrow();
    expect(dom.window.alert).toHaveBeenCalled();
  });

  test('toggles between schema controls and text editing with round trip', () => {
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
      TestDataGeneratorClass: FakeTestDataGenerator,
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
});
