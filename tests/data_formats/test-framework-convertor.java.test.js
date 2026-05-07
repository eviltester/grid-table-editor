import {
  createConvertor,
  makeTable,
  makeNestedValueTable,
  makeStressTable,
} from './test-framework-convertor.shared.js';

describe('test framework convertor - Java', () => {
  test.each([
    ['junit4', /@RunWith\(Parameterized\.class\)/],
    ['junit5', /@ParameterizedTest/],
    ['junit6', /@ParameterizedTest/],
    ['testng', /@DataProvider/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test('junit5 inline strategy uses csv source', () => {
    const rendered = createConvertor('junit5', { dataSourceStrategy: 'inline' }).fromDataTable(makeTable());
    expect(rendered).toMatch(/@CsvSource/);
    expect(rendered).toMatch(/quoteCharacter = '"'/);
  });

  test.each(['junit4', 'junit5', 'junit6', 'testng'])(
    '%s serializes nested values into Java-valid string literals',
    (frameworkId) => {
      const rendered = createConvertor(frameworkId).fromDataTable(makeNestedValueTable());
      expect(rendered).toContain('\\"nested\\"');
      expect(rendered).not.toContain('[object Object]');
    }
  );

  test('junit5 and junit6 parity on core row data', () => {
    const j5 = createConvertor('junit5', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    const j6 = createConvertor('junit6', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(j5).toContain('Connie');
    expect(j6).toContain('Connie');
  });

  test.each(['junit4', 'junit5', 'junit6', 'testng'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
  });

  test('junit5 matches golden snapshot (setup + provider)', () => {
    const rendered = createConvertor('junit5', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toMatchSnapshot();
  });
});
