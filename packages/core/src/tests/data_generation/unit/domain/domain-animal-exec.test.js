import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('animal domain keyword execution', () => {
  test('executes animal.bear', () => {
    const result = executeDomainKeyword('animal.bear', { faker, args: [] });
    console.log('animal.bear', result);
    assertDomainKeywordResult('animal.bear', result);
  });

  test('executes animal.bird', () => {
    const result = executeDomainKeyword('animal.bird', { faker, args: [] });
    console.log('animal.bird', result);
    assertDomainKeywordResult('animal.bird', result);
  });

  test('executes animal.cat', () => {
    const result = executeDomainKeyword('animal.cat', { faker, args: [] });
    console.log('animal.cat', result);
    assertDomainKeywordResult('animal.cat', result);
  });

  test('executes animal.cetacean', () => {
    const result = executeDomainKeyword('animal.cetacean', { faker, args: [] });
    console.log('animal.cetacean', result);
    assertDomainKeywordResult('animal.cetacean', result);
  });

  test('executes animal.cow', () => {
    const result = executeDomainKeyword('animal.cow', { faker, args: [] });
    console.log('animal.cow', result);
    assertDomainKeywordResult('animal.cow', result);
  });

  test('executes animal.crocodilia', () => {
    const result = executeDomainKeyword('animal.crocodilia', { faker, args: [] });
    console.log('animal.crocodilia', result);
    assertDomainKeywordResult('animal.crocodilia', result);
  });

  test('executes animal.dog', () => {
    const result = executeDomainKeyword('animal.dog', { faker, args: [] });
    console.log('animal.dog', result);
    assertDomainKeywordResult('animal.dog', result);
  });

  test('executes animal.fish', () => {
    const result = executeDomainKeyword('animal.fish', { faker, args: [] });
    console.log('animal.fish', result);
    assertDomainKeywordResult('animal.fish', result);
  });

  test('executes animal.horse', () => {
    const result = executeDomainKeyword('animal.horse', { faker, args: [] });
    console.log('animal.horse', result);
    assertDomainKeywordResult('animal.horse', result);
  });

  test('executes animal.insect', () => {
    const result = executeDomainKeyword('animal.insect', { faker, args: [] });
    console.log('animal.insect', result);
    assertDomainKeywordResult('animal.insect', result);
  });

  test('executes animal.lion', () => {
    const result = executeDomainKeyword('animal.lion', { faker, args: [] });
    console.log('animal.lion', result);
    assertDomainKeywordResult('animal.lion', result);
  });

  test('executes animal.petName', () => {
    const result = executeDomainKeyword('animal.petName', { faker, args: [] });
    console.log('animal.petName', result);
    assertDomainKeywordResult('animal.petName', result);
  });

  test('executes animal.rabbit', () => {
    const result = executeDomainKeyword('animal.rabbit', { faker, args: [] });
    console.log('animal.rabbit', result);
    assertDomainKeywordResult('animal.rabbit', result);
  });

  test('executes animal.rodent', () => {
    const result = executeDomainKeyword('animal.rodent', { faker, args: [] });
    console.log('animal.rodent', result);
    assertDomainKeywordResult('animal.rodent', result);
  });

  test('executes animal.snake', () => {
    const result = executeDomainKeyword('animal.snake', { faker, args: [] });
    console.log('animal.snake', result);
    assertDomainKeywordResult('animal.snake', result);
  });

  test('executes animal.type', () => {
    const result = executeDomainKeyword('animal.type', { faker, args: [] });
    console.log('animal.type', result);
    assertDomainKeywordResult('animal.type', result);
  });
});
