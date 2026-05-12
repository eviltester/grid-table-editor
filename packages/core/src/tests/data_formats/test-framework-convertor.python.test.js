import {
  createConvertor,
  makeTable,
  makeStressTable,
  makeKeywordIdentifierTable,
  makePythonBooleanTable,
} from './test-framework-convertor.shared.js';

describe('test framework convertor - Python', () => {
  test.each([
    ['pytest', /@pytest\.mark\.parametrize/],
    ['unittest', /import unittest/],
    ['nose2', /from nose2\.tools import params/],
  ])('renders %s output', (frameworkId, pattern) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makeTable());
    expect(rendered).toMatch(pattern);
  });

  test.each(['pytest', 'unittest', 'nose2'])('%s renders Python boolean literals as True/False', (frameworkId) => {
    const rendered = createConvertor(frameworkId).fromDataTable(makePythonBooleanTable());
    expect(rendered).toContain('True');
    expect(rendered).toContain('False');
  });

  test.each(['pytest', 'unittest', 'nose2'])('%s sanitizes invalid testNamePrefix identifiers', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { testNamePrefix: '123 bad-prefix' }).fromDataTable(makeTable());
    expect(rendered).toMatch(/_123_bad_prefix|test__123_bad_prefix|test_123_bad_prefix/);
  });

  test.each(['pytest', 'unittest', 'nose2'])('%s avoids reserved identifiers in generated names', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { suiteName: 'class', testNamePrefix: 'def' }).fromDataTable(
      makeKeywordIdentifierTable()
    );
    expect(rendered).toMatch(/def_value/);
  });

  test.each(['pytest', 'unittest', 'nose2'])('%s renders stress-table content', (frameworkId) => {
    const rendered = createConvertor(frameworkId, { dataSourceStrategy: 'provider', prettyPrint: true }).fromDataTable(
      makeStressTable()
    );
    expect(rendered).toContain('Connie');
    expect(rendered).toContain('line\\nbreak');
  });

  test('pytest includes setup and provider structure', () => {
    const rendered = createConvertor('pytest', { includeSetup: true, dataSourceStrategy: 'provider' }).fromDataTable(
      makeTable()
    );
    expect(rendered).toContain('import pytest');
    expect(rendered).toContain('def setup_context():');
    expect(rendered).toContain('def row_provider():');
    expect(rendered).toContain('@pytest.mark.parametrize("row", row_provider())');
    expect(rendered).toContain('Connie');
    expect(rendered).toContain('Miles');
  });
});
