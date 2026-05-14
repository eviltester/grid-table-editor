import { jest } from '@jest/globals';
import { CsvExporter, DsvCellFormatter, DsvExporter, TsvExporter } from '@anywaydata/core/data_formats/dsv-exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function createTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('DsvCellFormatter', () => {
  test('quotes and escapes values when quotes are enabled', () => {
    const formatter = new DsvCellFormatter({ delimiter: ',', quoteChar: '"', escapeChar: '"', quotes: true });

    expect(formatter.formatCell('Hello')).toBe('"Hello"');
    expect(formatter.formatCell('He said "Hi"')).toBe('"He said ""Hi"""');
  });

  test('quotes only when needed when quotes are disabled', () => {
    const formatter = new DsvCellFormatter({ delimiter: ',', quoteChar: '"', escapeChar: '"', quotes: false });

    expect(formatter.formatCell('plain')).toBe('plain');
    expect(formatter.formatCell('a,b')).toBe('"a,b"');
    expect(formatter.formatCell('line\nbreak')).toBe('"line\nbreak"');
  });

  test('supports per-column quote configuration arrays', () => {
    const formatter = new DsvCellFormatter({ delimiter: ',', quoteChar: '"', escapeChar: '"', quotes: [true, false] });

    expect(formatter.formatCell('first', 0)).toBe('"first"');
    expect(formatter.formatCell('second', 1)).toBe('second');
  });
});

describe('DsvExporter', () => {
  test('exports headers and rows with configured delimiter/newline', () => {
    const table = createTable(
      ['Name', 'Role'],
      [
        ['Connie', 'QA'],
        ['Bob', 'Dev'],
      ]
    );
    const exporter = new DsvExporter({
      delimiter: '\t',
      quoteChar: '"',
      escapeChar: '"',
      quotes: true,
      newline: '\r\n',
      header: true,
    });

    const output = exporter.fromDataTable(table);

    expect(output).toBe('"Name"\t"Role"\r\n"Connie"\t"QA"\r\n"Bob"\t"Dev"');
  });

  test('omits header row when header option is false', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new DsvExporter({
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
      quotes: true,
      newline: '\n',
      header: false,
    });

    expect(exporter.fromDataTable(table)).toBe('"Connie"');
  });

  test('fromDataTableAsync matches sync output and reports progress', async () => {
    const table = createTable(
      ['Name'],
      Array.from({ length: 1200 }, (_unused, idx) => [`User ${idx}`])
    );
    const exporter = new DsvExporter({
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
      quotes: true,
      newline: '\n',
      header: true,
    });
    const progressSpy = jest.fn();

    const asyncOutput = await exporter.fromDataTableAsync(table, progressSpy);
    const syncOutput = exporter.fromDataTable(table);

    expect(asyncOutput).toBe(syncOutput);
    expect(progressSpy).toHaveBeenCalled();
  });
});

describe('Convenience wrappers', () => {
  test('CsvExporter always uses comma delimiter', () => {
    const table = createTable(['Name', 'Role'], [['Connie', 'QA']]);
    const exporter = new CsvExporter({
      delimiter: '\t',
      quoteChar: '"',
      escapeChar: '"',
      quotes: true,
      newline: '\n',
      header: true,
    });

    expect(exporter.fromDataTable(table)).toBe('"Name","Role"\n"Connie","QA"');

    exporter.setOptions({ delimiter: ';', quoteChar: '"', escapeChar: '"', quotes: true, newline: '\n', header: true });
    expect(exporter.fromDataTable(table)).toBe('"Name","Role"\n"Connie","QA"');
  });

  test('TsvExporter always uses tab delimiter', () => {
    const table = createTable(['Name', 'Role'], [['Connie', 'QA']]);
    const exporter = new TsvExporter({
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
      quotes: true,
      newline: '\n',
      header: true,
    });

    expect(exporter.fromDataTable(table)).toBe('"Name"\t"Role"\n"Connie"\t"QA"');

    exporter.setOptions({ delimiter: ';', quoteChar: '"', escapeChar: '"', quotes: true, newline: '\n', header: true });
    expect(exporter.fromDataTable(table)).toBe('"Name"\t"Role"\n"Connie"\t"QA"');
  });
});
