import { jest } from '@jest/globals';
import { CsvConvertor } from '@anywaydata/core/data_formats/csv-convertor.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function createTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('CsvConvertor', () => {
  test('fromDataTable uses CsvExporter write path instead of delimiter delegate', () => {
    const convertor = new CsvConvertor();
    const table = createTable(
      ['Name', 'Role'],
      [
        ['Connie', 'QA'],
        ['Bob', 'Dev'],
      ]
    );
    const delegateSpy = jest.spyOn(convertor.delegateTo, 'fromDataTable');

    const output = convertor.fromDataTable(table);

    expect(output).toBe('"Name","Role"\n"Connie","QA"\n"Bob","Dev"');
    expect(delegateSpy).not.toHaveBeenCalled();
  });

  test('toDataTable still delegates to delimiter convertor parse path', () => {
    const convertor = new CsvConvertor();
    const expected = createTable(['Name'], [['Connie']]);
    const delegateSpy = jest.spyOn(convertor.delegateTo, 'toDataTable').mockReturnValue(expected);

    const result = convertor.toDataTable('Name\nConnie');

    expect(delegateSpy).toHaveBeenCalledWith('Name\nConnie');
    expect(result).toBe(expected);
  });

  test('fromDataTableAsync delegates to CsvExporter async path', async () => {
    const convertor = new CsvConvertor();
    const table = createTable(['Name'], [['Connie']]);
    const asyncSpy = jest.spyOn(convertor.csvExporter, 'fromDataTableAsync').mockResolvedValue('async-csv');

    const output = await convertor.fromDataTableAsync(table, jest.fn());

    expect(asyncSpy).toHaveBeenCalledWith(table, expect.any(Function));
    expect(output).toBe('async-csv');
  });
});
