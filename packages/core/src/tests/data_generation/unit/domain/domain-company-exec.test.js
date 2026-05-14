import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('company domain keyword execution', () => {
  test('executes company.buzzAdjective', () => {
    const result = executeDomainKeyword('company.buzzAdjective', { faker, args: [] });
    console.log('company.buzzAdjective', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.buzzNoun', () => {
    const result = executeDomainKeyword('company.buzzNoun', { faker, args: [] });
    console.log('company.buzzNoun', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.buzzPhrase', () => {
    const result = executeDomainKeyword('company.buzzPhrase', { faker, args: [] });
    console.log('company.buzzPhrase', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.buzzVerb', () => {
    const result = executeDomainKeyword('company.buzzVerb', { faker, args: [] });
    console.log('company.buzzVerb', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.catchPhrase', () => {
    const result = executeDomainKeyword('company.catchPhrase', { faker, args: [] });
    console.log('company.catchPhrase', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.catchPhraseAdjective', () => {
    const result = executeDomainKeyword('company.catchPhraseAdjective', { faker, args: [] });
    console.log('company.catchPhraseAdjective', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.catchPhraseDescriptor', () => {
    const result = executeDomainKeyword('company.catchPhraseDescriptor', { faker, args: [] });
    console.log('company.catchPhraseDescriptor', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.catchPhraseNoun', () => {
    const result = executeDomainKeyword('company.catchPhraseNoun', { faker, args: [] });
    console.log('company.catchPhraseNoun', result);
    expect(result).not.toBeUndefined();
  });

  test('executes company.name', () => {
    const result = executeDomainKeyword('company.name', { faker, args: [] });
    console.log('company.name', result);
    expect(result).not.toBeUndefined();
  });
});
