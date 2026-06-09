import { existsSync } from 'node:fs';

const EXPERIMENTAL_GENERATOR_MODULE_URL = new URL(
  '../../../../../experiments/n-wise/experimentalNWiseGenerator.js',
  import.meta.url
);
const experimentalGeneratorModule = existsSync(EXPERIMENTAL_GENERATOR_MODULE_URL)
  ? await import(EXPERIMENTAL_GENERATOR_MODULE_URL.href)
  : null;
const { ExperimentalNWiseAlgorithm, ExperimentalNWiseGenerator } = experimentalGeneratorModule || {};
const ALL_ALGORITHMS = ExperimentalNWiseAlgorithm ? Object.values(ExperimentalNWiseAlgorithm) : [];
const describeExperimentalNWise = experimentalGeneratorModule ? describe : describe.skip;

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

function assertExactlyOneValuePerParameter(records, parameters) {
  for (const record of records) {
    expect(Object.keys(record)).toHaveLength(parameters.length);
    for (const parameter of parameters) {
      expect(record).toHaveProperty(parameter.name);
      expect(parameter.values).toContain(record[parameter.name]);
    }
  }
}

describeExperimentalNWise('ExperimentalNWiseGenerator multipartite algorithm comparison', () => {
  test.each(ALL_ALGORITHMS)('%s covers all pairs and triplets independently', (algorithm) => {
    const parameters = createParameters(5, 3);

    for (const strength of [2, 3]) {
      const generator = new ExperimentalNWiseGenerator(parameters, {
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
      const generator = new ExperimentalNWiseGenerator(parameters, {
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

  test.each(ALL_ALGORITHMS)('%s is deterministic for a fixed seed', (algorithm) => {
    const parameters = createParameters(5, 3);
    const first = new ExperimentalNWiseGenerator(parameters, {
      algorithm,
      strength: 3,
      seed: 41,
    });
    const second = new ExperimentalNWiseGenerator(parameters, {
      algorithm,
      strength: 3,
      seed: 41,
    });

    first.generateDataSet();
    second.generateDataSet();

    expect(first.exportDataRecords()).toEqual(second.exportDataRecords());
  });

  test.each(ALL_ALGORITHMS)('%s emits complete rows with one value per parameter', (algorithm) => {
    const parameters = createParameters(6, 3);
    const generator = new ExperimentalNWiseGenerator(parameters, {
      algorithm,
      strength: 4,
      seed: 53,
    });

    generator.generateDataSet();
    const records = generator.exportDataRecords();

    expect(records.length).toBeGreaterThan(0);
    assertExactlyOneValuePerParameter(records, parameters);
  });

  test('rejects invalid experimental algorithms clearly', () => {
    expect(
      () =>
        new ExperimentalNWiseGenerator(createParameters(3, 2), {
          algorithm: 'made-up',
        })
    ).toThrow(/Unsupported experimental n-wise algorithm: made-up/);
  });

  test('adaptive and hybrid strategies expose experimental benchmark activity', () => {
    const adaptiveGenerator = new ExperimentalNWiseGenerator(createParameters(6, 3), {
      algorithm: ExperimentalNWiseAlgorithm.MULTIPARTITE_GRAPH_LOOKAHEAD_ADAPTIVE,
      strength: 4,
      candidateCount: 8,
      seed: 17,
    });
    adaptiveGenerator.generateDataSet();
    const adaptiveStats = adaptiveGenerator.getBenchmarkStats();

    expect(adaptiveStats.candidateEvaluations).toBeGreaterThan(0);
    expect(adaptiveStats.rowsGeneratedByGraphPhase).toBeGreaterThan(0);
    expect(adaptiveStats.lookaheadEvaluations).toBeGreaterThan(0);

    const hybridGenerator = new ExperimentalNWiseGenerator(createParameters(6, 4), {
      algorithm: ExperimentalNWiseAlgorithm.MULTIPARTITE_GRAPH_LOOKAHEAD_HYBRID,
      strength: 5,
      candidateCount: 8,
      seed: 17,
    });
    hybridGenerator.generateDataSet();
    const hybridStats = hybridGenerator.getBenchmarkStats();

    expect(hybridStats.phaseSwitchRow).not.toBeNull();
    expect(hybridStats.rowsGeneratedByGraphPhase).toBeGreaterThan(0);
    expect(hybridStats.rowsGeneratedByFallback).toBeGreaterThan(0);
  });

  test('baseline experimental lookahead row count stays stable for seeded 6x3 strength 4', () => {
    const generator = new ExperimentalNWiseGenerator(createParameters(6, 3), {
      algorithm: ExperimentalNWiseAlgorithm.MULTIPARTITE_GRAPH_LOOKAHEAD,
      strength: 4,
      candidateCount: 8,
      seed: 17,
    });

    generator.generateDataSet();

    expect(generator.getCoverageStats().totalRecords).toBe(140);
  });
});
