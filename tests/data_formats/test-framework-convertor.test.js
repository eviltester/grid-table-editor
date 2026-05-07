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

function makePhpEscapingTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Payload']);
  table.appendDataRow([{ "O'Reilly\\Team": "Alice\\Bob's" }]);
  return table;
}

function makeCsvEscapingTable() {
  const table = new GenericDataTable();
  table.setHeaders(['Value']);
  table.appendDataRow(['Path C:\\temp\\file "quoted"']);
  return table;
}

function makeRubyHeaderEscapingTable() {
  const table = new GenericDataTable();
  table.setHeaders(['First Name', 'user-id', '123code']);
  table.appendDataRow(['Connie', 'qa-1', 'X1']);
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

  test('junit5 inline strategy uses csv source', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5');
    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const rendered = convertor.fromDataTable(makeTable());
    expect(rendered).toMatch(/@CsvSource/);
    expect(rendered).toMatch(/quoteCharacter = '\"'/);
  });

  test('junit5 inline strategy escapes backslashes and quotes in string fields', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5');
    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const rendered = convertor.fromDataTable(makeCsvEscapingTable());

    expect(rendered).toContain('Path C:\\\\\\\\temp\\\\\\\\file \\\\\\"quoted\\\\\\"');
  });

  test.each(['pytest', 'jest'])('%s prettyPrint=true renders one row per line', (frameworkId) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    convertor.setOptions({ options: { prettyPrint: true } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toMatch(/\[\s*\n[\s\S]*\n[\s\S]*\n[\s\S]*\]/);
    expect(rendered).toMatch(/"Name":\s*"Connie"/);
    expect(rendered).toMatch(/"Name":\s*"Miles"/);
  });

  test('test-more prettyPrint=true renders one row per line', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('test-more');
    convertor.setOptions({ options: { prettyPrint: true } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toMatch(/\[\s*\n[\s\S]*\n[\s\S]*\n[\s\S]*\]/);
    expect(rendered).toMatch(/\{'Name' => 'Connie', 'Age' => 21\}/);
    expect(rendered).toMatch(/\{'Name' => 'Miles', 'Age' => 34\}/);
  });

  test('kotest prettyPrint=true renders one row per line', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('kotest');
    convertor.setOptions({ options: { prettyPrint: true } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toMatch(/\[\s*\n[\s\S]*\n[\s\S]*\n[\s\S]*\]/);
    expect(rendered).toMatch(/mapOf\("Name" to "Connie", "Age" to 21\)/);
    expect(rendered).toMatch(/mapOf\("Name" to "Miles", "Age" to 34\)/);
  });

  test('pytest prettyPrint=false keeps row data inline', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('pytest');
    convertor.setOptions({ options: { prettyPrint: false } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toContain('[{"Name": "Connie", "Age": 21}, {"Name": "Miles", "Age": 34}]');
  });

  test('test-more prettyPrint=false keeps row data inline', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('test-more');
    convertor.setOptions({ options: { prettyPrint: false } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toContain("[{'Name' => 'Connie', 'Age' => 21}, {'Name' => 'Miles', 'Age' => 34}]");
  });

  test.each(['jest'])('%s prettyPrint=false keeps row data inline', (frameworkId) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    convertor.setOptions({ options: { prettyPrint: false } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toContain('[{"Name":"Connie","Age":21}, {"Name":"Miles","Age":34}]');
  });

  test('kotest prettyPrint=false keeps row data inline', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('kotest');
    convertor.setOptions({ options: { prettyPrint: false } });
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toContain('[mapOf("Name" to "Connie", "Age" to 21), mapOf("Name" to "Miles", "Age" to 34)]');
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

  test('junit5 provider/inline data source strategies render different structures', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const providerRendered = convertor.fromDataTable(makeTable());
    expect(providerRendered).toMatch(/@MethodSource/);
    expect(providerRendered).toMatch(/Stream<Arguments>/);

    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/@CsvSource/);
    expect(inlineRendered).not.toMatch(/@MethodSource/);
  });

  test.each(['junit5', 'junit6'])('%s legacy csv strategy is supported as inline alias', (frameworkId) => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework(frameworkId);
    convertor.setOptions({ options: { dataSourceStrategy: 'inline' } });
    const inlineRendered = convertor.fromDataTable(makeTable());
    expect(inlineRendered).toMatch(/@CsvSource/);
    expect(inlineRendered).not.toMatch(/@MethodSource/);

    convertor.setOptions({ options: { dataSourceStrategy: 'csv' } });
    const csvRendered = convertor.fromDataTable(makeTable());
    expect(csvRendered).toMatch(/@CsvSource/);
    expect(csvRendered).not.toMatch(/@MethodSource/);
    expect(csvRendered).toBe(inlineRendered);
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

  test('junit5-kotlin is distinct from kotest and uses junit imports', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('junit5-kotlin');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const junitKotlin = convertor.fromDataTable(makeTable());

    convertor.setFramework('kotest');
    const kotest = convertor.fromDataTable(makeTable());

    expect(junitKotlin).toMatch(/import org\.junit\.jupiter\.params\.provider\.Arguments/);
    expect(junitKotlin).toMatch(/@MethodSource\("rows"\)/);
    expect(kotest).toMatch(/import io\.kotest\.core\.spec\.style\.StringSpec/);
    expect(junitKotlin).not.toEqual(kotest);
  });

  test('nose2 is distinct from unittest and uses nose2 params conventions', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('nose2');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const nose2 = convertor.fromDataTable(makeTable());

    convertor.setFramework('unittest');
    const unittest = convertor.fromDataTable(makeTable());

    expect(nose2).toMatch(/from nose2\.tools import params/);
    expect(nose2).toMatch(/@params\(\*row_provider\(\)\)/);
    expect(nose2).not.toEqual(unittest);
  });

  test('mocha uses mocha/assert idioms distinct from jest', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('mocha');
    const mocha = convertor.fromDataTable(makeTable());

    convertor.setFramework('jest');
    const jest = convertor.fromDataTable(makeTable());

    expect(mocha).toMatch(/const assert = require\('node:assert\/strict'\)/);
    expect(mocha).toMatch(/rows\.forEach\(\(row, index\) => \{/);
    expect(mocha).not.toMatch(/test\.each/);
    expect(mocha).not.toEqual(jest);
  });

  test('vitest uses vitest import/it.each idioms distinct from jest', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('vitest');
    const vitest = convertor.fromDataTable(makeTable());

    convertor.setFramework('jest');
    const jest = convertor.fromDataTable(makeTable());

    expect(vitest).toMatch(/from 'vitest'/);
    expect(vitest).toMatch(/it\.each/);
    expect(vitest).not.toEqual(jest);
  });

  test('nunit uses NUnit attributes and assertions', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('nunit');
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toMatch(/using NUnit\.Framework;/);
    expect(rendered).toMatch(/\[TestCaseSource\(nameof\(Rows\)\)\]/);
    expect(rendered).toMatch(/Assert\.AreEqual/);
  });

  test('mstest uses MSTest attributes and dynamic data', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('mstest');
    const rendered = convertor.fromDataTable(makeTable());

    expect(rendered).toMatch(/using Microsoft\.VisualStudio\.TestTools\.UnitTesting;/);
    expect(rendered).toMatch(/\[DataTestMethod\]/);
    expect(rendered).toMatch(/\[DynamicData\(nameof\(Rows\), DynamicDataSourceType\.Method\)\]/);
  });

  test('minitest uses minitest idioms distinct from rspec', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('minitest');
    const minitest = convertor.fromDataTable(makeTable());

    convertor.setFramework('rspec');
    const rspec = convertor.fromDataTable(makeTable());

    expect(minitest).toMatch(/require 'minitest\/autorun'/);
    expect(minitest).toMatch(/< Minitest::Test/);
    expect(minitest).toMatch(/assert_equal|assert\(/);
    expect(minitest).not.toEqual(rspec);
  });

  test('ruby framework renderers quote non-identifier hash keys safely', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('rspec');
    const rspec = convertor.fromDataTable(makeRubyHeaderEscapingTable());

    expect(rspec).toContain('"First Name" =>');
    expect(rspec).toContain('"user-id" =>');
    expect(rspec).toContain('"123code" =>');
  });

  test('pest uses pest test idioms distinct from phpunit', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('pest');
    const pest = convertor.fromDataTable(makeTable());

    convertor.setFramework('phpunit');
    const phpunit = convertor.fromDataTable(makeTable());

    expect(pest).toMatch(/it\('row parameterized'/);
    expect(pest).toMatch(/->with\(rowProvider\(\)\)/);
    expect(pest).toMatch(/expect\(\$actual\[/);
    expect(pest).not.toEqual(phpunit);
  });

  test('php serializers escape object keys containing backslashes and quotes', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('phpunit');
    convertor.setOptions({ options: { dataSourceStrategy: 'provider' } });
    const rendered = convertor.fromDataTable(makePhpEscapingTable());

    expect(rendered).toContain("['O\\'Reilly\\\\Team' => 'Alice\\\\Bob\\'s']");
  });

  test('spek uses spek structure distinct from kotest', () => {
    const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
    convertor.setFramework('spek');
    const spek = convertor.fromDataTable(makeTable());

    convertor.setFramework('kotest');
    const kotest = convertor.fromDataTable(makeTable());

    expect(spek).toMatch(/import org\.spekframework\.spek2\.Spek/);
    expect(spek).toMatch(/describe\("/);
    expect(spek).not.toEqual(kotest);
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
    '%s matches golden snapshot (setup + provider)',
    (frameworkId) => {
      const convertor = new TestFrameworkConvertor(new TestFrameworkConvertorOptions());
      convertor.setFramework(frameworkId);
      convertor.setOptions({
        options: { includeSetup: true, dataSourceStrategy: 'provider' },
      });
      const rendered = convertor.fromDataTable(makeTable());
      expect(rendered).toMatchSnapshot();
    }
  );
});
