import { jest } from '@jest/globals';
import { createTestDataGenerationService } from '../../../js/gui_components/app/test-data-grid/generation/test-data-generation-service.js';
import { createGeneratorSchemaGenerationService } from '../../../js/gui_components/generator/generation/generator-schema-generation-service.js';

class FakeGenericDataTable {
  constructor() {
    this.headers = [];
    this.rows = [];
  }

  setHeaders(headers) {
    this.headers = [...headers];
  }

  appendDataRow(row) {
    this.rows.push([...row]);
  }

  getHeaders() {
    return this.headers;
  }

  getRowCount() {
    return this.rows.length;
  }

  getRow(index) {
    return this.rows[index];
  }
}

function schemaRowsToSpec(schemaRows = []) {
  return schemaRows
    .map((row) => {
      if (row.sourceType === 'literal') {
        return `${row.name}\n${row.value}`;
      }
      if (row.sourceType === 'domain') {
        return `${row.name}\n${row.command}${row.params || ''}`;
      }
      return `${row.name}\n${row.value}`;
    })
    .join('\n');
}

describe('ui generation parity', () => {
  test('app and generator share combination input and pairwise output for the same schema', async () => {
    const schemaRows = [
      { name: 'Status', sourceType: 'enum', value: 'enum(active,inactive)' },
      { name: 'Priority', sourceType: 'enum', value: 'enum(high,low)' },
    ];
    let latestDataTable = null;

    const appService = createTestDataGenerationService({
      schemaRowsToSpec,
      TestDataGeneratorClass: class {},
      CombinationsTestDataGeneratorClass: class {},
      GenericDataTableClass: FakeGenericDataTable,
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: (value) => Number.parseInt(value, 10),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      getSchemaText: () => '',
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({ rows: schemaRows, errors: [] })),
      getImporter: () => ({
        setGridFromGenericDataTable: jest.fn(async (dataTable) => {
          latestDataTable = dataTable;
        }),
      }),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      setGeneratePairwiseBusy: jest.fn(),
    });

    const generatorService = createGeneratorSchemaGenerationService({
      syncSchemaRowsFromTextMode: jest.fn(() => ({ rows: schemaRows, errors: [] })),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      schemaRowsToSpec,
      schemaTextToDataRules: jest.fn(),
      getSchemaText: () => '',
      TestDataGeneratorClass: class {},
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(appService.countEnumColumns()).toBe(2);
    expect(appService.getEnumValueCounts()).toEqual([2, 2]);
    expect(generatorService.getCombinationInput()).toEqual({
      enumColumnCount: 2,
      enumValueCounts: [2, 2],
    });

    await appService.generatePairwiseTestData();
    const generatorResult = generatorService.generatePairwise();

    expect(generatorResult.ok).toBe(true);
    expect(latestDataTable.getHeaders()).toEqual(generatorResult.dataTable.getHeaders());
    expect(latestDataTable.rows).toEqual(generatorResult.dataTable.rows);
  });

  test('app and generator share deterministic row output for simple literal schemas', async () => {
    const schemaRows = [{ name: 'Status', sourceType: 'literal', value: 'literal(Open)' }];
    let latestDataTable = null;

    const appService = createTestDataGenerationService({
      schemaRowsToSpec,
      TestDataGeneratorClass: class {},
      CombinationsTestDataGeneratorClass: class {},
      GenericDataTableClass: FakeGenericDataTable,
      TEST_DATA_MODES: {
        NEW_TABLE: 'new-table',
        AMEND_TABLE: 'amend-table',
        AMEND_SELECTED: 'amend-selected',
      },
      normaliseCount: (value) => Number.parseInt(value, 10),
      faker: {},
      RandExp: function RandExp() {},
      debouncer: { clear: jest.fn() },
      syncSchemaTextFromGridBeforeGenerate: jest.fn(),
      getSchemaText: () => '',
      setTestDataStatus: jest.fn(),
      setTestDataLoadingStatus: jest.fn(),
      showSchemaError: jest.fn(),
      yieldToUi: jest.fn(() => Promise.resolve()),
      validateCurrentSchemaRows: jest.fn(() => ({ rows: schemaRows, errors: [] })),
      getImporter: () => ({
        setGridFromGenericDataTable: jest.fn(async (dataTable) => {
          latestDataTable = dataTable;
        }),
      }),
      getTextPreviewRenderer: jest.fn(),
      getMainGridExtras: jest.fn(),
      getGenerationMode: () => 'new-table',
      getRequestedRowCount: () => 2,
      setGenerateBusy: jest.fn(),
    });

    const generatorService = createGeneratorSchemaGenerationService({
      syncSchemaRowsFromTextMode: jest.fn(() => ({ rows: schemaRows, errors: [] })),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      schemaRowsToSpec,
      schemaTextToDataRules: jest.fn(),
      getSchemaText: () => '',
      TestDataGeneratorClass: class {},
      faker: {},
      RandExp: function RandExp() {},
    });

    await appService.generateTestData();
    const generatorResult = await generatorService.generateRows({ rowCount: 2 });

    expect(generatorResult.ok).toBe(true);
    expect(latestDataTable.getHeaders()).toEqual(generatorResult.dataTable.getHeaders());
    expect(latestDataTable.rows).toEqual(generatorResult.dataTable.rows);
  });
});
