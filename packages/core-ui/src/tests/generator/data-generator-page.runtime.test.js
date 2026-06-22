import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { dataRulesToSchemaText } from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createUninitializedDataGeneratorPage } from '../../../js/gui_components/generator/runtime/create-generator-page.js';
import {
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  schemaRowsToSpec as schemaRowsToSpecHelper,
  schemaRowsToSpecWithTokens as schemaRowsToSpecWithTokensHelper,
  validateSchemaRows as validateSchemaRowsHelper,
} from '../../../js/gui_components/generator/runtime/generator-schema-rule-helpers.js';
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

function createUnmountedPage(overrides = {}) {
  return createUninitializedDataGeneratorPage({
    parentElement: overrides.parentElement ?? null,
    documentObj: overrides.documentObj,
    alertFn: overrides.alertFn,
    faker: overrides.faker || { word: { noun: () => 'x' } },
    RandExp: overrides.RandExp || function RandExp() {},
    TabulatorCtor: overrides.TabulatorCtor || FakeTabulator,
    GridExtensionClass: overrides.GridExtensionClass || FakeGridExtension,
    ExporterClass: overrides.ExporterClass || FakeExporter,
    DownloadClass: overrides.DownloadClass || FakeDownload,
    TestDataGeneratorClass: overrides.TestDataGeneratorClass || TestDataGenerator,
  });
}

describe('generator page runtime helpers', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`);
    global.document = dom.window.document;
    global.window = dom.window;
    FakeDownload.lastDownload = undefined;
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
    expect(buildRuleSpecFromSchemaRow({ name: 'Code', sourceType: 'regex', value: '   ' })).toBe('');
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

  test('schema validation reports missing regex value', () => {
    const result = validateSchemaRows([{ name: 'Code', sourceType: 'regex', value: '   ' }]);
    expect(result.errors.map((error) => error.code)).toEqual(['missing_regex_value']);
    expect(result.errors.map((error) => error.message)).toEqual(['Row 1: regex value is required.']);
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

  test('constructor does not require a global document before init', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      const page = createUnmountedPage();
      expect(page.documentObj).toBeNull();
    } finally {
      global.document = originalDocument;
    }
  });

  test('uninitialized page exposes the direct runtime api before init', () => {
    const page = createUnmountedPage();

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

  test('explicit row count getters return invalid results when components are unavailable', () => {
    const page = createUnmountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
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
    const page = createUnmountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
    });

    expect(page.getSelectedOutputType()).toBe('csv');

    page.generatorControls = {
      getState: jest.fn(() => ({ selectedFormat: 'markdown' })),
    };
    expect(page.getSelectedOutputType()).toBe('markdown');
  });

  test('syncGeneratorControlsFormatStateIfChanged only resyncs controls when format changes', () => {
    const page = createUnmountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
    });

    page.generatorControls = {
      syncFormatState: jest.fn(),
    };

    expect(page.syncGeneratorControlsFormatStateIfChanged('json', 'json')).toBe(false);
    expect(page.generatorControls.syncFormatState).not.toHaveBeenCalled();

    expect(page.syncGeneratorControlsFormatStateIfChanged('json', 'csv')).toBe(true);
    expect(page.generatorControls.syncFormatState).toHaveBeenCalledWith('json');
  });

  test('updateAllPairsButtonVisibility delegates pairwise calculation to the schema generation service', () => {
    const page = createUnmountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
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
    const page = createUnmountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
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
    const page = createUnmountedPage({
      parentElement: document.getElementById('app'),
      documentObj: document,
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
});
