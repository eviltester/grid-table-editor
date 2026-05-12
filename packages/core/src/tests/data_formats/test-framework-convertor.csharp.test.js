import {
  createConvertor,
  makeTable,
  makeNestedValueTable,
  makeStressTable,
} from './test-framework-convertor.shared.js';

describe('test framework convertor - CSharp', () => {
  test.each([
    ['xunit', /\[Theory\]/],
    ['nunit', /using NUnit\.Framework;/],
    ['mstest', /using Microsoft\.VisualStudio\.TestTools\.UnitTesting;/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test.each(['xunit', 'nunit', 'mstest'])(
    '%s serializes nested values into C#-valid string literals',
    (frameworkId) => {
      const rendered = createConvertor(frameworkId).fromDataTable(makeNestedValueTable());
      expect(rendered).toContain('\\"nested\\"');
      expect(rendered).not.toContain('[object Object]');
    }
  );

  test('mstest uses attributes and dynamic data', () => {
    const rendered = createConvertor('mstest').fromDataTable(makeTable());
    expect(rendered).toMatch(/\[DataTestMethod\]/);
    expect(rendered).toMatch(/\[DynamicData\(nameof\(Rows\), DynamicDataSourceType\.Method\)\]/);
  });

  test.each(['xunit', 'nunit', 'mstest'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
  });

  test('xunit includes setup and provider structure', () => {
    const rendered = createConvertor('xunit', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toContain('using Xunit;');
    expect(rendered).toContain('public static IEnumerable<object[]> Rows');
    expect(rendered).toContain('[Theory]');
    expect(rendered).toContain('[MemberData(nameof(Rows))]');
    expect(rendered).toContain('Connie');
    expect(rendered).toContain('Miles');
  });
});
