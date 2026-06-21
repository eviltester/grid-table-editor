import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('word domain keyword execution', () => {
  test('executes word.adjective', () => {
    const result = executeDomainKeyword('word.adjective', { faker, args: [] });
    console.log('word.adjective', result);
    expectMeaningfulString(result);
  });

  test('executes word.adverb', () => {
    const result = executeDomainKeyword('word.adverb', { faker, args: [] });
    console.log('word.adverb', result);
    expectMeaningfulString(result);
  });

  test('executes word.conjunction', () => {
    const result = executeDomainKeyword('word.conjunction', { faker, args: [] });
    console.log('word.conjunction', result);
    expectMeaningfulString(result);
  });

  test('executes word.interjection', () => {
    const result = executeDomainKeyword('word.interjection', { faker, args: [] });
    console.log('word.interjection', result);
    expectMeaningfulString(result);
  });

  test('executes word.noun', () => {
    const result = executeDomainKeyword('word.noun', { faker, args: [] });
    console.log('word.noun', result);
    expectMeaningfulString(result);
  });

  test('executes word.preposition', () => {
    const result = executeDomainKeyword('word.preposition', { faker, args: [] });
    console.log('word.preposition', result);
    expectMeaningfulString(result);
  });

  test('executes word.sample', () => {
    const result = executeDomainKeyword('word.sample', { faker, args: [] });
    console.log('word.sample', result);
    expectMeaningfulString(result);
  });

  test('executes word.verb', () => {
    const result = executeDomainKeyword('word.verb', { faker, args: [] });
    console.log('word.verb', result);
    expectMeaningfulString(result);
  });

  test('executes word.words', () => {
    const result = executeDomainKeyword('word.words', { faker, args: [] });
    console.log('word.words', result);
    expectMeaningfulString(result);
  });
});
