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
});
