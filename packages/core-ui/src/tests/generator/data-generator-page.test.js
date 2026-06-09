import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createDataGeneratorPage } from '../../../js/gui_components/generator/runtime/create-generator-page.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  schemaRowsToSpec as schemaRowsToSpecHelper,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensHelper,
  validateSchemaRows as validateSchemaRowsHelper,
} from '../../../js/gui_components/generator/runtime/generator-schema-rule-helpers.js';
import { createUninitializedDataGeneratorPage } from '../../../js/gui_components/generator/runtime/create-generator-page.js';
import { getOutputFormatGroups } from '../../../js/gui_components/generator/options/options-ui-schema.js';
import { TestDataGenerator } from '../../../../core/js/data_generation/testDataGenerator.js';

function schemaRowsToSpec(schemaRows) {
  return schemaRowsToSpecHelper({ schemaRows, dataRulesToSchemaText });
}

function schemaRowsToSpecWithTokens(schemaRows, schemaTokens) {
  return schemaRowsToSpecWithTokensHelper({ schemaRows, schemaTokens, dataRulesToSchemaText });
}

function validateSchemaRows(schemaRows) {
  return validateSchemaRowsHelper({ schemaRows });
}

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

  function createUnmountedPage(options = {}) {
    return createUninitializedDataGeneratorPage(options);
  }

  function getSchemaModeToggleButton() {
    return document.querySelector('[data-role="schema-mode-toggle"]');
  }

  function getSchemaModeHelpIcon() {
    return document.querySelector('[data-role="schema-mode-help"]');
  }

  function getSchemaDefinitionRoot() {
    return document.querySelector('[data-role="generator-schema-definition-root"]');
  }

  function getSchemaRowsContainer() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-rows-region"]');
  }

  function getSchemaTextContainer() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-text-region"]');
  }

  function getSchemaTextArea() {
    return getSchemaDefinitionRoot()?.querySelector('[data-role="schema-textbox"]');
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

  test('constructor does not require a global document before init', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const page = createUninitializedDataGeneratorPage({
        parentElement: null,
        faker: { word: { noun: () => 'x' } },
        RandExp: function RandExp() {},
        TabulatorCtor: FakeTabulator,
        GridExtensionClass: FakeGridExtension,
        ExporterClass: FakeExporter,
        DownloadClass: FakeDownload,
        TestDataGeneratorClass: TestDataGenerator,
      });

      expect(page.documentObj).toBeNull();
    } finally {
      global.document = originalDocument;
    }
  });

  test('uninitialized page exposes the direct runtime api before init', () => {
    const page = createUnmountedPage({
      parentElement: null,
      faker: { word: { noun: () => 'x' } },
      RandExp: function RandExp() {},
      TabulatorCtor: FakeTabulator,
      GridExtensionClass: FakeGridExtension,
      ExporterClass: FakeExporter,
      DownloadClass: FakeDownload,
      TestDataGeneratorClass: TestDataGenerator,
    });

    expect(typeof page.init).toBe('function');
    expect(typeof page.destroy).toBe('function');
    expect(typeof page.applyCurrentTypeOptions).toBe('function');
    expect(typeof page.previewData).toBe('function');
    expect(typeof page.generateDataFile).toBe('function');
    expect(typeof page.generateAllPairsDataFile).toBe('function');
    expect(typeof page.openGenerateCombinationsDialog).toBe('function');
    expect(typeof page.generateCombinationsDataFile).toBe('function');
    expect(typeof page.updateAllPairsButtonVisibility).toBe('function');
    expect(typeof page.getSelectedOutputType).toBe('function');
    expect(typeof page.syncGeneratorControlsFormatStateIfChanged).toBe('function');
    expect(typeof page.renderSchemaRows).toBe('function');
    expect(typeof page.getPreviewRowCount).toBe('function');
    expect(typeof page.getGenerateRowCount).toBe('function');
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

  test('schema validation reports unknown domain command and annotates the row', () => {
    const result = validateSchemaRows([{ name: 'First', sourceType: 'domain', command: 'person.fullNam' }]);
    expect(result.errors.map((error) => error.code)).toEqual(['unknown_domain_command']);
    expect(result.errors.map((error) => error.message)).toEqual(['Row 1: unknown domain command "person.fullNam".']);
    expect(result.rows[0].validation).toEqual({
      valid: false,
      issues: [
        {
          code: 'unknown_domain_command',
          field: 'command',
          line: 1,
          message: 'Row 1: unknown domain command "person.fullNam".',
        },
      ],
      message: 'Row 1: unknown domain command "person.fullNam".',
    });
  });

  test('schema validation reports unknown faker command and annotates the row', () => {
    const result = validateSchemaRows([{ name: 'First', sourceType: 'faker', command: 'helpers.fak' }]);
    expect(result.errors.map((error) => error.code)).toEqual(['unknown_faker_command']);
    expect(result.errors.map((error) => error.message)).toEqual(['Row 1: unknown faker command "helpers.fak".']);
    expect(result.rows[0].validation.message).toBe('Row 1: unknown faker command "helpers.fak".');
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

  test('explicit row count getters return invalid results when components are unavailable', () => {
    const page = createUninitializedDataGeneratorPage({
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

    expect(page.getPreviewRowCount()).toEqual({
      value: 0,
      valid: false,
      errors: ['Preview row count must be a number greater than or equal to 0.'],
    });
    expect(page.getGenerateRowCount()).toEqual({
      value: 0,
      valid: false,
      errors: ['Generate row count must be a number greater than or equal to 0.'],
    });
  });

  test('getSelectedOutputType falls back to controls state and then csv by default', () => {
    const page = createUninitializedDataGeneratorPage({
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

    expect(page.getSelectedOutputType()).toBe('csv');

    page.generatorControls = {
      getState: jest.fn(() => ({ selectedFormat: 'markdown' })),
    };
    expect(page.getSelectedOutputType()).toBe('markdown');
  });

  test('syncGeneratorControlsFormatStateIfChanged only resyncs controls when format changes', () => {
    const page = createUninitializedDataGeneratorPage({
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
      syncFormatState: jest.fn(),
    };

    expect(page.syncGeneratorControlsFormatStateIfChanged('json', 'json')).toBe(false);
    expect(page.generatorControls.syncFormatState).not.toHaveBeenCalled();

    expect(page.syncGeneratorControlsFormatStateIfChanged('json', 'csv')).toBe(true);
    expect(page.generatorControls.syncFormatState).toHaveBeenCalledWith('json');
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

  test('updateAllPairsButtonVisibility delegates pairwise calculation to the schema generation service', () => {
    const page = createUninitializedDataGeneratorPage({
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
    page.generatorSchemaState = {
      getCurrentSchemaState: jest.fn(() => ({
        rows: [{ name: 'Browser', sourceType: 'enum', value: 'enum(chrome,firefox,safari)' }],
        errors: [],
      })),
    };
    page.generatorSchemaGenerationService = {
      getPairwiseVisibility: jest.fn(({ getCurrentSchemaState }) => getCurrentSchemaState().rows.length > 1),
    };

    expect(page.updateAllPairsButtonVisibility()).toBe(false);

    expect(page.generatorSchemaGenerationService.getPairwiseVisibility).toHaveBeenCalledTimes(1);
    expect(page.generatorSchemaState.getCurrentSchemaState).toHaveBeenCalledTimes(1);
    expect(page.generatorControls.setPairwiseVisible).toHaveBeenCalledWith(false);
  });

  test('page workflow methods delegate through the runtime actions bridge', async () => {
    const page = createUninitializedDataGeneratorPage({
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

    const applyCurrentTypeOptions = jest.fn(() => ({ resolvedType: 'json' }));
    const previewData = jest.fn();
    const generateDataFile = jest.fn(async () => {});
    const generateAllPairsDataFile = jest.fn(async () => {});
    const openGenerateCombinationsDialog = jest.fn();
    const generateCombinationsDataFile = jest.fn(async () => {});
    const updateAllPairsButtonVisibility = jest.fn(() => true);
    page.generatorRuntimeActions = {
      applyCurrentTypeOptions,
      previewData,
      generateDataFile,
      generateAllPairsDataFile,
      openGenerateCombinationsDialog,
      generateCombinationsDataFile,
      updateAllPairsButtonVisibility,
    };

    expect(page.applyCurrentTypeOptions({ outputFormat: 'json' })).toEqual({ resolvedType: 'json' });
    page.previewData();
    await page.generateDataFile();
    await page.generateAllPairsDataFile();
    page.openGenerateCombinationsDialog();
    await page.generateCombinationsDataFile({ strength: 3, algorithm: 'greedy' });
    expect(page.updateAllPairsButtonVisibility()).toBe(true);

    expect(applyCurrentTypeOptions).toHaveBeenCalledWith({ outputFormat: 'json' });
    expect(previewData).toHaveBeenCalledTimes(1);
    expect(generateDataFile).toHaveBeenCalledTimes(1);
    expect(generateAllPairsDataFile).toHaveBeenCalledTimes(1);
    expect(openGenerateCombinationsDialog).toHaveBeenCalledTimes(1);
    expect(generateCombinationsDataFile).toHaveBeenCalledWith({ strength: 3, algorithm: 'greedy' });
    expect(updateAllPairsButtonVisibility).toHaveBeenCalledTimes(1);
  });

  test('remaining page facade methods delegate to focused state/view bridges', () => {
    const page = createUninitializedDataGeneratorPage({
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

    page.generatorViewState = {
      getSelectedOutputType: jest.fn(() => 'json'),
      syncGeneratorControlsFormatStateIfChanged: jest.fn(() => true),
      getPreviewRowCount: jest.fn(() => ({ value: 5, valid: true, errors: [] })),
      getGenerateRowCount: jest.fn(() => ({ value: 9, valid: true, errors: [] })),
    };
    page.generatorSchemaState = {
      getRows: jest.fn(() => [{ id: 'row-1' }]),
      setRows: jest.fn(),
      getTokens: jest.fn(() => [{ kind: 'rule' }]),
      setTokens: jest.fn(),
      getTextMode: jest.fn(() => true),
      setTextMode: jest.fn(),
      renderSchemaRows: jest.fn(),
    };

    expect(page.getSelectedOutputType()).toBe('json');
    expect(page.syncGeneratorControlsFormatStateIfChanged('markdown', 'json')).toBe(true);
    expect(page.getPreviewRowCount()).toEqual({ value: 5, valid: true, errors: [] });
    expect(page.getGenerateRowCount()).toEqual({ value: 9, valid: true, errors: [] });
    expect(page.schemaRows).toEqual([{ id: 'row-1' }]);
    expect(page.schemaTextTokens).toEqual([{ kind: 'rule' }]);
    expect(page.isTextMode).toBe(true);

    page.schemaRows = [{ id: 'next-row' }];
    page.schemaTextTokens = [{ kind: 'blank' }];
    page.isTextMode = false;
    page.renderSchemaRows();

    expect(page.generatorViewState.getSelectedOutputType).toHaveBeenCalledTimes(1);
    expect(page.generatorViewState.syncGeneratorControlsFormatStateIfChanged).toHaveBeenCalledWith('markdown', 'json');
    expect(page.generatorViewState.getPreviewRowCount).toHaveBeenCalledTimes(1);
    expect(page.generatorViewState.getGenerateRowCount).toHaveBeenCalledTimes(1);
    expect(page.generatorSchemaState.setRows).toHaveBeenCalledWith([{ id: 'next-row' }]);
    expect(page.generatorSchemaState.setTokens).toHaveBeenCalledWith([{ kind: 'blank' }]);
    expect(page.generatorSchemaState.setTextMode).toHaveBeenCalledWith(false);
    expect(page.generatorSchemaState.renderSchemaRows).toHaveBeenCalledTimes(1);
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
      'https://fakerjs.dev/api/word'
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
    expect(options).not.toContain('science.chemicalElement');
    expect(options).not.toContain('finance.currency');
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
    expect(helpLink.getAttribute('href')).toBe('https://fakerjs.dev/api/number');
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

  test('default validation errors surface inline and do not throw', () => {
    const page = createMountedPage({
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
    page.schemaRows = [{ id: '1', name: '', sourceType: 'regex', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    expect(() => page.previewData()).not.toThrow();
    expect(getSchemaErrorStatus().textContent).toBe('Row 1: column name is required.');
  });

  test('toggles between schema controls and text editing with round trip', () => {
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
    page.schemaRows = [{ id: '1', name: 'Name', sourceType: 'faker', command: 'word.noun', params: '()', value: '' }];
    page.renderSchemaRows();

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    expect(getSchemaTextContainer().style.display).toBe('block');
    expect(getSchemaRowsContainer().style.display).toBe('none');
    expect(toggle.textContent).toBe('Edit as Schema');
    expect(textArea.value).toContain('Name');
    expect(textArea.value).toContain('word.noun()');

    textArea.value = 'City\n[A-Z]{4}';
    toggle.click();

    expect(getSchemaTextContainer().style.display).toBe('none');
    expect(getSchemaRowsContainer().style.display).toBe('flex');
    expect(toggle.textContent).toBe('Edit as Text');
    expect(page.schemaRows[0].name).toBe('City');
    expect(page.schemaRows[0].value).toBe('[A-Z]{4}');
    expect(page.schemaRows[0].sourceType).toBe('regex');
  });

  test('text to schema to text preserves literal type as literal(...)', () => {
    createMountedPage({
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
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
    expect(getSchemaTextArea().value).toBe('dfffs\nliteral(t)');
  });

  test('row mode to text mode preserves in-progress faker row with empty command', () => {
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

    page.schemaRows = [{ id: '1', name: 'User Name', sourceType: 'faker', command: '', params: '', value: '' }];
    page.renderSchemaRows();

    getSchemaModeToggleButton().click();
    expect(getSchemaTextArea().value).toBe('User Name\n');
  });

  test('row action buttons work immediately after switching from text mode to schema mode', () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = 'A\none\nB\ntwo';
    toggle.click();

    expect(page.schemaRows).toHaveLength(2);
    const removeButtons = document.querySelectorAll('[data-action="remove"]');
    removeButtons[1].click();
    expect(page.schemaRows).toHaveLength(1);
  });

  test('semantic validation rerender preserves params caret position while editing', () => {
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
      { id: '1', name: 'Name', sourceType: 'domain', command: 'person.fullName', params: '(10)', value: '' },
    ];
    page.renderSchemaRows();

    const paramsInput = document.querySelector('input[data-field="params"]');
    paramsInput.focus();
    paramsInput.setSelectionRange(2, 2);

    page.schemaDefinition.applySemanticValidationForRow('1');

    const refreshedParamsInput = document.querySelector('input[data-field="params"]');
    expect(document.activeElement).toBe(refreshedParamsInput);
    expect(refreshedParamsInput.selectionStart).toBe(2);
    expect(refreshedParamsInput.selectionEnd).toBe(2);
    expect(refreshedParamsInput.value).toBe('(10)');
  });

  test('toggle clears visible help tooltips before switching schema mode', () => {
    const hideAll = jest.fn();
    window.tippy = { hideAll };

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

    const hideInstance = jest.fn();
    getSchemaModeHelpIcon()._tippy = { hide: hideInstance };
    getSchemaModeToggleButton().click();

    expect(hideInstance).toHaveBeenCalledTimes(1);
    expect(hideAll).toHaveBeenCalledWith({ duration: 0 });
  });

  test('schema mode help shows docs link only for Edit as Text and keeps sample button at end', () => {
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

    const helpIcon = getSchemaModeHelpIcon();
    const editAsTextHtml = helpIcon.getAttribute('data-help-text');
    expect(editAsTextHtml).toContain('Generate To File docs');
    expect(editAsTextHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);

    getSchemaModeToggleButton().click();
    const editAsSchemaHtml = helpIcon.getAttribute('data-help-text');
    expect(editAsSchemaHtml).not.toContain('Generate To File docs');
    expect(editAsSchemaHtml.trim().endsWith('Insert Example Schema</button>')).toBe(true);
  });

  test('text mode preserves comments while schema rows exclude them', () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = '# note\nPriority\nenum(high,medium,low)\n\nStatus\nenum(active,inactive,pending)';
    toggle.click();

    expect(page.schemaRows.length).toBe(2);
    expect(page.schemaRows[0].name).toBe('Priority');
    expect(page.schemaRows[1].name).toBe('Status');

    toggle.click();
    expect(getSchemaTextArea().value).toContain('# note');
  });

  test('text mode round-trip preserves blank lines exactly', () => {
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

    const originalText = '# note\n\nPriority\nenum(high,medium,low)\n\n\nStatus\nenum(active,inactive,pending)';
    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = originalText;

    toggle.click();
    toggle.click();

    expect(getSchemaTextArea().value).toBe(originalText);
  });

  test('text mode preserves previous typed method rows when command text becomes invalid', () => {
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
      { id: '1', name: 'Name', sourceType: 'domain', command: 'person.fullName', params: '', value: '' },
    ];
    page.renderSchemaRows();

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = 'Name\nperson.fullNam';
    toggle.click();

    expect(page.schemaRows).toHaveLength(1);
    expect(page.schemaRows[0].sourceType).toBe('domain');
    expect(page.schemaRows[0].command).toBe('person.fullNam');
    expect(page.schemaRows[0].params).toBe('');
    expect(page.schemaRows[0].value).toBe('');

    getPreviewRowsInput().value = '1';
    page.previewData();
    expect(getSchemaErrorStatus().textContent).toContain('Row 1: unknown domain command "person.fullNam".');
  });

  test('text mode accepts hash-prefixed rule text after a column name', () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = 'Color\n#[A-F0-9]{6}';
    toggle.click();

    expect(alertFn).not.toHaveBeenCalled();
    expect(page.schemaRows.length).toBe(1);
    expect(page.schemaRows[0].name).toBe('Color');
    expect(page.schemaRows[0].value).toBe('#[A-F0-9]{6}');
  });

  test('maps science.chemicalElement.name to domain command without treating trailing name as params', () => {
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

    const parsed = page.schemaDefinition.parseTextToRows('Element\nscience.chemicalElement.name');
    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0].sourceType).toBe('domain');
    expect(parsed.rows[0].command).toBe('chemicalElement.name');
    expect(parsed.rows[0].params).toBe('');
  });

  test('shared schema definition parser can be used directly when mounted on the page', () => {
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

    page.schemaDefinition = {
      parseTextToRows: jest.fn(() => ({
        rows: [{ name: 'Element', sourceType: 'domain', command: 'chemicalElement.name', params: '' }],
        errors: [],
        tokens: [],
      })),
    };

    const parsed = page.schemaDefinition.parseTextToRows('Element\nscience.chemicalElement.name');

    expect(page.schemaDefinition.parseTextToRows).toHaveBeenCalledWith('Element\nscience.chemicalElement.name');
    expect(parsed.errors).toEqual([]);
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0].command).toBe('chemicalElement.name');
  });

  test('adding schema rows does not discard existing parsed comments', () => {
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

    let toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = '# note one\nFirst\none\n\n# note two\nSecond\ntwo';
    toggle.click();

    page.schemaDefinition.addRowAfter(page.schemaRows.length - 1);
    const newRow = page.schemaRows[page.schemaRows.length - 1];
    newRow.name = 'Third';
    newRow.sourceType = 'literal';
    newRow.value = 'three';

    toggle = getSchemaModeToggleButton();
    toggle.click();
    const rebuilt = getSchemaTextArea().value;
    expect(rebuilt).toContain('# note one');
    expect(rebuilt).toContain('# note two');
    expect(rebuilt).toContain('Third\nliteral(three)');
  });

  test('adding schema rows preserves whitespace-only blank lines in parsed comment blocks', () => {
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

    let toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
    textArea.value = '# note one\n   \nFirst\none\n\n# note two\nSecond\ntwo';
    toggle.click();

    page.schemaDefinition.addRowAfter(page.schemaRows.length - 1);
    const newRow = page.schemaRows[page.schemaRows.length - 1];
    newRow.name = 'Third';
    newRow.sourceType = 'literal';
    newRow.value = 'three';

    toggle = getSchemaModeToggleButton();
    toggle.click();
    const rebuilt = getSchemaTextArea().value;

    expect(rebuilt).toContain('# note one\n   \nFirst');
    expect(rebuilt).toContain('# note two');
    expect(rebuilt).toContain('Third\nliteral(three)');
  });

  test('reordering schema rows keeps blank line before moved response-time row', () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();
    const textArea = getSchemaTextArea();
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
    page.schemaDefinition.moveRowAt(responseIndex, -1);
    toggle.click();

    const rebuilt = getSchemaTextArea().value;
    expect(rebuilt).toMatch(
      /Request Timestamp\s*\ndate\.recent\s*\n\s*\nResponse Time\s*\nnumber\.int\s*\nEmail Address\s*\ninternet\.email/
    );
  });

  test('edit as text shows empty textarea for untouched blank schema', () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    expect(textArea.value).toBe('');
  });

  test('can generate directly from text mode without toggling back to schema mode', async () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = 'City\nLondon';
    getGenerateRowsInput().value = '2';

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

      const toggle = getSchemaModeToggleButton();
      toggle.click();

      const textArea = getSchemaTextArea();
      textArea.value = 't1\n';
      toggle.click();

      const schemaErrorStatus = getSchemaErrorStatus();
      expect(schemaErrorStatus.textContent).toBe(
        'column t1 requires a data definition, use \'literal("")\' for blank data'
      );
      expect(getGenerationStatus().textContent).toBe('');
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

  test('schema mode toggle routes schema error and clear callbacks through the schema runtime bridge', () => {
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

    const showSchemaErrorStatus = jest.fn();
    const clearSchemaErrorStatus = jest.fn();
    page.generatorSchemaRuntime = {
      ...page.generatorSchemaRuntime,
      showSchemaErrorStatus,
      clearSchemaErrorStatus,
    };

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = 't1\n';
    toggle.click();

    expect(showSchemaErrorStatus).toHaveBeenCalledWith(
      'column t1 requires a data definition, use \'literal("")\' for blank data'
    );

    textArea.value = 'City\nliteral(London)';
    toggle.click();
    toggle.click();

    expect(clearSchemaErrorStatus).toHaveBeenCalled();
  });

  test('empty text mode schema keeps zero rows and shows add-row validation', async () => {
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

    const toggle = getSchemaModeToggleButton();
    toggle.click();

    const textArea = getSchemaTextArea();
    textArea.value = '';

    await page.generateDataFile();

    expect(getSchemaErrorStatus().textContent).toBe('Add at least one schema row.');
    expect(page.schemaRows).toEqual([]);
  });
});
