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
    ['rspec', /row_provider\.each do \|row\|/],
    ['phpunit', /@dataProvider rowProvider/],
    ['kotest', /rowProvider\(\)\.forEach \{ row ->/],
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

  test.each([
    ['junit4', /@Before/],
    ['junit5', /@BeforeEach/],
    ['junit6', /@BeforeEach/],
    ['testng', /@BeforeMethod/],
    ['pytest', /@pytest\.fixture/],
    ['jest', /beforeEach\(\(\) =>/],
    ['xunit', /public GeneratedDataTests\(\)/],
    ['rspec', /before do/],
    ['phpunit', /protected function setUp\(\): void/],
    ['kotest', /beforeTest \{/],
    ['test-more', /my \$setup = \{\};/],
  ])('%s includeSetup=true emits setup scaffold', (frameworkId, pattern) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    convertor.setOptions({ options: { includeSetup: true } });
    const rendered = convertor.fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test.each([
    ['junit4', /@Before/],
    ['junit5', /@BeforeEach/],
    ['junit6', /@BeforeEach/],
    ['testng', /@BeforeMethod/],
    ['pytest', /@pytest\.fixture/],
    ['jest', /beforeEach\(\(\) =>/],
    ['xunit', /public GeneratedDataTests\(\)/],
    ['rspec', /before do/],
    ['phpunit', /protected function setUp\(\): void/],
    ['kotest', /beforeTest \{/],
    ['test-more', /my \$setup = \{\};/],
  ])('%s includeSetup=false omits setup scaffold', (frameworkId, pattern) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    convertor.setOptions({ options: { includeSetup: false } });
    const rendered = convertor.fromDataTable(makeTable());
    expect(rendered).not.toMatch(pattern);
  });

  test('jest strict/basic assertion style changes matcher', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('jest');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/toStrictEqual/);
    expect(strictRendered).not.toMatch(/toEqual\(/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/toEqual/);
    expect(basicRendered).not.toMatch(/toStrictEqual/);
  });

  test('phpunit strict/basic assertion style changes assertion api', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('phpunit');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/assertSame/);
    expect(strictRendered).not.toMatch(/assertEquals/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/assertEquals/);
    expect(basicRendered).not.toMatch(/assertSame/);
  });

  test('test-more strict/basic assertion style changes scalar assertion function', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('test-more');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/is_deeply/);
    expect(strictRendered).not.toMatch(/\sis\(/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/\sis\(/);
  });

  test('junit4 strict/basic assertion style changes assertion api', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit4');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/assertEquals/);
    expect(strictRendered).not.toMatch(/assertTrue\(Objects\.equals/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/assertTrue\(Objects\.equals/);
    expect(basicRendered).not.toMatch(/assertEquals/);
  });

  test('junit5 strict/basic assertion style changes assertion api', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/assertEquals/);
    expect(strictRendered).not.toMatch(/assertTrue\(Objects\.equals/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/assertTrue\(Objects\.equals/);
    expect(basicRendered).not.toMatch(/assertEquals/);
  });

  test('pytest strict/basic assertion style changes assertions', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('pytest');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/assert type\(actual\[/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).not.toMatch(/assert type\(actual\[/);
  });

  test('testng strict/basic assertion style changes assertion api', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('testng');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/assertEquals/);
    expect(strictRendered).not.toMatch(/assertTrue\(Objects\.equals/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/assertTrue\(Objects\.equals/);
    expect(basicRendered).not.toMatch(/assertEquals/);
  });

  test('xunit strict/basic assertion style changes assertion api', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('xunit');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/Assert\.Equal/);
    expect(strictRendered).not.toMatch(/Assert\.True\(object\.Equals/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/Assert\.True\(object\.Equals/);
    expect(basicRendered).not.toMatch(/Assert\.Equal/);
  });

  test('rspec strict/basic assertion style changes matcher', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('rspec');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/\.to eql\(/);
    expect(strictRendered).not.toMatch(/\.to eq\(/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).toMatch(/\.to eq\(/);
    expect(basicRendered).not.toMatch(/\.to eql\(/);
  });

  test('kotest strict/basic assertion style changes assertions', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('kotest');
    convertor.setOptions({ options: { assertionStyle: 'strict' } });
    const strictRendered = convertor.fromDataTable(makeTable());
    expect(strictRendered).toMatch(/::class \} shouldBe/);

    convertor.setOptions({ options: { assertionStyle: 'basic' } });
    const basicRendered = convertor.fromDataTable(makeTable());
    expect(basicRendered).not.toMatch(/::class \} shouldBe/);
  });

  test('junit4 provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit4');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/@RunWith\(Parameterized\.class\)/);
    expect(providerRendered).toMatch(/@Parameterized\.Parameters/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/@RunWith\(Theories\.class\)/);
    expect(inlineRendered).toMatch(/@DataPoints\("rows"\)/);
    expect(inlineRendered).toMatch(/@Theory/);
  });

  test('junit5 provider/csv data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/@MethodSource/);
    expect(providerRendered).toMatch(/Stream<Arguments>/);

    convertor.setOptions({ options: { dataSourceStrategy: 'csv' } });
    const csvRendered = convertor.fromDataTable(makeTable());
    expect(csvRendered).toMatch(/@CsvSource/);
    expect(csvRendered).not.toMatch(/@MethodSource/);
  });

  test('pytest provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('pytest');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/def row_provider\(\):/);
    expect(providerRendered).toMatch(/@pytest\.mark\.parametrize\("row", row_provider\(\)\)/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/ROWS = /);
    expect(inlineRendered).toMatch(/@pytest\.mark\.parametrize\("row", ROWS\)/);
  });

  test('testng provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('testng');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/@DataProvider/);
    expect(providerRendered).toMatch(/@Test\(dataProvider = "rows"\)/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/@Factory/);
    expect(inlineRendered).toMatch(/Object\[] instances = new Object\[rows\.length\]/);
    expect(inlineRendered).toMatch(/@Test/);
    expect(inlineRendered).not.toMatch(/@DataProvider/);
  });

  test('jest provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('jest');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/const getRows = \(\) =>/);
    expect(providerRendered).toMatch(/test\.each\(getRows\(\)\)/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/const rows = /);
    expect(inlineRendered).toMatch(/test\.each\(rows\)/);
  });

  test('xunit provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('xunit');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/\[MemberData\(nameof\(Rows\)\)\]/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/\[InlineData\(/);
    expect(inlineRendered).not.toMatch(/\[MemberData\(nameof\(Rows\)\)\]/);
  });

  test('rspec provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('rspec');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/def row_provider/);
    expect(providerRendered).toMatch(/row_provider\.each do \|row\|/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/ROWS = /);
    expect(inlineRendered).toMatch(/ROWS\.each do \|row\|/);
  });

  test('phpunit provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('phpunit');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/@dataProvider rowProvider/);
    expect(providerRendered).toMatch(/public static function rowProvider\(\): array/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/foreach \(\$rows as \$row\)/);
    expect(inlineRendered).not.toMatch(/@dataProvider rowProvider/);
  });

  test('kotest provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('kotest');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/fun rowProvider\(\) = /);
    expect(providerRendered).toMatch(/rowProvider\(\)\.forEach \{ row ->/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/val rows = /);
    expect(inlineRendered).toMatch(/rows\.forEach \{ row ->/);
  });

  test('test-more provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('test-more');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/sub row_provider/);
    expect(providerRendered).toMatch(/my \$rows = row_provider\(\);/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/my \$rows = \[/);
    expect(inlineRendered).not.toMatch(/sub row_provider/);
  });

  test.each(['junit5', 'pytest', 'jest', 'xunit', 'phpunit', 'kotest', 'test-more'])(
    '%s matches golden snapshot (strict + setup)',
    (frameworkId) => {
      const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
      convertor.setFramework(frameworkId);
      convertor.setOptions({
        options: { includeSetup: true, assertionStyle: 'strict', dataSourceStrategy: 'provider' },
      });
      const rendered = convertor.fromDataTable(makeTable());
      expect(rendered).toMatchSnapshot();
    }
  );
});
