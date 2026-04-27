import { Exporter } from '../../js/grid/exporter.js';
import { GenericDataTable } from '../../js/data_formats/generic-data-table.js';
import Papa from 'papaparse';

beforeAll(() => {
  global.Papa = Papa;
});

function createTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('Exporter direct table conversion', () => {
  test.each(['csv', 'json', 'markdown'])('getDataTableAs(%s) matches grid-based output', (type) => {
    const table = createTable(
      ['Name', 'Role'],
      [
        ['Connie', 'QA'],
        ['Bob', 'Dev'],
      ]
    );
    const gridExtensions = {
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    };

    const exporter = new Exporter(gridExtensions);
    const fromGrid = exporter.getGridAs(type);
    const direct = exporter.getDataTableAs(type, table);

    expect(direct).toBe(fromGrid);
  });

  test('reports supported types and file extensions', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    expect(exporter.canExport('csv')).toBe(true);
    expect(exporter.canExport('xml')).toBe(true);
    expect(exporter.canExport('jsonl')).toBe(true);
    expect(exporter.canExport('unknown')).toBe(false);
    expect(exporter.getFileExtensionFor('csv')).toBe('.csv');
    expect(exporter.getFileExtensionFor('xml')).toBe('.xml');
    expect(exporter.getFileExtensionFor('jsonl')).toBe('.jsonl');
    expect(exporter.getOptionsForType('json')).toBeDefined();
    expect(exporter.getOptionsForType('jsonl')).toBeDefined();
    expect(exporter.getOptionsForType('xml')).toBeDefined();
  });

  test('jsonl defaults force compact line-delimited output settings', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    expect(exporter.options.jsonl.options.prettyPrint).toBe(false);
    expect(exporter.options.jsonl.options.asObject).toBe(false);
    expect(exporter.options.jsonl.options.asPropertyNamed).toBe('');
    expect(exporter.options.jsonl.options.outputAsJsonLines).toBe(true);
  });

  test('returns empty string for unsupported export types', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = exporter.getDataTableAs('unknown', table);

    expect(result).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith('Data Type unknown not supported for exporting');
  });

  test('delegates maxRows and headers to grid extensions', () => {
    const table = createTable(['Name'], [['Connie']]);
    const getGridAsGenericDataTable = jest.fn(() => table);
    const getHeadersFromGrid = jest.fn(() => ['Name']);
    const exporter = new Exporter({
      getGridAsGenericDataTable,
      getHeadersFromGrid,
    });

    expect(exporter.getGridAsGenericDataTable(5)).toBe(table);
    expect(getGridAsGenericDataTable).toHaveBeenCalledWith(5);
    expect(exporter.getHeadersFromGrid()).toEqual(['Name']);
    expect(getHeadersFromGrid).toHaveBeenCalledTimes(1);
  });

  test('setOptionsForType merges options and stores headers when csv export disables header output', () => {
    const table = createTable(['Name', 'Role'], [['Connie', 'QA']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    exporter.setOptionsForType('csv', { options: { header: false, quoteChar: "'" } });
    exporter.setOptionsForType('unknown', { options: { anything: true } });

    expect(exporter.options.csv.options.header).toBe(false);
    expect(exporter.options.csv.options.quoteChar).toBe("'");
    expect(exporter.options.csv.headers).toEqual(['Name', 'Role']);
    expect(exporter.options.unknown).toBeUndefined();
  });

  test('applies configured options to exporter instances before conversion', () => {
    const exporter = new Exporter({
      getGridAsGenericDataTable: jest.fn(),
      getHeadersFromGrid: jest.fn(() => []),
    });
    const table = createTable(['Name'], [['Connie']]);
    const setOptions = jest.fn();
    const fromDataTable = jest.fn(() => 'rendered');
    exporter.options.json = { marker: 'options' };
    exporter.exporters.json = {
      setOptions,
      fromDataTable,
    };

    const result = exporter.getDataTableAs('json', table);

    expect(setOptions).toHaveBeenCalledWith({ marker: 'options' });
    expect(fromDataTable).toHaveBeenCalledWith(table);
    expect(result).toBe('rendered');
  });

  test('still exports when no options object is configured for the type', () => {
    const exporter = new Exporter({
      getGridAsGenericDataTable: jest.fn(),
      getHeadersFromGrid: jest.fn(() => []),
    });
    const table = createTable(['Name'], [['Connie']]);
    const setOptions = jest.fn();
    const fromDataTable = jest.fn(() => 'rendered without options');
    exporter.options.json = undefined;
    exporter.exporters.json = {
      setOptions,
      fromDataTable,
    };

    const result = exporter.getDataTableAs('json', table);

    expect(setOptions).not.toHaveBeenCalled();
    expect(fromDataTable).toHaveBeenCalledWith(table);
    expect(result).toBe('rendered without options');
  });

  test('setOptionsForType stores headers for dsv export when header output is disabled', () => {
    const table = createTable(['Name', 'Role'], [['Connie', 'QA']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    exporter.setOptionsForType('dsv', { options: { header: false } });

    expect(exporter.options.dsv.options.header).toBe(false);
    expect(exporter.options.dsv.headers).toEqual(['Name', 'Role']);
  });

  test('does not store headers when csv header output stays enabled', () => {
    const table = createTable(['Name', 'Role'], [['Connie', 'QA']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    exporter.setOptionsForType('csv', { options: { header: true } });

    expect(exporter.options.csv.options.header).toBe(true);
    expect(exporter.options.csv.headers).toEqual([]);
  });

  test('returns undefined when a registered exporter instance is missing', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });
    exporter.exporters.json = undefined;

    expect(exporter.canExport('json')).toBe(true);
    expect(exporter.getDataTableAs('json', table)).toBeUndefined();
  });

  test('setOptionsForType merges options for xml exports', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    exporter.setOptionsForType('xml', {
      options: {
        rootElementName: 'orders',
        itemElementName: 'order',
        includeXmlHeader: false,
      },
    });

    expect(exporter.options.xml.options.rootElementName).toBe('orders');
    expect(exporter.options.xml.options.itemElementName).toBe('order');
    expect(exporter.options.xml.options.includeXmlHeader).toBe(false);
  });

  test('stores export warnings from convertors that expose warnings', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    exporter.exporters.xml = {
      setOptions: jest.fn(),
      fromDataTable: jest.fn(() => '<xml />'),
      getWarnings: jest.fn(() => ['warning one', 'warning two']),
    };

    exporter.getDataTableAs('xml', table);

    expect(exporter.getLastWarningsForType('xml')).toEqual(['warning one', 'warning two']);
  });

  test('clears warnings for convertors that do not expose warnings', () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    exporter.lastWarnings.xml = ['old warning'];
    exporter.exporters.xml = {
      setOptions: jest.fn(),
      fromDataTable: jest.fn(() => '<xml />'),
    };

    exporter.getDataTableAs('xml', table);

    expect(exporter.getLastWarningsForType('xml')).toEqual([]);
  });

  test('getGridAsAsync matches sync output when async grid extension is available', async () => {
    const table = createTable(['Name', 'Role'], [['Connie', 'QA']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getGridAsGenericDataTableAsync: async () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });

    const syncOutput = exporter.getGridAs('csv');
    const asyncOutput = await exporter.getGridAsAsync('csv');

    expect(asyncOutput).toBe(syncOutput);
  });

  test('getDataTableAsAsync falls back to sync exporter when async method is missing', async () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });
    exporter.exporters.json = {
      setOptions: jest.fn(),
      fromDataTable: jest.fn(() => 'sync json output'),
    };

    const output = await exporter.getDataTableAsAsync('json', table);

    expect(output).toBe('sync json output');
  });

  test('getDataTableAsAsync uses async exporter when available', async () => {
    const table = createTable(['Name'], [['Connie']]);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => table.getHeaders(),
    });
    exporter.exporters.markdown = {
      setOptions: jest.fn(),
      fromDataTableAsync: jest.fn(async () => 'async markdown output'),
    };

    const output = await exporter.getDataTableAsAsync('markdown', table, jest.fn());

    expect(output).toBe('async markdown output');
    expect(exporter.exporters.markdown.fromDataTableAsync).toHaveBeenCalledWith(table, expect.any(Function));
  });
});
