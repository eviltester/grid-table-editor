import { Exporter } from '../../packages/core/js/grid/exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { generateFromTextSpec } from '../../packages/core/src/index.js';

const FRAMEWORKS = [
  'junit4',
  'junit5',
  'junit6',
  'testng',
  'pytest',
  'jest',
  'xunit',
  'rspec',
  'phpunit',
  'kotest',
  'test-more',
];

function buildTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('unit-test export parity: UI exporter vs core pipeline', () => {
  test.each(FRAMEWORKS)('%s parity', (format) => {
    const options = {
      options: {
        includeSetup: true,
        assertionStyle: 'strict',
        prettyPrint: true,
        dataSourceStrategy: format === 'junit5' || format === 'junit6' ? 'provider' : 'provider',
      },
    };
    const coreResult = generateFromTextSpec({
      textSpec: 'Name\nBob\nAge\n21',
      rowCount: 2,
      outputFormat: format,
      options,
      seed: 123,
    });
    expect(coreResult.ok).toBe(true);

    const table = buildTable(coreResult.headers, coreResult.rows);
    const exporter = new Exporter({
      getGridAsGenericDataTable: () => table,
      getHeadersFromGrid: () => coreResult.headers,
    });
    exporter.setOptionsForType(format, options);
    const uiRendered = exporter.getDataTableAs(format, table);

    expect(uiRendered).toBe(coreResult.rendered);
  });
});
