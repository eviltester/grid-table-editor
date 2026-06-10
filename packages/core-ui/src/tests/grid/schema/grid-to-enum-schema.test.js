import { GenericDataTable } from '../../../../../core/js/data_formats/generic-data-table.js';
import {
  DEFAULT_ENUM_LIMIT,
  buildGridEnumSchemaSummary,
  createEnumSchemaRowsFromGrid,
  normaliseEnumLimit,
} from '../../../../js/gui_components/app/test-data-grid/schema/grid-to-enum-schema.js';

function createTable({ headers = [], rows = [] } = {}) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => {
    table.rows.push(row.map((cell) => String(cell ?? '')));
  });
  return table;
}

describe('grid-to-enum-schema', () => {
  test('uses a positive integer limit and falls back to the default for invalid inputs', () => {
    expect(normaliseEnumLimit(10)).toBe(10);
    expect(normaliseEnumLimit('7')).toBe(7);
    expect(normaliseEnumLimit('0')).toBe(DEFAULT_ENUM_LIMIT);
    expect(normaliseEnumLimit('-2')).toBe(DEFAULT_ENUM_LIMIT);
    expect(normaliseEnumLimit('abc')).toBe(DEFAULT_ENUM_LIMIT);
  });

  test('preserves first-seen value order and reports max unique counts', () => {
    const table = createTable({
      headers: ['Status', 'Priority'],
      rows: [
        ['active', 'high'],
        ['pending', 'low'],
        ['active', 'high'],
        ['inactive', 'low'],
      ],
    });

    const summary = buildGridEnumSchemaSummary({ dataTable: table, maxEnumValues: 10 });

    expect(summary.maxUniqueValueCount).toBe(3);
    expect(summary.truncatedColumnCount).toBe(0);
    expect(summary.usableColumns.map((column) => column.header)).toEqual(['Status', 'Priority']);
    expect(summary.usableColumns[0].uniqueValues).toEqual(['active', 'pending', 'inactive']);
    expect(summary.usableColumns[1].uniqueValues).toEqual(['high', 'low']);
  });

  test('skips blank values and truncates to the requested limit', () => {
    const table = createTable({
      headers: ['Status', 'Empty'],
      rows: [
        ['active', ''],
        [' pending ', '   '],
        ['', ''],
        ['inactive', ''],
      ],
    });

    const result = createEnumSchemaRowsFromGrid({
      dataTable: table,
      maxEnumValues: 2,
      createBlankRow: () => ({ id: 'row', sourceType: 'regex', value: 'seed' }),
    });

    expect(result.maxUniqueValueCount).toBe(3);
    expect(result.truncatedColumnCount).toBe(1);
    expect(result.rows).toEqual([
      expect.objectContaining({
        name: 'Status',
        sourceType: 'enum',
        value: 'active,pending',
        command: '',
        params: '',
        comments: '',
      }),
    ]);
  });

  test('quotes enum values that contain commas so they stay single choices', () => {
    const table = createTable({
      headers: ['City'],
      rows: [['New York, NY'], ['London'], ['New York, NY']],
    });

    const result = createEnumSchemaRowsFromGrid({
      dataTable: table,
      createBlankRow: () => ({ id: 'row', sourceType: 'regex', value: 'seed' }),
    });

    expect(result.rows).toEqual([
      expect.objectContaining({
        name: 'City',
        sourceType: 'enum',
        value: '"New York, NY",London',
      }),
    ]);
  });
});
