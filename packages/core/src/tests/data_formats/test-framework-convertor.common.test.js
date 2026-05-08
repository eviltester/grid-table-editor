import { buildCanonicalModel, makeTable } from './test-framework-convertor.shared.js';

describe('test framework convertor - Common', () => {
  test('buildCanonicalModel maps headers and rows', () => {
    const model = buildCanonicalModel(makeTable(), {
      suiteName: 'MySuite',
      testNamePrefix: 'row',
      includeSetup: true,
      prettyPrint: true,
      dataSourceStrategy: 'provider',
    });

    expect(model.schemaVersion).toBe('1.0');
    expect(model.headers).toEqual(['Name', 'Age']);
    expect(model.rows).toEqual([
      { Name: 'Connie', Age: 21 },
      { Name: 'Miles', Age: 34 },
    ]);
  });
});
