import { pathToFileURL } from 'node:url';
import path from 'node:path';

async function loadComparisonScript() {
  const scriptPath = path.resolve(process.cwd(), 'scripts/compare-domain-faker-params.mjs');
  return import(pathToFileURL(scriptPath).href);
}

describe('domain faker option param comparison', () => {
  test('documents every Faker top-level options object param in domain metadata', async () => {
    const { getFakerOptionParamComparison } = await loadComparisonScript();
    const comparison = getFakerOptionParamComparison();

    expect(comparison.filter((row) => row.missingInDomain.length > 0)).toEqual([]);
  });

  test('does not expose domain params that Faker does not implement', async () => {
    const { getFakerOptionParamComparison } = await loadComparisonScript();
    const comparison = getFakerOptionParamComparison();

    expect(comparison.filter((row) => row.domainOnlyParams.length > 0)).toEqual([]);
  });

  test('number.bigInt exposes Faker range params instead of the old value placeholder', async () => {
    const { getFakerOptionParamComparison } = await loadComparisonScript();
    const comparison = getFakerOptionParamComparison();
    const bigIntRow = comparison.find((row) => row.keyword === 'number.bigInt');

    expect(bigIntRow).toEqual(
      expect.objectContaining({
        fakerOptionParams: ['min', 'max', 'multipleOf'],
        domainParams: ['min', 'max', 'multipleOf'],
        missingInDomain: [],
      })
    );
  });
});
