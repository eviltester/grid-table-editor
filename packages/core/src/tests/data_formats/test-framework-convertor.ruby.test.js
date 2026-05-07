import {
  createConvertor,
  makeTable,
  makeStressTable,
  makeRubyHeaderEscapingTable,
} from './test-framework-convertor.shared.js';

describe('test framework convertor - Ruby', () => {
  test.each([
    ['rspec', /row_provider\.each do \|row\|/],
    ['minitest', /require 'minitest\/autorun'/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test('ruby renderers quote non-identifier hash keys safely', () => {
    const rendered = createConvertor('rspec').fromDataTable(makeRubyHeaderEscapingTable());
    expect(rendered).toContain('"First Name" =>');
    expect(rendered).toContain('actual["First Name"]');
    expect(rendered).not.toContain('actual[:First Name]');
  });

  test.each(['rspec', 'minitest'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
  });
});
