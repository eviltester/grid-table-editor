import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('word domain keyword execution', () => {
  test('executes word.adjective', () => {
    const result = executeDomainKeyword('word.adjective', { faker, args: [] });
    console.log('word.adjective', result);
    assertDomainKeywordResult('word.adjective', result);
  });

  test('executes word.adverb', () => {
    const result = executeDomainKeyword('word.adverb', { faker, args: [] });
    console.log('word.adverb', result);
    assertDomainKeywordResult('word.adverb', result);
  });

  test('executes word.conjunction', () => {
    const result = executeDomainKeyword('word.conjunction', { faker, args: [] });
    console.log('word.conjunction', result);
    assertDomainKeywordResult('word.conjunction', result);
  });

  test('executes word.interjection', () => {
    const result = executeDomainKeyword('word.interjection', { faker, args: [] });
    console.log('word.interjection', result);
    assertDomainKeywordResult('word.interjection', result);
  });

  test('executes word.noun', () => {
    const result = executeDomainKeyword('word.noun', { faker, args: [] });
    console.log('word.noun', result);
    assertDomainKeywordResult('word.noun', result);
  });

  test('executes word.preposition', () => {
    const result = executeDomainKeyword('word.preposition', { faker, args: [] });
    console.log('word.preposition', result);
    assertDomainKeywordResult('word.preposition', result);
  });

  test('executes word.sample', () => {
    const result = executeDomainKeyword('word.sample', { faker, args: [] });
    console.log('word.sample', result);
    assertDomainKeywordResult('word.sample', result);
  });

  test('executes word.verb', () => {
    const result = executeDomainKeyword('word.verb', { faker, args: [] });
    console.log('word.verb', result);
    assertDomainKeywordResult('word.verb', result);
  });

  test('executes word.words', () => {
    const result = executeDomainKeyword('word.words', { faker, args: [] });
    console.log('word.words', result);
    assertDomainKeywordResult('word.words', result);
  });
});
