import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('book domain keyword execution', () => {
  test('executes book.author', () => {
    const result = executeDomainKeyword('book.author', { faker, args: [] });
    console.log('book.author', result);
    expectMeaningfulString(result);
  });

  test('executes book.format', () => {
    const result = executeDomainKeyword('book.format', { faker, args: [] });
    console.log('book.format', result);
    expectMeaningfulString(result);
  });

  test('executes book.genre', () => {
    const result = executeDomainKeyword('book.genre', { faker, args: [] });
    console.log('book.genre', result);
    expectMeaningfulString(result);
  });

  test('executes book.publisher', () => {
    const result = executeDomainKeyword('book.publisher', { faker, args: [] });
    console.log('book.publisher', result);
    expectMeaningfulString(result);
  });

  test('executes book.series', () => {
    const result = executeDomainKeyword('book.series', { faker, args: [] });
    console.log('book.series', result);
    expectMeaningfulString(result);
  });

  test('executes book.title', () => {
    const result = executeDomainKeyword('book.title', { faker, args: [] });
    console.log('book.title', result);
    expectMeaningfulString(result);
  });
});
