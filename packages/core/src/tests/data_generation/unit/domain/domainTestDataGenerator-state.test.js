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

  test('uses the generator faker instance instead of an execution-context override', () => {
    const generatorFaker = {
      person: {
        firstName: () => 'generator-faker',
      },
    };
    const overrideFaker = {
      person: {
        firstName: () => 'override-faker',
      },
    };
    const generator = new DomainTestDataGenerator(generatorFaker);

    const result = generator.generateFrom(
      { ruleSpec: 'person.firstName' },
      {
        faker: overrideFaker,
      }
    );

    expect(result.data).toBe('generator-faker');
  });

  test('uses parsed rule args instead of execution-context args overrides', () => {
    const generator = new DomainTestDataGenerator(faker);

    const result = generator.generateFrom(
      { ruleSpec: 'literal.value("from-rule")' },
      {
        args: ['from-context'],
      }
    );

    expect(result.data).toBe('from-rule');
  });
});
