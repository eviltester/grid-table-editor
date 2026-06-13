import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '../../../js/data_generation/testDataGenerator.js';
import { PairwiseTestDataGenerator } from '../../../js/data_generation/n-wise/pairwiseTestDataGenerator.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';

describe('autoIncrement.timestamp integration', () => {
  test('increments across generated rows in normal rules-based generation', () => {
    const generator = new TestDataGenerator(faker, RandExp);
    generator.importSpec('CreatedAt\nautoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1, type="seconds")');
    generator.compile();

    expect(generator.isValid()).toBe(true);

    const rows = generator.generate(3);
    expect(rows).toEqual([['CreatedAt'], ['2026-06-12T12:39:23Z'], ['2026-06-12T12:39:24Z'], ['2026-06-12T12:39:25Z']]);
  });

  test('increments across generated rows in pairwise output alongside enum columns', () => {
    const rules = [
      new TestDataRule('Browser', 'enum("Chrome","Firefox")'),
      new TestDataRule('Theme', 'enum("Light","Dark")'),
      new TestDataRule(
        'CreatedAt',
        'autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=5, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")'
      ),
    ];

    rules[0].type = 'enum';
    rules[1].type = 'enum';
    rules[2].type = 'domain';

    const generator = new PairwiseTestDataGenerator(faker);
    const initResult = generator.initializeFromRules(rules);
    expect(initResult.isError).toBe(false);

    const result = generator.generateAllDataRecordsAsRows();
    expect(result.isError).toBe(false);

    const rows = result.data.data;
    expect(rows[0]).toEqual(['Browser', 'Theme', 'CreatedAt']);
    expect(rows.slice(1).map((row) => row[2])).toEqual([
      '2026-06-12 12:39:23',
      '2026-06-12 12:44:23',
      '2026-06-12 12:49:23',
      '2026-06-12 12:54:23',
    ]);
  });
});
