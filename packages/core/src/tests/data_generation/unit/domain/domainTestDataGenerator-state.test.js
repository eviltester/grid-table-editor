import { faker } from '@faker-js/faker';
import { DomainTestDataGenerator } from '../../../../../js/data_generation/domain/domainTestDataGenerator.js';

describe('DomainTestDataGenerator state restore', () => {
  test('does not reuse rule keys allocated after a restored snapshot', () => {
    const generator = new DomainTestDataGenerator(faker);
    const firstRule = { ruleSpec: 'autoIncrement.sequence(start=10)' };
    const secondRule = { ruleSpec: 'autoIncrement.sequence(start=100)' };

    const initialSnapshot = generator.captureState();

    expect(generator.generateFrom(firstRule).data).toBe(10);

    generator.restoreState(initialSnapshot);

    expect(generator.generateFrom(secondRule).data).toBe(100);
  });
});
