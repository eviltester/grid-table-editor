import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataGenerator } from '../../../js/data_generation/testDataGenerator.js';

describe('domain generation integration', () => {
  test('generates values for domain rules via TestDataGenerator', () => {
    const generator = new TestDataGenerator(faker, RandExp);
    generator.rulesParser.testDataRules.rules = [
      {
        name: 'rating',
        ruleSpec: 'number.int(1,10)',
        comments: '',
        type: 'domain',
      },
    ];

    generator.compile();
    const row = generator.generateRow();

    expect(generator.isValid()).toBe(true);
    expect(row).toHaveLength(1);
    expect(typeof row[0]).toBe('number');
    expect(row[0]).toBeGreaterThanOrEqual(1);
    expect(row[0]).toBeLessThanOrEqual(10);
  });
});
