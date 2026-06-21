import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('company domain keyword execution', () => {
  test('executes company.buzzAdjective', () => {
    const result = executeDomainKeyword('company.buzzAdjective', { faker, args: [] });
    console.log('company.buzzAdjective', result);
    expectMeaningfulString(result);
  });

  test('executes company.buzzNoun', () => {
    const result = executeDomainKeyword('company.buzzNoun', { faker, args: [] });
    console.log('company.buzzNoun', result);
    expectMeaningfulString(result);
  });

  test('executes company.buzzPhrase', () => {
    const result = executeDomainKeyword('company.buzzPhrase', { faker, args: [] });
    console.log('company.buzzPhrase', result);
    expectMeaningfulString(result);
  });

  test('executes company.buzzVerb', () => {
    const result = executeDomainKeyword('company.buzzVerb', { faker, args: [] });
    console.log('company.buzzVerb', result);
    expectMeaningfulString(result);
  });

  test('executes company.catchPhrase', () => {
    const result = executeDomainKeyword('company.catchPhrase', { faker, args: [] });
    console.log('company.catchPhrase', result);
    expectMeaningfulString(result);
  });

  test('executes company.catchPhraseAdjective', () => {
    const result = executeDomainKeyword('company.catchPhraseAdjective', { faker, args: [] });
    console.log('company.catchPhraseAdjective', result);
    expectMeaningfulString(result);
  });

  test('executes company.catchPhraseDescriptor', () => {
    const result = executeDomainKeyword('company.catchPhraseDescriptor', { faker, args: [] });
    console.log('company.catchPhraseDescriptor', result);
    expectMeaningfulString(result);
  });

  test('executes company.catchPhraseNoun', () => {
    const result = executeDomainKeyword('company.catchPhraseNoun', { faker, args: [] });
    console.log('company.catchPhraseNoun', result);
    expectMeaningfulString(result);
  });

  test('executes company.name', () => {
    const result = executeDomainKeyword('company.name', { faker, args: [] });
    console.log('company.name', result);
    expectMeaningfulString(result);
  });
});
