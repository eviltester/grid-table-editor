import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('food domain keyword execution', () => {
  test('executes food.adjective', () => {
    const result = executeDomainKeyword('food.adjective', { faker, args: [] });
    console.log('food.adjective', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.description', () => {
    const result = executeDomainKeyword('food.description', { faker, args: [] });
    console.log('food.description', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.dish', () => {
    const result = executeDomainKeyword('food.dish', { faker, args: [] });
    console.log('food.dish', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.ethnicCategory', () => {
    const result = executeDomainKeyword('food.ethnicCategory', { faker, args: [] });
    console.log('food.ethnicCategory', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.fruit', () => {
    const result = executeDomainKeyword('food.fruit', { faker, args: [] });
    console.log('food.fruit', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.ingredient', () => {
    const result = executeDomainKeyword('food.ingredient', { faker, args: [] });
    console.log('food.ingredient', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.meat', () => {
    const result = executeDomainKeyword('food.meat', { faker, args: [] });
    console.log('food.meat', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.spice', () => {
    const result = executeDomainKeyword('food.spice', { faker, args: [] });
    console.log('food.spice', result);
    expect(result).not.toBeUndefined();
  });

  test('executes food.vegetable', () => {
    const result = executeDomainKeyword('food.vegetable', { faker, args: [] });
    console.log('food.vegetable', result);
    expect(result).not.toBeUndefined();
  });
});
