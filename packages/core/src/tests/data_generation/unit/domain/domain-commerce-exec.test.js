import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('commerce domain keyword execution', () => {
  test('executes commerce.department', () => {
    const result = executeDomainKeyword('commerce.department', { faker, args: [] });
    console.log('commerce.department', result);
    expect(result).not.toBeUndefined();
  });

  test('executes commerce.isbn', () => {
    const result = executeDomainKeyword('commerce.isbn', { faker, args: [] });
    console.log('commerce.isbn', result);
    expect(result).not.toBeUndefined();
  });

  test('executes commerce.price', () => {
    const result = executeDomainKeyword('commerce.price', { faker, args: [] });
    console.log('commerce.price', result);
    expect(result).not.toBeUndefined();
  });

  test('commerce.price respects dec param', () => {
    const result = executeDomainKeyword('commerce.price', { faker, args: [2] });
    console.log('commerce.price(dec=2)', result);
    const numeric = Number.parseFloat(result);
    expect(Number.isNaN(numeric)).toBe(false);
    const fraction = String(result).split('.')[1] || '';
    expect(fraction.length).toBeLessThanOrEqual(2);
  });

  test('executes commerce.product', () => {
    const result = executeDomainKeyword('commerce.product', { faker, args: [] });
    console.log('commerce.product', result);
    expect(result).not.toBeUndefined();
  });

  test('executes commerce.productAdjective', () => {
    const result = executeDomainKeyword('commerce.productAdjective', { faker, args: [] });
    console.log('commerce.productAdjective', result);
    expect(result).not.toBeUndefined();
  });

  test('executes commerce.productDescription', () => {
    const result = executeDomainKeyword('commerce.productDescription', { faker, args: [] });
    console.log('commerce.productDescription', result);
    expect(result).not.toBeUndefined();
  });

  test('executes commerce.productMaterial', () => {
    const result = executeDomainKeyword('commerce.productMaterial', { faker, args: [] });
    console.log('commerce.productMaterial', result);
    expect(result).not.toBeUndefined();
  });

  test('executes commerce.productName', () => {
    const result = executeDomainKeyword('commerce.productName', { faker, args: [] });
    console.log('commerce.productName', result);
    expect(result).not.toBeUndefined();
  });
});
