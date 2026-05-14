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
