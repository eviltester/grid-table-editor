import { createConvertor, makeTable, makeStressTable } from './test-framework-convertor.shared.js';

describe('test framework convertor - JavaScript', () => {
  test.each([
    ['jest', /test\.each\(getRows\(\)\)/],
    ['vitest', /it\.each\(getRows\(\)\)/],
    ['mocha', /const assert = require\('node:assert\/strict'\);/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test('jest and vitest parity on core row data', () => {
    const left = createConvertor('jest', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    const right = createConvertor('vitest', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(left).toContain('Connie');
    expect(right).toContain('Connie');
    expect(left).toContain('parameterized');
    expect(right).toContain('parameterized');
  });

  test.each(['jest', 'vitest', 'mocha'])('%s preserves newline/tab/backslash escaping', (frameworkId) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeStressTable());
    expect(rendered).toContain('line1\\nline2');
    expect(rendered).toContain('tab\\tvalue');
    expect(rendered).toMatch(/backslash \\\\/);
  });

  test('mocha uses mocha/assert idioms distinct from jest', () => {
    const mocha = createConvertor('mocha').fromDataTable(makeTable());
    const jest = createConvertor('jest').fromDataTable(makeTable());
    expect(mocha).toContain('assert.deepStrictEqual');
    expect(mocha).not.toEqual(jest);
  });

  test('jest includes setup and provider structure', () => {
    const rendered = createConvertor('jest', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toContain("describe('GeneratedDataTests'");
    expect(rendered).toContain('beforeEach(() => {');
    expect(rendered).toContain('const getRows = () => [');
    expect(rendered).toContain("test.each(getRows())('row parameterized'");
    expect(rendered).toContain('Connie');
    expect(rendered).toContain('Miles');
  });
});
