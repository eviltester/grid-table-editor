import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';

function runWithSeed(seed, keyword, args) {
  faker.seed(seed);
  return executeDomainKeyword(keyword, { faker, args });
}

describe('string.counterString domain keyword execution', () => {
  test('executes string.counterString', () => {
    const result = runWithSeed(1000, 'string.counterString', [15]);
    expect(result).toBe('*3*5*7*9*12*15*');
  });

  test('string.counterString supports min/max range', () => {
    const ranged = runWithSeed(1005, 'string.counterString', [5, 9]);
    expect(ranged.length).toBeGreaterThanOrEqual(5);
    expect(ranged.length).toBeLessThanOrEqual(9);
    expect(ranged).toContain('*');
  });

  test('string.counterString clamps minimum length to 1', () => {
    const clamped = runWithSeed(1006, 'string.counterString', [0, 3]);
    expect(clamped.length).toBeGreaterThanOrEqual(1);
    expect(clamped.length).toBeLessThanOrEqual(3);
  });

  test('string.counterString accepts reversed min/max arguments', () => {
    const reordered = runWithSeed(1007, 'string.counterString', [9, 5]);
    expect(reordered.length).toBeGreaterThanOrEqual(5);
    expect(reordered.length).toBeLessThanOrEqual(9);
  });

  test('string.counterString supports custom delimiter', () => {
    const delimiter = runWithSeed(1008, 'string.counterString', [12, 12, '#']);
    expect(delimiter).toBe('#3#5#7#9#12#');
  });

  test('string.counterString uses first character when delimiter has length > 1', () => {
    const result = runWithSeed(1009, 'string.counterString', [12, 12, 'XYZ']);
    expect(result).toBe('X3X5X7X9X12X');
  });

  test('string.counterString supports named min and max parameters', () => {
    faker.seed(1010);
    const parsed = parseKeywordInvocation('string.counterString(min=5, max=9)');
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.length).toBeLessThanOrEqual(9);
  });

  test('string.counterString supports named delimiter parameter', () => {
    faker.seed(1011);
    const parsed = parseKeywordInvocation('string.counterString(min=12, max=12, delimiter="#")');
    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    expect(result).toBe('#3#5#7#9#12#');
  });

  test('string.counterString rejects non-integer min argument', () => {
    expect(() => runWithSeed(1014, 'string.counterString', [1.2, 3])).toThrow(
      'Invalid argument for min: expected an integer.'
    );
  });

  test('string.counterString rejects non-integer max argument', () => {
    expect(() => runWithSeed(1015, 'string.counterString', [2, 3.4])).toThrow(
      'Invalid argument for max: expected an integer.'
    );
  });
});
