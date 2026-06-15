import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createTestDataGenerationService } from '../../../../js/gui_components/app/test-data-grid/generation/test-data-generation-service.js';

describe('test-data-generation-service', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('generateTestData validates schema rows once before creating the generator', async () => {
    const validateCurrentSchemaRows = jest.fn(() => ({
      errors: [],
      rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
    }));
    const setTestDataLoadingStatus = jest.fn();
    const setGenerateBusy = jest.fn();

    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Active'],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(() => ({
        getRowCount: () => 3,
      })),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus,
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows,
      getImporter: () => ({ setGridFromGenericDataTable: jest.fn() }),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 3,
      setGenerateBusy,
    });

    await service.generateTestData();

    expect(validateCurrentSchemaRows).toHaveBeenCalledTimes(1);
    expect(validateCurrentSchemaRows).toHaveBeenCalledWith(undefined);
    expect(setTestDataLoadingStatus.mock.calls).toEqual([
      ['Validating schema...'],
      ['Generating rows...'],
      ['Applying data to grid...'],
    ]);
    expect(setGenerateBusy.mock.calls).toEqual([[true], [false]]);
  });

  test('generateTestData prefers composed schema text so constraints are preserved in row mode', async () => {
    const validateCurrentSchemaRows = jest.fn(() => ({
      errors: [],
      rows: [{ name: 'Status', sourceType: 'enum', value: '"Open","Closed"' }],
    }));
    const schemaTextToDataRules = jest.fn(() => ({
      dataRules: [{ name: 'Status', ruleSpec: 'enum("Open","Closed")', type: 'enum' }],
      errors: [],
      schemaTokens: [
        { kind: 'rule' },
        { kind: 'constraint', text: 'IF [Status] = "Open" THEN [Status] = "Closed" ENDIF' },
      ],
      constraints: [{ sourceText: 'IF [Status] = "Open" THEN [Status] = "Closed" ENDIF' }],
      generator: {
        generateHeadersArray: () => ['Status'],
        generateRow: () => ['Closed'],
        testDataRules: () => [{ type: 'enum' }],
        schemaConstraints: () => [{ sourceText: 'IF [Status] = "Open" THEN [Status] = "Closed" ENDIF' }],
      },
    }));

    const service = createTestDataGenerationService({
      schemaTextToDataRules,
      TestDataGeneratorClass: class {},
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(() => ({
        getRowCount: () => 1,
      })),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nenum("Open","Closed")'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      getSchemaText: () => 'Status\nenum("Open","Closed")\n\nIF [Status] = "Open" THEN [Status] = "Closed" ENDIF',
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows,
      getImporter: () => ({ setGridFromGenericDataTable: jest.fn() }),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 1,
      setGenerateBusy: jest.fn(),
    });

    await service.generateTestData();

    expect(schemaTextToDataRules).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaText: 'Status\nenum("Open","Closed")\n\nIF [Status] = "Open" THEN [Status] = "Closed" ENDIF',
      })
    );
  });

  test('generatePairwiseTestData validates schema rows once before creating the generator', async () => {
    const validateCurrentSchemaRows = jest.fn(() => ({
      errors: [],
      rows: [
        { name: 'Status', sourceType: 'enum', value: 'a,b' },
        { name: 'Type', sourceType: 'enum', value: 'x,y' },
      ],
    }));
    const setTestDataLoadingStatus = jest.fn();
    const setGeneratePairwiseBusy = jest.fn();

    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{ type: 'enum' }, { type: 'enum' }],
      isValid: () => true,
      errors: () => [],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class FakePairwiseTestDataGenerator {
        initializeFromRules() {
          return { isError: false };
        }
        generateAllDataRecordsAsRows() {
          return {
            isError: false,
            data: {
              data: [
                ['Status', 'Type'],
                ['a', 'x'],
              ],
            },
          };
        }
      },
      GenericDataTableClass: class FakeGenericDataTable {
        constructor() {
          this.headers = [];
          this.rows = [];
        }
        setHeaders(headers) {
          this.headers = headers;
        }
        appendDataRow(row) {
          this.rows.push(row);
        }
        getRowCount() {
          return this.rows.length;
        }
        getRow(index) {
          return this.rows[index];
        }
      },
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nenum(a,b)\nType\nenum(x,y)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus,
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows,
      getImporter: () => ({ setGridFromGenericDataTable: jest.fn() }),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      setGeneratePairwiseBusy,
    });

    await service.generatePairwiseTestData();

    expect(validateCurrentSchemaRows).toHaveBeenCalledTimes(1);
    expect(validateCurrentSchemaRows).toHaveBeenCalledWith(undefined);
    expect(setTestDataLoadingStatus.mock.calls).toEqual([
      ['Generating pairwise...'],
      ['Generating pairwise combinations...'],
      ['Applying data to grid...'],
    ]);
    expect(setGeneratePairwiseBusy.mock.calls).toEqual([[true], [false]]);
  });

  test('generateCombinationsTestData validates enum availability and applies the generated table', async () => {
    const validateCurrentSchemaRows = jest.fn(() => ({
      errors: [],
      rows: [
        { name: 'Status', sourceType: 'enum', value: 'active,inactive,pending' },
        { name: 'Type', sourceType: 'enum', value: 'admin,user' },
        { name: 'Priority', sourceType: 'enum', value: 'high,low' },
      ],
    }));
    const setTestDataLoadingStatus = jest.fn();
    const setTestDataStatus = jest.fn();
    const setGeneratePairwiseBusy = jest.fn();
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };

    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{ type: 'enum' }, { type: 'enum' }, { type: 'enum' }],
      isValid: () => true,
      errors: () => [],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      CombinationsTestDataGeneratorClass: class FakeCombinationsTestDataGenerator {
        initializeFromRules(_rules, options) {
          this.options = options;
          return { isError: false };
        }
        generateAllDataRecordsAsRows() {
          return {
            isError: false,
            data: {
              data: [
                ['Status', 'Type', 'Priority'],
                ['active', 'admin', 'high'],
                ['inactive', 'user', 'low'],
              ],
            },
          };
        }
      },
      GenericDataTableClass: class FakeGenericDataTable {
        constructor() {
          this.headers = [];
          this.rows = [];
        }
        setHeaders(headers) {
          this.headers = headers;
        }
        appendDataRow(row) {
          this.rows.push(row);
        }
        getRowCount() {
          return this.rows.length;
        }
        getRow(index) {
          return this.rows[index];
        }
      },
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(
        () => 'Status\nenum(active,inactive,pending)\nType\nenum(admin,user)\nPriority\nenum(high,low)'
      ),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus,
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows,
      getImporter: () => importer,
      getTextPreviewRenderer: () => ({
        getState: () => ({ mode: 'preview', autoPreviewEnabled: true }),
        renderTextFromGrid: jest.fn(() => Promise.resolve()),
      }),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      setGeneratePairwiseBusy,
    });

    await service.generateCombinationsTestData({ strength: 2, algorithm: 'greedy' });

    expect(validateCurrentSchemaRows).toHaveBeenCalledTimes(3);
    expect(setTestDataLoadingStatus.mock.calls).toEqual([
      ['Generating 2-wise combinations...'],
      ['Applying data to grid...'],
    ]);
    expect(setGeneratePairwiseBusy.mock.calls).toEqual([[true], [false]]);
    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(setTestDataStatus).toHaveBeenCalledWith('Generated 2 2-wise combinations. Grid and preview updated.', {
      dismissable: true,
    });
    expect(service.countEnumColumns()).toBe(3);
    expect(service.getEnumValueCounts()).toEqual([3, 2, 2]);
  });

  test('generateCombinationsTestData prompts before large cartesian product runs and skips when cancelled', async () => {
    const validateCurrentSchemaRows = jest.fn(() => ({
      errors: [],
      rows: [
        { name: 'A', sourceType: 'enum', value: 'enum(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)' },
        { name: 'B', sourceType: 'enum', value: 'enum(b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11)' },
        { name: 'C', sourceType: 'enum', value: 'enum(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11)' },
        { name: 'D', sourceType: 'enum', value: 'enum(d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11)' },
      ],
    }));
    const requestConfirm = jest.fn(async () => false);
    const setTestDataStatus = jest.fn();
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };

    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{ type: 'enum' }, { type: 'enum' }, { type: 'enum' }, { type: 'enum' }],
      isValid: () => true,
      errors: () => [],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      CombinationsTestDataGeneratorClass: class FakeCombinationsTestDataGenerator {},
      GenericDataTableClass: class FakeGenericDataTable {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'schema'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows,
      getImporter: () => importer,
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      setGeneratePairwiseBusy: jest.fn(),
      requestConfirm,
    });

    await service.generateCombinationsTestData({ strength: 4, algorithm: 'cartesian-product' });

    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Cartesian product generation',
      message: expect.stringContaining('14,641'),
      okLabel: 'Run cartesian product',
      cancelLabel: 'Skip cartesian product',
    });
    expect(importer.setGridFromGenericDataTable).not.toHaveBeenCalled();
    expect(setTestDataStatus).toHaveBeenCalledWith('Cartesian product generation skipped.', {
      severity: 'warning',
      dismissable: true,
    });
  });

  test('countEnumColumns includes domain datatype.enum rows for app test-data generation', () => {
    const service = createTestDataGenerationService({
      TestDataGeneratorClass: class {},
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        errors: [],
        rows: [
          { name: 'Status', sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive,pending' },
          { name: 'Priority', sourceType: 'enum', value: 'enum(high,low)' },
        ],
      })),
      getImporter: jest.fn(),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
    });

    expect(service.countEnumColumns()).toBe(2);
    expect(service.getEnumValueCounts()).toEqual([3, 2]);
  });

  test('generateTestData refreshes the text preview automatically after a successful grid update when auto preview is enabled', async () => {
    const renderTextFromGrid = jest.fn(() => Promise.resolve());
    const setTestDataLoadingStatus = jest.fn();
    const setTestDataStatus = jest.fn();
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Active'],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(() => ({
        getRowCount: () => 3,
      })),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus,
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: () => ({
        getState: () => ({ mode: 'preview', autoPreviewEnabled: true }),
        renderTextFromGrid,
      }),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 3,
    });

    await service.generateTestData();

    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(setTestDataStatus).toHaveBeenCalledWith('Generate complete. Grid and preview updated.', {
      dismissable: true,
    });
  });

  test('generateTestData does not refresh the text preview when auto preview is disabled in preview mode', async () => {
    const renderTextFromGrid = jest.fn(() => Promise.resolve());
    const setTestDataStatus = jest.fn();
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Active'],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(() => ({
        getRowCount: () => 3,
      })),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: () => ({
        getState: () => ({ mode: 'preview', autoPreviewEnabled: false }),
        renderTextFromGrid,
      }),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 3,
    });

    await service.generateTestData();

    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(renderTextFromGrid).not.toHaveBeenCalled();
    expect(setTestDataStatus).toHaveBeenCalledWith('Generate complete. Grid updated.', {
      dismissable: true,
    });
  });

  test('generateTestData refreshes the text preview in edit mode even when auto preview is disabled', async () => {
    const renderTextFromGrid = jest.fn(() => Promise.resolve());
    const setTestDataStatus = jest.fn();
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Active'],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(() => ({
        getRowCount: () => 3,
      })),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: () => ({
        getState: () => ({ mode: 'edit', autoPreviewEnabled: false }),
        renderTextFromGrid,
      }),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 3,
    });

    await service.generateTestData();

    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(setTestDataStatus).toHaveBeenCalledWith('Generate complete. Grid and preview updated.', {
      dismissable: true,
    });
  });

  test('generateTestData prompts to continue when constraints keep rejecting generated rows', async () => {
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const requestConfirm = jest.fn(async () => true);
    const setTestDataStatus = jest.fn();
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Open'],
    };
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      generateRows: async ({ hooks }) => {
        await hooks.onConstraintImpact({
          generatedRows: 0,
          failedRows: 1000,
          retryCount: 0,
          continueGeneration: jest.fn(),
        });
        return {
          ok: true,
          headers: ['Status'],
          rows: [['Open']],
          diagnostics: { rowCount: 1 },
        };
      },
    }));

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class FakeGenericDataTable {
        constructor() {
          this.headers = [];
          this.rows = [];
        }
        setHeaders(headers) {
          this.headers = headers;
        }
        appendDataRow(row) {
          this.rows.push(row);
        }
        getRowCount() {
          return this.rows.length;
        }
      },
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nenum("Open","Closed")'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'enum', value: '"Open","Closed"' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 1,
      requestConfirm,
      createGenerationSessionFn,
    });

    await service.generateTestData();

    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Schema Constraints are impacting row generation',
      message:
        'Schema Constraints are impacting row generation - generated 0 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation.',
      okLabel: 'Continue',
      cancelLabel: 'Abort',
    });
    expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    expect(setTestDataStatus).toHaveBeenCalledWith('Generate complete. Grid updated.', {
      dismissable: true,
    });
  });

  test('generateTestData abort keeps only valid generated rows when constraints stay too strict', async () => {
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const requestConfirm = jest.fn(async () => false);
    const setTestDataStatus = jest.fn();
    const showSchemaError = jest.fn();
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Closed'],
    };
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      generateRows: async ({ hooks }) => {
        await hooks.onConstraintImpact({
          generatedRows: 1,
          failedRows: 1000,
          retryCount: 0,
          continueGeneration: jest.fn(),
        });
        return {
          ok: false,
          aborted: true,
          partial: true,
          headers: ['Status'],
          rows: [['Closed']],
          diagnostics: { rowCount: 1, failedRows: 1000, retryCount: 0 },
          errors: [
            {
              code: 'constraint_generation_failed',
              message:
                'Schema Constraints are impacting row generation - generated 1 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation.',
            },
          ],
        };
      },
    }));

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class FakeGenericDataTable {
        constructor() {
          this.headers = [];
          this.rows = [];
        }
        setHeaders(headers) {
          this.headers = headers;
        }
        appendDataRow(row) {
          this.rows.push(row);
        }
        getRowCount() {
          return this.rows.length;
        }
      },
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 2,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nenum("Open","Closed")'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError,
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'enum', value: '"Open","Closed"' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 2,
      requestConfirm,
      createGenerationSessionFn,
    });

    await service.generateTestData();

    const appliedTable = importer.setGridFromGenericDataTable.mock.calls[0][0];
    expect(appliedTable.getRowCount()).toBe(1);
    expect(appliedTable.rows[0]).toEqual(['Closed']);
    expect(showSchemaError).toHaveBeenCalledWith(
      'Schema Constraints are impacting row generation - generated 1 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation.'
    );
    expect(setTestDataStatus).toHaveBeenCalledWith(
      'Schema Constraints are impacting row generation - generated 1 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation. Grid updated.',
      { severity: 'warning', dismissable: true }
    );
  });

  test('generateTestData stops after repeated continue confirmations when constraints never recover', async () => {
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const requestConfirm = jest.fn(async () => true);
    const setTestDataStatus = jest.fn();
    const showSchemaError = jest.fn();
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Open'],
    };
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      generateRows: async ({ hooks }) => {
        for (let retryCount = 0; retryCount <= 10; retryCount += 1) {
          await hooks.onConstraintImpact({
            generatedRows: 0,
            failedRows: (retryCount + 1) * 1000,
            retryCount,
            continueGeneration: jest.fn(),
          });
        }
        return {
          ok: false,
          aborted: true,
          partial: false,
          headers: ['Status'],
          rows: [],
          diagnostics: { rowCount: 0, failedRows: 11000, retryCount: 10 },
          errors: [
            {
              code: 'constraint_generation_failed',
              message:
                'Schema Constraints are impacting row generation - generated 0 rows, failed to generate 11000 rows. Consider changing constraints to improve row generation.',
            },
          ],
        };
      },
    }));

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class FakeGenericDataTable {
        constructor() {
          this.headers = [];
          this.rows = [];
        }
        setHeaders(headers) {
          this.headers = headers;
        }
        appendDataRow(row) {
          this.rows.push(row);
        }
        getRowCount() {
          return this.rows.length;
        }
      },
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nenum("Open","Closed")'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError,
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'enum', value: '"Open","Closed"' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 1,
      requestConfirm,
      createGenerationSessionFn,
    });

    await service.generateTestData();

    expect(requestConfirm).toHaveBeenCalledTimes(10);
    expect(showSchemaError).toHaveBeenCalledWith(
      'Schema Constraints are impacting row generation - generated 0 rows, failed to generate 11000 rows. Consider changing constraints to improve row generation. Retry limit reached.'
    );
    expect(setTestDataStatus).toHaveBeenCalledWith(
      'Schema Constraints are impacting row generation - generated 0 rows, failed to generate 11000 rows. Consider changing constraints to improve row generation. Retry limit reached. Grid updated.',
      { severity: 'warning', dismissable: true }
    );
  });

  test('generateTestData does not apply a replacement table when fallback amendRows returns a hard error', async () => {
    const importer = { setGridFromGenericDataTable: jest.fn(() => Promise.resolve()) };
    const showSchemaError = jest.fn();
    const setTestDataStatus = jest.fn();
    const currentDataTable = {
      rows: [['existing']],
      getHeaders: () => ['Name'],
    };
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      amendRows: () => ({
        ok: false,
        errors: [
          {
            code: 'row_count_exceeds_imported',
            message: 'Row count exceeds imported row count 1.',
          },
        ],
        diagnostics: { importedRowCount: 1 },
      }),
    }));

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return {
          importSpec: jest.fn(),
          compile: jest.fn(),
          compiler: { validate: jest.fn() },
          testDataRules: () => [{}],
          isValid: () => true,
          errors: () => [],
          generateHeadersArray: () => ['Status'],
          generateRow: () => ['Active'],
        };
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class FakeGenericDataTable {
        constructor() {
          this.headers = [];
          this.rows = [];
        }
        setHeaders(headers) {
          this.headers = headers;
        }
        appendDataRow(row) {
          this.rows.push(row);
        }
      },
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 2,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError,
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: () => importer,
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: () => ({
        getGridAsGenericDataTable: () => currentDataTable,
      }),
      getGenerationMode: () => 'amend-table',
      getRequestedRowCount: () => 2,
      createGenerationSessionFn,
    });

    await service.generateTestData();

    expect(importer.setGridFromGenericDataTable).not.toHaveBeenCalled();
    expect(showSchemaError).toHaveBeenCalledWith('Row count exceeds imported row count 1.');
    expect(setTestDataStatus).toHaveBeenCalledWith('Amend failed.', {
      severity: 'error',
      dismissable: true,
    });
  });

  test('generateTestData surfaces a grid wiring error before the amend-selected empty-selection warning', async () => {
    const setTestDataStatus = jest.fn();
    const showSchemaError = jest.fn();

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return {
          importSpec: jest.fn(),
          compile: jest.fn(),
          compiler: { validate: jest.fn() },
          testDataRules: () => [{}],
          isValid: () => true,
          errors: () => [],
          generateHeadersArray: () => ['Status'],
          generateRow: () => ['Active'],
        };
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError,
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: jest.fn(),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: () => undefined,
      getGenerationMode: () => 'amend-selected',
      getRequestedRowCount: () => 1,
    });

    await service.generateTestData();

    expect(showSchemaError).toHaveBeenCalledWith('Grid interface unavailable.');
    expect(setTestDataStatus).toHaveBeenCalledWith('Unable to access current grid.', {
      severity: 'error',
      dismissable: true,
    });
  });

  test('generateTestData surfaces a grid wiring error when amend-selected cannot read selected rows', async () => {
    const showSchemaError = jest.fn();
    const setTestDataStatus = jest.fn();
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
    }));
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Active'],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError,
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: jest.fn(),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: () => ({
        getGridAsGenericDataTable: jest.fn(),
      }),
      getGenerationMode: () => 'amend-selected',
      getRequestedRowCount: () => 1,
      createGenerationSessionFn,
    });

    await service.generateTestData();

    expect(showSchemaError).toHaveBeenCalledWith('Grid interface unavailable.');
    expect(setTestDataStatus).toHaveBeenCalledWith('Unable to access current grid.', {
      severity: 'error',
      dismissable: true,
    });
  });

  test('generateTestData surfaces a grid wiring error when amend mode has no amend-capable grid contract', async () => {
    const showSchemaError = jest.fn();
    const setTestDataStatus = jest.fn();
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
    }));
    const generator = {
      importSpec: jest.fn(),
      compile: jest.fn(),
      compiler: { validate: jest.fn() },
      testDataRules: () => [{}],
      isValid: () => true,
      errors: () => [],
      generateHeadersArray: () => ['Status'],
      generateRow: () => ['Active'],
    };

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: function TestDataGeneratorClass() {
        return generator;
      },
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 1,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(() => 'Status\nliteral(Active)'),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError,
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({
        rows: [{ name: 'Status', sourceType: 'literal', value: 'Active' }],
        errors: [],
      })),
      getImporter: jest.fn(),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: () => ({}),
      getGenerationMode: () => 'amend-table',
      getRequestedRowCount: () => 1,
      createGenerationSessionFn,
    });

    await service.generateTestData();

    expect(showSchemaError).toHaveBeenCalledWith('Grid interface unavailable.');
    expect(setTestDataStatus).toHaveBeenCalledWith('Unable to access current grid.', {
      severity: 'error',
      dismissable: true,
    });
  });
});
