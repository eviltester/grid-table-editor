import { jest } from '@jest/globals';
import { DelimiterConvertor } from '@anywaydata/core/data_formats/delimiter-convertor.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function createTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => {
    table.appendDataRow(row);
  });
  return table;
}

describe('DelimiterConvertor', () => {
  test('fromDataTable bypasses papaparse and uses internal dsv exporter', () => {
    const convertor = new DelimiterConvertor({
      options: { delimiter: ',', header: true, quoteChar: '"', escapeChar: '"', quotes: true },
    });
    const papaparse = {
      parse: jest.fn(),
      unparse: jest.fn(() => 'should not be used for writes'),
    };
    convertor.setPapaParse(papaparse);
    const table = createTable(
      ['Name', 'Role'],
      [
        ['Connie', 'QA'],
        ['Bob', 'Dev'],
      ]
    );

    const output = convertor.fromDataTable(table);

    expect(output).toBe('"Name","Role"\n"Connie","QA"\n"Bob","Dev"');
    expect(papaparse.unparse).not.toHaveBeenCalled();
  });

  test('toDataTable continues to use papaparse parse path', () => {
    const convertor = new DelimiterConvertor({ options: { delimiter: ',', header: true } });
    const papaparse = {
      parse: jest.fn(() => ({
        data: [
          ['Name', 'Role'],
          ['Connie', 'QA'],
        ],
      })),
      unparse: jest.fn(),
    };
    convertor.setPapaParse(papaparse);

    const output = convertor.toDataTable('Name,Role\nConnie,QA');

    expect(papaparse.parse).toHaveBeenCalled();
    expect(output.getHeaders()).toEqual(['Name', 'Role']);
    expect(output.getRow(0)).toEqual(['Connie', 'QA']);
  });

  test('toDataTable can prepend configured headers when header parsing is disabled', () => {
    const convertor = new DelimiterConvertor({
      options: { delimiter: ',', header: false, quoteChar: '"', escapeChar: '"', quotes: true, newline: '\n' },
      headers: ['Name', 'Role'],
    });
    const papaparse = {
      parse: jest.fn(() => ({
        data: [
          ['Name', 'Role'],
          ['Connie', 'QA'],
        ],
      })),
      unparse: jest.fn(() => '"Name","Role"'),
    };
    convertor.setPapaParse(papaparse);

    const output = convertor.toDataTable('"Connie","QA"');

    expect(papaparse.unparse).toHaveBeenCalledWith([['Name', 'Role']], expect.objectContaining({ header: false }));
    expect(papaparse.parse).toHaveBeenCalledWith('"Name","Role"\n"Connie","QA"', expect.any(Object));
    expect(output.getHeaders()).toEqual(['Name', 'Role']);
  });
});
