import { Faker, en } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('datatype domain keyword execution', () => {
  let faker;

  beforeEach(() => {
    faker = new Faker({ locale: [en] });
    faker.seed(12345);
  });

  test('executes datatype.boolean', () => {
    const result = executeDomainKeyword('datatype.boolean', { faker, args: [] });
    expect(typeof result).toBe('boolean');
  });

  test('datatype.boolean can generate both true and false values', () => {
    const seen = new Set();
    for (let index = 0; index < 200; index++) {
      const value = executeDomainKeyword('datatype.boolean', { faker, args: [] });
      seen.add(value);
      if (seen.has(true) && seen.has(false)) {
        break;
      }
    }

    expect(seen.has(true)).toBe(true);
    expect(seen.has(false)).toBe(true);
  });
});
