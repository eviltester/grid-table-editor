import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../js/domain/domain-keyword-parser.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('number domain keyword execution', () => {
  test('executes number.bigInt', () => {
    const result = executeDomainKeyword('number.bigInt', { faker, args: [] });
    console.log('number.bigInt', result);
    expect(typeof result).toBe('bigint');
  });

  test('executes number.binary', () => {
    const result = executeDomainKeyword('number.binary', { faker, args: [] });
    console.log('number.binary', result);
    expectMeaningfulString(result);
  });

  test('executes number.float', () => {
    const result = executeDomainKeyword('number.float', { faker, args: [] });
    console.log('number.float', result);
    expect(typeof result).toBe('number');
  });

  test('executes number.hex', () => {
    const result = executeDomainKeyword('number.hex', { faker, args: [] });
    console.log('number.hex', result);
    expectMeaningfulString(result);
  });

  test('executes number.int', () => {
    const result = executeDomainKeyword('number.int', { faker, args: [] });
    console.log('number.int', result);
    expect(typeof result).toBe('number');
  });

  test('number.int respects min/max params with positional arguments', () => {
    const result = executeDomainKeyword('number.int', { faker, args: [10, 20] });
    console.log('number.int positional args [10,20]', result);
    expect(result).toBeGreaterThanOrEqual(10);
    expect(result).toBeLessThanOrEqual(20);
  });

  test('number.int respects min/max params with named arguments', () => {
    const parsed = parseKeywordInvocation('number.int(min=10, max=20)');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    console.log('number.int named args min/max', result);
    expect(result).toBeGreaterThanOrEqual(10);
    expect(result).toBeLessThanOrEqual(20);
  });

  test('number.int respects multipleOf param with positional arguments', () => {
    const result = executeDomainKeyword('number.int', { faker, args: [0, 100, 5] });
    console.log('number.int positional args [0,100,5]', result);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
    expect(result % 5).toBe(0);
  });

  test('number.int respects multipleOf param with named arguments', () => {
    const parsed = parseKeywordInvocation('number.int(multipleOf=5, min=0, max=100)');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });
    console.log('number.int named args multipleOf/min/max', result);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
    expect(result % 5).toBe(0);
  });

  test('executes number.octal', () => {
    const result = executeDomainKeyword('number.octal', { faker, args: [] });
    console.log('number.octal', result);
    expectMeaningfulString(result);
  });

  test('executes number.romanNumeral', () => {
    const result = executeDomainKeyword('number.romanNumeral', { faker, args: [] });
    console.log('number.romanNumeral', result);
    expectMeaningfulString(result);
  });
});
