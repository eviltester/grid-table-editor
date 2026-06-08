import {
  CombinationAlgorithm,
  CombinationsTestDataGenerator,
} from '../../../js/data_generation/n-wise/combinationsTestDataGenerator.js';

function createRules(count, values = ['a', 'b', 'c']) {
  return Array.from({ length: count }, (_, index) => ({
    name: `P${index + 1}`,
    type: 'enum',
    ruleSpec: `enum(${values.map((value) => `"${index + 1}.${value}"`).join(',')})`,
  }));
}

function assertRowsAreComplete(rows, expectedWidth) {
  expect(rows[0]).toHaveLength(expectedWidth);
  for (let index = 1; index < rows.length; index += 1) {
    expect(rows[index]).toHaveLength(expectedWidth);
    expect(rows[index].every((value) => String(value).length > 0)).toBe(true);
  }
}

describe('CombinationsTestDataGenerator', () => {
  test('keeps the current pairwise implementation available as a strength 2 strategy', () => {
    const generator = new CombinationsTestDataGenerator();
    const initResult = generator.initializeFromRules(createRules(3), {
      strength: 2,
      algorithm: CombinationAlgorithm.PAIRWISE,
    });

    expect(initResult.isError).toBe(false);
    const rowsResult = generator.generateAllDataRecordsAsRows();
    expect(rowsResult.isError).toBe(false);
    assertRowsAreComplete(rowsResult.data.data, 3);
    expect(rowsResult.data.stats).toEqual(
      expect.objectContaining({
        available: true,
        algorithm: CombinationAlgorithm.PAIRWISE,
        strength: 2,
        coveragePercentage: 100,
      })
    );
  });

  test('generates higher strength rows with the selected n-wise algorithm', () => {
    const generator = new CombinationsTestDataGenerator();
    const initResult = generator.initializeFromRules(createRules(4), {
      strength: 3,
      algorithm: CombinationAlgorithm.GREEDY,
    });

    expect(initResult.isError).toBe(false);
    const rowsResult = generator.generateAllDataRecordsAsRows();
    expect(rowsResult.isError).toBe(false);
    assertRowsAreComplete(rowsResult.data.data, 4);
    expect(rowsResult.data.stats).toEqual(
      expect.objectContaining({
        available: true,
        algorithm: CombinationAlgorithm.GREEDY,
        strength: 3,
        coveragePercentage: 100,
      })
    );
  });

  test('rejects invalid strength and algorithm choices clearly', () => {
    const generator = new CombinationsTestDataGenerator();
    expect(generator.initializeFromRules(createRules(2), { strength: 3 }).errorMessage).toMatch(
      /requires at least 3 ENUM parameters/
    );
    expect(generator.initializeFromRules(createRules(3), { algorithm: 'made-up' }).errorMessage).toMatch(
      /Unsupported combination generation algorithm/
    );
    expect(
      generator.initializeFromRules(createRules(3), {
        strength: 3,
        algorithm: CombinationAlgorithm.PAIRWISE,
      }).errorMessage
    ).toMatch(/only supports strength 2/);
  });
});
