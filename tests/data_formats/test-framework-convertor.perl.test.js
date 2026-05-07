import { createConvertor, makeTable, makeStressTable } from './test-framework-convertor.shared.js';

describe('test framework convertor - Perl', () => {
  test.each([
    ['test-more', /foreach my \$row/],
    ['test2-suite', /use Test2::V0;/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test('test-more provider/inline render different structures', () => {
    const providerRendered = createConvertor('test-more', { dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    const inlineRendered = createConvertor('test-more', { dataSourceStrategy: 'inline' }).fromDataTable(makeTable());
    expect(providerRendered).toMatch(/sub row_provider/);
    expect(inlineRendered).toMatch(/my \$rows = \[/);
    expect(inlineRendered).not.toMatch(/sub row_provider/);
  });

  test.each(['test-more', 'test2-suite'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
  });

  test('test-more matches golden snapshot (setup + provider)', () => {
    const rendered = createConvertor('test-more', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toMatchSnapshot();
  });
});
