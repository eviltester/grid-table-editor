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

  test('refreshTestDataPreview drives injected refresh busy state instead of DOM lookups', async () => {
    const setRefreshPreviewBusy = jest.fn();
    const renderTextFromGrid = jest.fn(() => Promise.resolve());
    const clearPendingStatusReset = jest.fn();
    const scheduleStatusReset = jest.fn();
    const setTestDataLoadingStatus = jest.fn();
    const setTestDataStatus = jest.fn();

    const service = createTestDataGenerationService({
      TestDataGeneratorClass: class {},
      PairwiseTestDataGeneratorClass: class {},
      GenericDataTableClass: class {},
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: () => 3,
      createTableFromGenerator: jest.fn(),
      createAmendedTable: jest.fn(),
      schemaRowsToSpec: jest.fn(),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      setTestDataStatus,
      setTestDataLoadingStatus,
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({ rows: [], errors: [] })),
      getImporter: () => ({ setGridFromGenericDataTable: jest.fn() }),
      getTextPreviewRenderer: () => ({ renderTextFromGrid }),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      setRefreshPreviewBusy,
    });

    await service.refreshTestDataPreview({
      clearPendingStatusReset,
      scheduleStatusReset,
    });

    expect(clearPendingStatusReset).toHaveBeenCalledTimes(1);
    expect(setTestDataLoadingStatus).toHaveBeenCalledWith('Refreshing text preview...');
    expect(renderTextFromGrid).toHaveBeenCalledTimes(1);
    expect(setTestDataStatus).toHaveBeenCalledWith('Text preview refreshed.');
    expect(scheduleStatusReset).toHaveBeenCalledTimes(1);
    expect(setRefreshPreviewBusy.mock.calls).toEqual([[true], [false]]);
  });
});
