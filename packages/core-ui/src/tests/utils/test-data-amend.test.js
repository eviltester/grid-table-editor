import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { createTestDataGenerationService } from '../../../js/gui_components/app/test-data-grid/generation/test-data-generation-service.js';
import {
  TEST_DATA_MODES,
  createAmendedTable,
  createTableFromGenerator,
} from '../../../js/gui_components/app/test-data-grid/generation/test-data-amend.js';

function createGenerator(headers, rows) {
  let cursor = 0;
  return {
    generateHeadersArray: () => [...headers],
    generateRow: () => {
      const row = rows[Math.min(cursor, rows.length - 1)] || [];
      cursor += 1;
      return [...row];
    },
  };
}

function createDataTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('test-data amend behavior', () => {
  test('test-data generation service resolves through its direct module', () => {
    expect(typeof createTestDataGenerationService).toBe('function');
  });

  test('new table mode generates exact row count', () => {
    const generator = createGenerator(
      ['A', 'B'],
      [
        ['1', '2'],
        ['3', '4'],
      ]
    );
    const table = createTableFromGenerator(2, generator);

    expect(table.getHeaders()).toEqual(['A', 'B']);
    expect(table.getRowCount()).toBe(2);
    expect(table.getRow(0)).toEqual(['1', '2']);
    expect(table.getRow(1)).toEqual(['3', '4']);
  });

  test('new table mode serializes object and array cells as JSON strings', () => {
    const generator = createGenerator(['Obj', 'Arr'], [[{ name: 'Oxygen', atomicNumber: 8 }, ['a', 'b']]]);
    const table = createTableFromGenerator(1, generator);

    expect(table.getRowCount()).toBe(1);
    expect(table.getCell(0, 0)).toBe('{"name":"Oxygen","atomicNumber":8}');
    expect(table.getCell(0, 1)).toBe('["a","b"]');
  });

  test('amend table updates schema columns, preserves others, and appends rows when needed', () => {
    const current = createDataTable(
      ['keep', 'name'],
      [
        ['k1', 'old-1'],
        ['k2', 'old-2'],
      ]
    );
    const generator = createGenerator(
      ['name', 'newcol'],
      [
        ['new-1', 'n1'],
        ['new-2', 'n2'],
        ['new-3', 'n3'],
      ]
    );

    const { dataTable } = createAmendedTable({
      mode: TEST_DATA_MODES.AMEND_TABLE,
      desiredRowCount: 3,
      generator,
      currentDataTable: current,
    });

    expect(dataTable.getHeaders()).toEqual(['keep', 'name', 'newcol']);
    expect(dataTable.getRowCount()).toBe(3);
    expect(dataTable.getRow(0)).toEqual(['k1', 'new-1', 'n1']);
    expect(dataTable.getRow(1)).toEqual(['k2', 'new-2', 'n2']);
    expect(dataTable.getRow(2)).toEqual(['', 'new-3', 'n3']);
  });

  test('amend selected updates only selected rows up to desired count', () => {
    const current = createDataTable(
      ['name', 'stable'],
      [
        ['old-0', 's0'],
        ['old-1', 's1'],
        ['old-2', 's2'],
      ]
    );
    const generator = createGenerator(['name'], [['new-0'], ['new-1']]);

    const { dataTable } = createAmendedTable({
      mode: TEST_DATA_MODES.AMEND_SELECTED,
      desiredRowCount: 1,
      generator,
      currentDataTable: current,
      selectedRowIndexes: [2, 0],
    });

    expect(dataTable.getRow(0)).toEqual(['new-0', 's0']);
    expect(dataTable.getRow(1)).toEqual(['old-1', 's1']);
    expect(dataTable.getRow(2)).toEqual(['old-2', 's2']);
  });

  test('amend selected with no rows selected is a no-op flag', () => {
    const current = createDataTable(['name'], [['old']]);
    const generator = createGenerator(['name'], [['new']]);

    const result = createAmendedTable({
      mode: TEST_DATA_MODES.AMEND_SELECTED,
      desiredRowCount: 1,
      generator,
      currentDataTable: current,
      selectedRowIndexes: [],
    });

    expect(result.noSelectedRows).toBe(true);
    expect(result.dataTable.getRow(0)).toEqual(['old']);
  });
});
