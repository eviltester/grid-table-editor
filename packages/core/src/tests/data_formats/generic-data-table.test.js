import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table';

describe('Can create Generic Data Table from scratch', () => {
  test('create empty table', () => {
    let dataTable = new GenericDataTable();
    expect(dataTable.getHeaders().length).toBe(0);
    expect(dataTable.getRowCount()).toBe(0);
  });

  test('can add headers', () => {
    let dataTable = new GenericDataTable();
    expect(dataTable.getColumnCount()).toBe(0);
    dataTable.addHeader('header 1');
    expect(dataTable.getColumnCount()).toBe(1);
    dataTable.addHeader('header 2');
    expect(dataTable.getColumnCount()).toBe(2);
    expect(dataTable.getHeader(1)).toBe('header 2');
  });

  test('can add headers in bulk', () => {
    let dataTable = new GenericDataTable();

    dataTable.setHeaders(['header 1', 'header 2']);
    expect(dataTable.getColumnCount()).toBe(2);
    expect(dataTable.getHeader(0)).toBe('header 1');
    expect(dataTable.getHeader(1)).toBe('header 2');
  });

  test('can get headers in bulk', () => {
    let dataTable = new GenericDataTable();

    dataTable.setHeaders(['header 1', 'header 2']);
    expect(dataTable.getHeaders()[0]).toBe('header 1');
    expect(dataTable.getHeaders()[1]).toBe('header 2');
  });

  test('can get rows as objects', () => {
    let dataTable = new GenericDataTable();

    dataTable.setHeaders(['header 1', 'header2']);
    dataTable.appendDataRow(['bob', 'eris']);
    dataTable.appendDataRow(['aleister', 'william']);

    let aRow = dataTable.getRowAsObject(0);
    expect(aRow['header 1']).toBe('bob');
    expect(aRow.header2).toBe('eris');

    let anotherRow = dataTable.getRowAsObjectUsingHeadings(1, ['field1', 'field2']);
    expect(anotherRow['field1']).toBe('aleister');
    expect(anotherRow.field2).toBe('william');
  });

  test('can clear table', () => {
    let dataTable = new GenericDataTable();

    dataTable.setHeaders(['header 1', 'header2']);
    dataTable.appendDataRow(['bob', 'eris']);
    dataTable.appendDataRow(['aleister', 'william']);

    dataTable.clear();
    expect(dataTable.getHeaders().length).toBe(0);
    expect(dataTable.getRowCount()).toBe(0);
  });
});

/*

TODO : unsupported scenarios

- add header after rows have been added and expand rows - expectation is that headers are set prior to adding data
- setting cells individually, expectation is that this is a bulk operation  adding a row at a time with appendDataRow

*/
