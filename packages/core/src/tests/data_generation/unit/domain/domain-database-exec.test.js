import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('database domain keyword execution', () => {
  test('executes database.collation', () => {
    const result = executeDomainKeyword('database.collation', { faker, args: [] });
    console.log('database.collation', result);
    expectMeaningfulString(result);
  });

  test('executes database.column', () => {
    const result = executeDomainKeyword('database.column', { faker, args: [] });
    console.log('database.column', result);
    expectMeaningfulString(result);
  });

  test('executes database.engine', () => {
    const result = executeDomainKeyword('database.engine', { faker, args: [] });
    console.log('database.engine', result);
    expectMeaningfulString(result);
  });

  test('executes database.mongodbObjectId', () => {
    const result = executeDomainKeyword('database.mongodbObjectId', { faker, args: [] });
    console.log('database.mongodbObjectId', result);
    expectMeaningfulString(result);
  });

  test('executes database.type', () => {
    const result = executeDomainKeyword('database.type', { faker, args: [] });
    console.log('database.type', result);
    expectMeaningfulString(result);
  });
});
