import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { generateFromTextSpec } from '@anywaydata/core';

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

const DATA_SOURCE_STRATEGY_BY_FRAMEWORK = {
  junit4: 'inline',
  junit5: 'inline',
  junit6: 'provider',
  testng: 'inline',
  pytest: 'inline',
  jest: 'inline',
  xunit: 'inline',
  rspec: 'inline',
  phpunit: 'inline',
  kotest: 'inline',
  'test-more': 'inline',
};

function buildTable(headers, rows) {
  const table = new GenericDataTable();
  table.setHeaders(headers);
  rows.forEach((row) => table.appendDataRow(row));
  return table;
}

describe('unit-test export parity: UI exporter vs core pipeline', () => {
  test.each(FRAMEWORKS)('%s parity', (format) => {
    const dataSourceStrategy = DATA_SOURCE_STRATEGY_BY_FRAMEWORK[format] || 'provider';
    const options = {
      options: {
        includeSetup: true,
        prettyPrint: true,
        dataSourceStrategy,
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
