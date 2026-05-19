import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('food domain keyword execution', () => {
  test('executes food.adjective', () => {
    const result = executeDomainKeyword('food.adjective', { faker, args: [] });
    console.log('food.adjective', result);
    assertDomainKeywordResult('food.adjective', result);
  });

  test('executes food.description', () => {
    const result = executeDomainKeyword('food.description', { faker, args: [] });
    console.log('food.description', result);
    assertDomainKeywordResult('food.description', result);
  });

  test('executes food.dish', () => {
    const result = executeDomainKeyword('food.dish', { faker, args: [] });
    console.log('food.dish', result);
    assertDomainKeywordResult('food.dish', result);
  });

  test('executes food.ethnicCategory', () => {
    const result = executeDomainKeyword('food.ethnicCategory', { faker, args: [] });
    console.log('food.ethnicCategory', result);
    assertDomainKeywordResult('food.ethnicCategory', result);
  });

  test('executes food.fruit', () => {
    const result = executeDomainKeyword('food.fruit', { faker, args: [] });
    console.log('food.fruit', result);
    assertDomainKeywordResult('food.fruit', result);
  });

  test('executes food.ingredient', () => {
    const result = executeDomainKeyword('food.ingredient', { faker, args: [] });
    console.log('food.ingredient', result);
    assertDomainKeywordResult('food.ingredient', result);
  });

  test('executes food.meat', () => {
    const result = executeDomainKeyword('food.meat', { faker, args: [] });
    console.log('food.meat', result);
    assertDomainKeywordResult('food.meat', result);
  });

  test('executes food.spice', () => {
    const result = executeDomainKeyword('food.spice', { faker, args: [] });
    console.log('food.spice', result);
    assertDomainKeywordResult('food.spice', result);
  });

  test('executes food.vegetable', () => {
    const result = executeDomainKeyword('food.vegetable', { faker, args: [] });
    console.log('food.vegetable', result);
    assertDomainKeywordResult('food.vegetable', result);
  });
});
