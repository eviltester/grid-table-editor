import { NWiseAlgorithm, NWiseGenerator } from '@anywaydata/core/data_generation/n-wise/nWiseGenerator.js';

const ALL_ALGORITHMS = Object.values(NWiseAlgorithm);

function createParameters(parameterCount, valueCount) {
  return Array.from({ length: parameterCount }, (_, parameterIndex) => ({
    name: `P${parameterIndex + 1}`,
    values: Array.from({ length: valueCount }, (_, valueIndex) => `${parameterIndex + 1}.${valueIndex + 1}`),
  }));
}

function combinations(items, size) {
  const results = [];
  const current = [];

  function visit(start) {
    if (current.length === size) {
      results.push([...current]);
      return;
    }

    const remaining = size - current.length;
    for (let index = start; index <= items.length - remaining; index += 1) {
      current.push(items[index]);
      visit(index + 1);
      current.pop();
    }
  }

  visit(0);
  return results;
}

function cartesianProduct(valueLists) {
  const results = [];
  const current = [];

  function visit(index) {
    if (index === valueLists.length) {
      results.push([...current]);
      return;
    }

    for (const value of valueLists[index]) {
      current.push(value);
      visit(index + 1);
      current.pop();
    }
  }

  visit(0);
  return results;
}

function assertNWiseCoverage(records, parameters, strength) {
  const parameterIndexes = parameters.map((_, index) => index);
  const parameterSubsets = combinations(parameterIndexes, strength);

  for (const subset of parameterSubsets) {
    const expectedTuples = cartesianProduct(subset.map((parameterIndex) => parameters[parameterIndex].values));
    const observedTuples = new Set(
      records.map((record) => JSON.stringify(subset.map((parameterIndex) => record[parameters[parameterIndex].name])))
    );

    for (const expectedTuple of expectedTuples) {
      expect(observedTuples.has(JSON.stringify(expectedTuple))).toBe(true);
    }
  }
}

function generateForBenchmark({ algorithm, strength, parameterCount, valueCount }) {
  const parameters = createParameters(parameterCount, valueCount);
  const generator = new NWiseGenerator(parameters, {
    algorithm,
    strength,
    candidateCount: 8,
    runs: algorithm === NWiseAlgorithm.AETG ? 2 : 1,
    seed: 17,
  });

  generator.generateDataSet();
  return {
    ...generator.getBenchmarkStats(),
    shape: `${parameterCount}x${valueCount}`,
  };
}

function expectNumberOrNull(value) {
  expect(typeof value === 'number' || value === null).toBe(true);
}

describe('NWiseGenerator algorithm comparison', () => {
  test.each(ALL_ALGORITHMS)('%s covers all pairs and triplets independently', (algorithm) => {
    const parameters = createParameters(5, 3);

    for (const strength of [2, 3]) {
      const generator = new NWiseGenerator(parameters, {
        algorithm,
        strength,
        candidateCount: 8,
        seed: 23,
      });

      generator.generateDataSet();
      const stats = generator.getCoverageStats();
      expect(stats.coveragePercentage).toBeCloseTo(100, 5);
      assertNWiseCoverage(generator.exportDataRecords(), parameters, strength);
    }
  });

  test.each(ALL_ALGORITHMS)('%s reaches full coverage through strength 6 for a bounded 6x3 model', (algorithm) => {
    const parameters = createParameters(6, 3);

    for (let strength = 2; strength <= 6; strength += 1) {
      const generator = new NWiseGenerator(parameters, {
        algorithm,
        strength,
        candidateCount: 8,
        seed: 31,
      });

      generator.generateDataSet();
      const stats = generator.getCoverageStats();
      expect(stats.coveragePercentage).toBeCloseTo(100, 5);
      expect(stats.totalRecords).toBeGreaterThan(0);
      assertNWiseCoverage(generator.exportDataRecords(), parameters, strength);
    }
  });

  test.each(ALL_ALGORITHMS)('%s emits full-factorial coverage when strength equals parameter count', (algorithm) => {
    const parameters = createParameters(4, 2);
    const generator = new NWiseGenerator(parameters, {
      algorithm,
      strength: parameters.length,
    });

    generator.generateDataSet();

    expect(generator.getCoverageStats()).toEqual(
      expect.objectContaining({
        coveragePercentage: 100,
        totalRecords: 2 ** 4,
        totalTuples: 2 ** 4,
        coveredTuples: 2 ** 4,
      })
    );
    assertNWiseCoverage(generator.exportDataRecords(), parameters, parameters.length);
  });

  test('rejects invalid algorithms clearly', () => {
    expect(
      () =>
        new NWiseGenerator(createParameters(3, 2), {
          algorithm: 'made-up',
        })
    ).toThrow(/Unsupported n-wise algorithm: made-up/);
  });

  test.each([0, 1.5, 4])('rejects invalid strength %s clearly', (strength) => {
    expect(
      () =>
        new NWiseGenerator(createParameters(3, 2), {
          strength,
        })
    ).toThrow(/strength/);
  });

  test('exposes benchmark stats with runtime and memory fields', () => {
    const generator = new NWiseGenerator(createParameters(4, 3), {
      algorithm: NWiseAlgorithm.AETG,
      strength: 2,
      runs: 2,
      candidateCount: 8,
      seed: 29,
    });

    generator.generateDataSet();
    const stats = generator.getBenchmarkStats();

    expect(stats).toEqual(
      expect.objectContaining({
        algorithm: NWiseAlgorithm.AETG,
        strength: 2,
        parameterCount: 4,
        rowCount: expect.any(Number),
        totalTuples: expect.any(Number),
        coveredTuples: expect.any(Number),
        coveragePercentage: expect.any(Number),
        runtimeMs: expect.any(Number),
        runs: 2,
      })
    );
    expectNumberOrNull(stats.heapUsedBeforeBytes);
    expectNumberOrNull(stats.heapUsedAfterBytes);
    expectNumberOrNull(stats.heapUsedDeltaBytes);
    expectNumberOrNull(stats.rssBeforeBytes);
    expectNumberOrNull(stats.rssAfterBytes);
    expectNumberOrNull(stats.rssDeltaBytes);
    expect(typeof stats.rowsGeneratedByGraphPhase).toBe('number');
    expect(typeof stats.rowsGeneratedByFallback).toBe('number');
    expect(typeof stats.lookaheadEvaluations).toBe('number');
    expect(typeof stats.candidateEvaluations).toBe('number');
    expect(typeof stats.seedEdgesConsidered).toBe('number');
    expect(stats.phaseSwitchRow === null || typeof stats.phaseSwitchRow === 'number').toBe(true);
  });
});

const maybeLimitTest = process.env.NWISE_LIMIT_TESTS === 'true' ? test : test.skip;

maybeLimitTest('logs n-wise algorithm limits for representative 6-parameter models', () => {
  const rows = [];

  for (const valueCount of [3, 4]) {
    for (let strength = 2; strength <= 6; strength += 1) {
      for (const algorithm of ALL_ALGORITHMS) {
        rows.push(
          generateForBenchmark({
            algorithm,
            strength,
            parameterCount: 6,
            valueCount,
          })
        );
      }
    }
  }

  console.table(
    rows.map((row) => ({
      algorithm: row.algorithm,
      shape: row.shape,
      strength: row.strength,
      rows: row.rowCount,
      totalTuples: row.totalTuples,
      coveredTuples: row.coveredTuples,
      coverage: row.coveragePercentage.toFixed(1),
      runtimeMs: row.runtimeMs,
    }))
  );

  for (const row of rows) {
    expect(row.coveragePercentage).toBeCloseTo(100, 5);
  }
});
