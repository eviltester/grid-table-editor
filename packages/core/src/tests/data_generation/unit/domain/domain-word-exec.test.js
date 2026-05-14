import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('word domain keyword execution', () => {
  test('executes word.adjective', () => {
    const result = executeDomainKeyword('word.adjective', { faker, args: [] });
    console.log('word.adjective', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.adverb', () => {
    const result = executeDomainKeyword('word.adverb', { faker, args: [] });
    console.log('word.adverb', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.conjunction', () => {
    const result = executeDomainKeyword('word.conjunction', { faker, args: [] });
    console.log('word.conjunction', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.interjection', () => {
    const result = executeDomainKeyword('word.interjection', { faker, args: [] });
    console.log('word.interjection', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.noun', () => {
    const result = executeDomainKeyword('word.noun', { faker, args: [] });
    console.log('word.noun', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.preposition', () => {
    const result = executeDomainKeyword('word.preposition', { faker, args: [] });
    console.log('word.preposition', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.sample', () => {
    const result = executeDomainKeyword('word.sample', { faker, args: [] });
    console.log('word.sample', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.verb', () => {
    const result = executeDomainKeyword('word.verb', { faker, args: [] });
    console.log('word.verb', result);
    expect(result).not.toBeUndefined();
  });

  test('executes word.words', () => {
    const result = executeDomainKeyword('word.words', { faker, args: [] });
    console.log('word.words', result);
    expect(result).not.toBeUndefined();
  });
});
