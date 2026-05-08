import {
  createConvertor,
  makeTable,
  makeStressTable,
  makePhpEscapingTable,
} from './test-framework-convertor.shared.js';

describe('test framework convertor - PHP', () => {
  test.each([
    ['phpunit', /@dataProvider rowProvider/],
    ['pest', /it\('row parameterized'/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test('pest uses pest idioms distinct from phpunit', () => {
    const pest = createConvertor('pest').fromDataTable(makeTable());
    const phpunit = createConvertor('phpunit').fromDataTable(makeTable());
    expect(pest).not.toEqual(phpunit);
    expect(pest).toContain('->with(rowProvider())');
  });

  test('php serializers escape object keys containing backslashes and quotes', () => {
    const rendered = createConvertor('phpunit', { dataSourceStrategy: 'provider' }).fromDataTable(
      makePhpEscapingTable()
    );
    expect(rendered).toContain("['O\\'Reilly\\\\Team' => 'Alice\\\\Bob\\'s']");
  });

  test.each(['phpunit', 'pest'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
  });

  test('phpunit matches golden snapshot (setup + provider)', () => {
    const rendered = createConvertor('phpunit', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toMatchSnapshot();
  });
});
