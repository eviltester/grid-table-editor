import { Faker, en } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

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

  test('executes datatype.boolean with named probability=1 and returns true', () => {
    const parsed = parseKeywordInvocation('datatype.boolean(probability=1)');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result).toBe(true);
    expect(typeof result).toBe('boolean');
  });

  test('executes datatype.boolean with named probability=0 and returns false', () => {
    const parsed = parseKeywordInvocation('datatype.boolean(probability=0)');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result).toBe(false);
    expect(typeof result).toBe('boolean');
  });
});
