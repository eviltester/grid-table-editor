import { jest } from '@jest/globals';
import { createUiGenerationSessionService } from '../../../js/gui_components/shared/test-data/generation/ui-generation-session-service.js';

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

describe('ui-generation-session-service', () => {
  test('createSessionContext uses explicit schema text when present', () => {
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      diagnostics: { report: 'ok' },
    }));

    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [{ name: 'Status', sourceType: 'enum', value: 'enum(open,closed)' }],
      }),
      getSchemaText: () => 'Status\nenum(open,closed)\n\nIF [Status] = "open" THEN [Status] = "closed" ENDIF',
      schemaRowsToSpec: () => 'Status\nenum(open,closed)',
      schemaSource: 'test',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createGenerationSessionFn,
      faker: {},
      RandExp: function RandExp() {},
    });

    const context = service.createSessionContext();

    expect(context.ok).toBe(true);
    expect(createGenerationSessionFn).toHaveBeenCalledWith(
      expect.objectContaining({
        textSpec: 'Status\nenum(open,closed)\n\nIF [Status] = "open" THEN [Status] = "closed" ENDIF',
        unsafeFakerExpressions: true,
      })
    );
  });

  test('createSessionContext passes the current unsafe faker setting into generation sessions', () => {
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      diagnostics: {},
    }));
    let unsafeFakerExpressions = false;

    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [{ name: 'Sentence', sourceType: 'faker', command: 'helpers.mustache', params: '("x")' }],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => 'Sentence\nhelpers.mustache("x")',
      schemaSource: 'test',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createGenerationSessionFn,
      getUnsafeFakerExpressions: () => unsafeFakerExpressions,
      faker: {},
      RandExp: function RandExp() {},
    });

    service.createSessionContext();
    unsafeFakerExpressions = true;
    service.createSessionContext();

    expect(createGenerationSessionFn.mock.calls[0][0].unsafeFakerExpressions).toBe(false);
    expect(createGenerationSessionFn.mock.calls[1][0].unsafeFakerExpressions).toBe(true);
  });

  test('counts domain datatype.enum rows as enum-capable', () => {
    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [
          { name: 'Status', sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive,pending' },
          { name: 'Priority', sourceType: 'enum', value: 'enum(high,low)' },
        ],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => '',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      faker: {},
      RandExp: function RandExp() {},
    });

    expect(service.countEnumColumns()).toBe(2);
    expect(service.getEnumValueCounts()).toEqual([3, 2]);
  });

  test('generatePairwise rejects schemas with fewer than two enum columns before session execution', () => {
    const createGenerationSessionFn = jest.fn(() => ({
      isValid: () => true,
      getErrors: () => [],
      diagnostics: {},
      generatePairwise: jest.fn(),
    }));

    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [{ name: 'Status', sourceType: 'enum', value: 'enum(open,closed)' }],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => 'Status\nenum(open,closed)',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createGenerationSessionFn,
      faker: {},
      RandExp: function RandExp() {},
    });

    const result = service.generatePairwise();

    expect(result.ok).toBe(false);
    expect(result.errors[0].code).toBe('insufficient_enum_columns');
    expect(createGenerationSessionFn).toHaveBeenCalledTimes(1);
  });

  test('generateCombinations validates strength before generator execution', () => {
    const createConfiguredGenerator = jest.fn(() => ({
      generator: {},
      errors: [],
    }));

    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [
          { name: 'Status', sourceType: 'enum', value: 'enum(open,closed)' },
          { name: 'Priority', sourceType: 'enum', value: 'enum(high,low)' },
        ],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => 'Status\nenum(open,closed)\nPriority\nenum(high,low)',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createConfiguredGenerator,
      faker: {},
      RandExp: function RandExp() {},
    });

    const result = service.generateCombinations({ strength: 3, algorithm: 'greedy' });

    expect(result.ok).toBe(false);
    expect(result.errors[0].code).toBe('invalid_nwise_strength');
    expect(createConfiguredGenerator).not.toHaveBeenCalled();
  });

  test('generateRows normalizes session output into a data table contract', async () => {
    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [{ name: 'Status', sourceType: 'literal', value: 'literal(Open)' }],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => 'Status\nliteral(Open)',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createGenerationSessionFn: () => ({
        isValid: () => true,
        getErrors: () => [],
        diagnostics: { report: 'ok' },
        generateRows: () => ({
          ok: true,
          headers: ['Status'],
          rows: [['Open']],
          diagnostics: { rowCount: 1 },
        }),
      }),
      faker: {},
      RandExp: function RandExp() {},
    });

    const result = await service.generateRows({ rowCount: 1 });

    expect(result.ok).toBe(true);
    expect(result.dataTable.getHeaders()).toEqual(['Status']);
    expect(result.dataTable.getRow(0)).toEqual(['Open']);
    expect(result.statusContext.generatedRows).toBe(1);
  });

  test('generateRows preserves partial aborted diagnostics and returned rows', async () => {
    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [{ name: 'Status', sourceType: 'enum', value: 'enum(open,closed)' }],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => 'Status\nenum(open,closed)',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createGenerationSessionFn: () => ({
        isValid: () => true,
        getErrors: () => [],
        diagnostics: { report: 'ok' },
        generateRows: () => ({
          ok: false,
          aborted: true,
          partial: true,
          headers: ['Status'],
          rows: [['Open']],
          diagnostics: { rowCount: 1, failedRows: 1000, retryCount: 0 },
          errors: [{ code: 'constraint_generation_failed', message: 'constraint failure' }],
        }),
      }),
      faker: {},
      RandExp: function RandExp() {},
    });

    const result = await service.generateRows({ rowCount: 2 });

    expect(result.ok).toBe(false);
    expect(result.aborted).toBe(true);
    expect(result.partial).toBe(true);
    expect(result.dataTable.getRowCount()).toBe(1);
    expect(result.statusContext.failedRows).toBe(1000);
  });

  test('amendRows returns hard errors without creating a replacement table', () => {
    const sourceTable = new FakeGenericDataTable();
    sourceTable.setHeaders(['Name']);
    sourceTable.appendDataRow(['existing']);

    const service = createUiGenerationSessionService({
      getValidatedSchemaState: () => ({
        errors: [],
        rows: [{ name: 'Name', sourceType: 'literal', value: 'literal(active)' }],
      }),
      getSchemaText: () => '',
      schemaRowsToSpec: () => 'Name\nliteral(active)',
      GenericDataTableClass: FakeGenericDataTable,
      CombinationsTestDataGeneratorClass: class {},
      createGenerationSessionFn: () => ({
        isValid: () => true,
        getErrors: () => [],
        diagnostics: {},
        amendRows: () => ({
          ok: false,
          errors: [{ code: 'row_count_exceeds_imported', message: 'Row count exceeds imported row count 1.' }],
          diagnostics: { importedRowCount: 1 },
        }),
      }),
      faker: {},
      RandExp: function RandExp() {},
    });

    const result = service.amendRows({
      dataTable: sourceTable,
      rowCount: 2,
      mode: 'amend-table',
    });

    expect(result.ok).toBe(false);
    expect(result.dataTable).toBeNull();
    expect(result.errors[0].code).toBe('row_count_exceeds_imported');
  });
});
