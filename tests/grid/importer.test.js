import Papa from 'papaparse';
import { Importer } from '../../packages/core/js/grid/importer.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

beforeAll(() => {
  global.Papa = Papa;
});

describe('Importer', () => {
  test('reports supported types and file extensions', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });

    expect(importer.canImport('csv')).toBe(true);
    expect(importer.canImport('unknown')).toBe(false);
    expect(importer.getFileExtensionFor('csv')).toBe('.csv');
    expect(importer.getFileExtensionFor('unknown')).toBeUndefined();
  });

  test('importText returns early for unsupported types', () => {
    const gridExtensions = { setGridFromGenericDataTable: jest.fn() };
    const importer = new Importer(gridExtensions);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = importer.importText('unknown', 'data');

    expect(result).toBeUndefined();
    expect(gridExtensions.setGridFromGenericDataTable).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Data Type unknown not supported for importing');
  });

  test('importText converts CSV text and sends the table to the grid extension', () => {
    const gridExtensions = {
      setGridFromGenericDataTable: jest.fn(() => 'grid updated'),
    };
    const importer = new Importer(gridExtensions);

    const result = importer.importText('csv', 'Name,Role\nConnie,QA\nBob,Dev');

    expect(result).toBe('grid updated');
    expect(gridExtensions.setGridFromGenericDataTable).toHaveBeenCalledTimes(1);
    const dataTable = gridExtensions.setGridFromGenericDataTable.mock.calls[0][0];
    expect(dataTable).toBeInstanceOf(GenericDataTable);
    expect(dataTable.getHeaders()).toEqual(['Name', 'Role']);
    expect(dataTable.getRowCount()).toBe(2);
    expect(dataTable.getRow(0)).toEqual(['Connie', 'QA']);
    expect(dataTable.getRow(1)).toEqual(['Bob', 'Dev']);
  });

  test('uses comma delimiter by default for csv options', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });

    expect(importer.options.csv.options.delimiter).toBe(',');
    expect(importer.options.csv.options.quoteChar).toBe('"');
    expect(importer.options.csv.options.escapeChar).toBe('"');
  });

  test('toGenericDataTable applies configured options to the selected convertor', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });
    const expectedTable = new GenericDataTable();
    const setOptions = jest.fn();
    const toDataTable = jest.fn(() => expectedTable);
    importer.options.markdown = { marker: 'options' };
    importer.convertors.markdown = {
      setOptions,
      toDataTable,
    };

    const result = importer.toGenericDataTable('markdown', '|H|\n|-|');

    expect(setOptions).toHaveBeenCalledWith({ marker: 'options' });
    expect(toDataTable).toHaveBeenCalledWith('|H|\n|-|');
    expect(result).toBe(expectedTable);
  });

  test('setOptionsForType merges options for supported types and ignores unknown types', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });

    importer.setOptionsForType('json', { options: { prettyPrint: false, asObject: true } });
    importer.setOptionsForType('unknown', { options: { anything: true } });

    expect(importer.options.json.options.prettyPrint).toBe(false);
    expect(importer.options.json.options.asObject).toBe(true);
    expect(importer.options.unknown).toBeUndefined();
  });

  test('toGenericDataTable uses empty options when a type has no configured options object', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });
    const expectedTable = new GenericDataTable();
    const setOptions = jest.fn();
    const toDataTable = jest.fn(() => expectedTable);
    importer.convertors.gherkin = {
      setOptions,
      toDataTable,
    };

    const result = importer.toGenericDataTable('gherkin', '| Name |');

    expect(setOptions).toHaveBeenCalledWith({});
    expect(toDataTable).toHaveBeenCalledWith('| Name |');
    expect(result).toBe(expectedTable);
  });

  test('toGenericDataTable passes configured csv delimiter options to csv convertor', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });
    const expectedTable = new GenericDataTable();
    const setOptions = jest.fn();
    const toDataTable = jest.fn(() => expectedTable);
    importer.convertors.csv = {
      setOptions,
      toDataTable,
    };

    const result = importer.toGenericDataTable('csv', 'Name,Role\nConnie,QA');

    expect(setOptions).toHaveBeenCalledWith(importer.options.csv);
    expect(importer.options.csv.options.delimiter).toBe(',');
    expect(toDataTable).toHaveBeenCalledWith('Name,Role\nConnie,QA');
    expect(result).toBe(expectedTable);
  });

  test('setGridFromGenericDataTable delegates directly to the grid extension', () => {
    const gridExtensions = {
      setGridFromGenericDataTable: jest.fn(() => 'delegated'),
    };
    const importer = new Importer(gridExtensions);
    const dataTable = new GenericDataTable();

    expect(importer.setGridFromGenericDataTable(dataTable)).toBe('delegated');
    expect(gridExtensions.setGridFromGenericDataTable).toHaveBeenCalledWith(dataTable);
  });

  test('toGenericDataTable returns undefined when a registered convertor is missing', () => {
    const importer = new Importer({ setGridFromGenericDataTable: jest.fn() });
    importer.convertors.html = undefined;

    expect(importer.canImport('html')).toBe(true);
    expect(importer.toGenericDataTable('html', '<table></table>')).toBeUndefined();
  });
});
