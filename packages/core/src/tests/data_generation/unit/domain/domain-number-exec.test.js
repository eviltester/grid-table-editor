import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('number domain keyword execution', () => {
  test('executes number.bigInt', () => {
    const result = executeDomainKeyword('number.bigInt', { faker, args: [] });
    console.log('number.bigInt', result);
    expect(result).not.toBeUndefined();
  });

  test('executes number.binary', () => {
    const result = executeDomainKeyword('number.binary', { faker, args: [] });
    console.log('number.binary', result);
    expect(result).not.toBeUndefined();
  });

  test('executes number.float', () => {
    const result = executeDomainKeyword('number.float', { faker, args: [] });
    console.log('number.float', result);
    expect(result).not.toBeUndefined();
  });

  test('executes number.hex', () => {
    const result = executeDomainKeyword('number.hex', { faker, args: [] });
    console.log('number.hex', result);
    expect(result).not.toBeUndefined();
  });

  test('executes number.int', () => {
    const result = executeDomainKeyword('number.int', { faker, args: [] });
    console.log('number.int', result);
    expect(result).not.toBeUndefined();
  });

  test('number.int respects min/max params', () => {
    const result = executeDomainKeyword('number.int', { faker, args: [10, 20] });
    console.log('number.int(min=10,max=20)', result);
    expect(result).toBeGreaterThanOrEqual(10);
    expect(result).toBeLessThanOrEqual(20);
  });

  test('number.int respects multipleOf param', () => {
    const result = executeDomainKeyword('number.int', { faker, args: [0, 100, 5] });
    console.log('number.int(max=100,min=0,multipleOf=5)', result);
    expect(result % 5).toBe(0);
  });

  test('executes number.octal', () => {
    const result = executeDomainKeyword('number.octal', { faker, args: [] });
    console.log('number.octal', result);
    expect(result).not.toBeUndefined();
  });

  test('executes number.romanNumeral', () => {
    const result = executeDomainKeyword('number.romanNumeral', { faker, args: [] });
    console.log('number.romanNumeral', result);
    expect(result).not.toBeUndefined();
  });
});
