import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('animal domain keyword execution', () => {
  test('executes animal.bear', () => {
    const result = executeDomainKeyword('animal.bear', { faker, args: [] });
    console.log('animal.bear', result);
    expectMeaningfulString(result);
  });

  test('executes animal.bird', () => {
    const result = executeDomainKeyword('animal.bird', { faker, args: [] });
    console.log('animal.bird', result);
    expectMeaningfulString(result);
  });

  test('executes animal.cat', () => {
    const result = executeDomainKeyword('animal.cat', { faker, args: [] });
    console.log('animal.cat', result);
    expectMeaningfulString(result);
  });

  test('executes animal.cetacean', () => {
    const result = executeDomainKeyword('animal.cetacean', { faker, args: [] });
    console.log('animal.cetacean', result);
    expectMeaningfulString(result);
  });

  test('executes animal.cow', () => {
    const result = executeDomainKeyword('animal.cow', { faker, args: [] });
    console.log('animal.cow', result);
    expectMeaningfulString(result);
  });

  test('executes animal.crocodilia', () => {
    const result = executeDomainKeyword('animal.crocodilia', { faker, args: [] });
    console.log('animal.crocodilia', result);
    expectMeaningfulString(result);
  });

  test('executes animal.dog', () => {
    const result = executeDomainKeyword('animal.dog', { faker, args: [] });
    console.log('animal.dog', result);
    expectMeaningfulString(result);
  });

  test('executes animal.fish', () => {
    const result = executeDomainKeyword('animal.fish', { faker, args: [] });
    console.log('animal.fish', result);
    expectMeaningfulString(result);
  });

  test('executes animal.horse', () => {
    const result = executeDomainKeyword('animal.horse', { faker, args: [] });
    console.log('animal.horse', result);
    expectMeaningfulString(result);
  });

  test('executes animal.insect', () => {
    const result = executeDomainKeyword('animal.insect', { faker, args: [] });
    console.log('animal.insect', result);
    expectMeaningfulString(result);
  });

  test('executes animal.lion', () => {
    const result = executeDomainKeyword('animal.lion', { faker, args: [] });
    console.log('animal.lion', result);
    expectMeaningfulString(result);
  });

  test('executes animal.petName', () => {
    const result = executeDomainKeyword('animal.petName', { faker, args: [] });
    console.log('animal.petName', result);
    expectMeaningfulString(result);
  });

  test('executes animal.rabbit', () => {
    const result = executeDomainKeyword('animal.rabbit', { faker, args: [] });
    console.log('animal.rabbit', result);
    expectMeaningfulString(result);
  });

  test('executes animal.rodent', () => {
    const result = executeDomainKeyword('animal.rodent', { faker, args: [] });
    console.log('animal.rodent', result);
    expectMeaningfulString(result);
  });

  test('executes animal.snake', () => {
    const result = executeDomainKeyword('animal.snake', { faker, args: [] });
    console.log('animal.snake', result);
    expectMeaningfulString(result);
  });

  test('executes animal.type', () => {
    const result = executeDomainKeyword('animal.type', { faker, args: [] });
    console.log('animal.type', result);
    expectMeaningfulString(result);
  });
});
