import {
  TestFrameworkConvertor,
  TestFrameworkConvertorOptions,
  buildCanonicalModel,
} from '../../packages/core/js/data_formats/test-framework-convertor.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function makeTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Name', 'Age']);
  table.appendDataRow(['Connie', 21]);
  table.appendDataRow(['Miles', 34]);
  return table;
}

describe('test framework convertor', () => {
  test('buildCanonicalModel maps headers and rows', () => {
    const model = buildCanonicalModel(makeTable(), {
      suiteName: 'MySuite',
      testNamePrefix: 'row',
      includeSetup: true,
      prettyPrint: true,
    });

    expect(model.schemaVersion).toBe('1.0');
    expect(model.headers).toEqual(['Name', 'Age']);
    expect(model.rows).toEqual([
      { Name: 'Connie', Age: 21 },
      { Name: 'Miles', Age: 34 },
    ]);
  });

  test.each([
    ['junit4', /@RunWith\(Parameterized\.class\)/],
    ['junit5', /@ParameterizedTest/],
    ['junit6', /@ParameterizedTest/],
    ['testng', /@DataProvider/],
    ['pytest', /@pytest\.mark\.parametrize/],
    ['jest', /test\.each\(getRows\(\)\)/],
    ['xunit', /\[Theory\]/],
    ['rspec', /ROWS\.each do \|row\|/],
    ['phpunit', /@dataProvider rowProvider/],
    ['kotest', /rows\.forEach \{ row ->/],
    ['test-more', /foreach my \$row/],
  ])('renders %s data-driven output', (frameworkId, pattern) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered.length).toBeGreaterThan(10);
    expect(rendered).toMatch(pattern);
  });

  test('junit5 csv strategy uses csv source', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5');
    convertor.setOptions({ options: { dataSourceStrategy: 'csv' } });
    const rendered = convertor.fromDataTable(makeTable());
    expect(rendered).toMatch(/@CsvSource/);
  });

  test.each(['pytest', 'jest', 'kotest', 'test-more'])(
    '%s prettyPrint=true renders one row per line',
    (frameworkId) => {
      const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
      convertor.setFramework(frameworkId);
      convertor.setOptions({ options: { prettyPrint: true } });
      const rendered = convertor.fromDataTable(makeTable());

      expect(rendered).toMatch(/\[\s*\n[\s\S]*\n[\s\S]*\n[\s\S]*\]/);
      expect(rendered).toMatch(/"Name":\s*"Connie"/);
      expect(rendered).toMatch(/"Name":\s*"Miles"/);
    }
  );

  test('pytest prettyPrint=false keeps row data inline', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('pytest');
    convertor.setOptions({ options: { prettyPrint: false } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toContain('[{"Name": "Connie", "Age": 21}, {"Name": "Miles", "Age": 34}]');
  });

  test.each(['jest', 'kotest', 'test-more'])('%s prettyPrint=false keeps row data inline', (frameworkId) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    convertor.setOptions({ options: { prettyPrint: false } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toContain('[{"Name":"Connie","Age":21}, {"Name":"Miles","Age":34}]');
  });
});
