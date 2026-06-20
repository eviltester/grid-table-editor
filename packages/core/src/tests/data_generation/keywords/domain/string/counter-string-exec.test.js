import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

function runWithSeed(seed, keyword, args) {
  faker.seed(seed);
  return executeDomainKeyword(keyword, { faker, args });
}

describe('string.counterString domain keyword execution', () => {
  test('routes execution through the domain keyword interface', () => {
    const result = runWithSeed(999, 'string.counterString', []);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(25);
    expect(result).toContain('*');
  });

  test('supports named parameters through the parser and execution interface', () => {
    faker.seed(1010);
    const parsed = parseKeywordInvocation('string.counterString(min=12, max=12, delimiter="#")');
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(parsed.errors).toEqual([]);
    expect(result).toBe('#3#5#7#9#12#');
  });

  test('surfaces helper validation errors through the domain keyword interface', () => {
    expect(() => runWithSeed(1014, 'string.counterString', [1.2, 3])).toThrow(
      'Invalid argument for min: expected an integer.'
    );
  });
});
