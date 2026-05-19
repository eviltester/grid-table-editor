import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('company domain keyword execution', () => {
  test('executes company.buzzAdjective', () => {
    const result = executeDomainKeyword('company.buzzAdjective', { faker, args: [] });
    console.log('company.buzzAdjective', result);
    assertDomainKeywordResult('company.buzzAdjective', result);
  });

  test('executes company.buzzNoun', () => {
    const result = executeDomainKeyword('company.buzzNoun', { faker, args: [] });
    console.log('company.buzzNoun', result);
    assertDomainKeywordResult('company.buzzNoun', result);
  });

  test('executes company.buzzPhrase', () => {
    const result = executeDomainKeyword('company.buzzPhrase', { faker, args: [] });
    console.log('company.buzzPhrase', result);
    assertDomainKeywordResult('company.buzzPhrase', result);
  });

  test('executes company.buzzVerb', () => {
    const result = executeDomainKeyword('company.buzzVerb', { faker, args: [] });
    console.log('company.buzzVerb', result);
    assertDomainKeywordResult('company.buzzVerb', result);
  });

  test('executes company.catchPhrase', () => {
    const result = executeDomainKeyword('company.catchPhrase', { faker, args: [] });
    console.log('company.catchPhrase', result);
    assertDomainKeywordResult('company.catchPhrase', result);
  });

  test('executes company.catchPhraseAdjective', () => {
    const result = executeDomainKeyword('company.catchPhraseAdjective', { faker, args: [] });
    console.log('company.catchPhraseAdjective', result);
    assertDomainKeywordResult('company.catchPhraseAdjective', result);
  });

  test('executes company.catchPhraseDescriptor', () => {
    const result = executeDomainKeyword('company.catchPhraseDescriptor', { faker, args: [] });
    console.log('company.catchPhraseDescriptor', result);
    assertDomainKeywordResult('company.catchPhraseDescriptor', result);
  });

  test('executes company.catchPhraseNoun', () => {
    const result = executeDomainKeyword('company.catchPhraseNoun', { faker, args: [] });
    console.log('company.catchPhraseNoun', result);
    assertDomainKeywordResult('company.catchPhraseNoun', result);
  });

  test('executes company.name', () => {
    const result = executeDomainKeyword('company.name', { faker, args: [] });
    console.log('company.name', result);
    assertDomainKeywordResult('company.name', result);
  });
});
