import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('hacker domain keyword execution', () => {
  test('executes hacker.abbreviation', () => {
    const result = executeDomainKeyword('hacker.abbreviation', { faker, args: [] });
    console.log('hacker.abbreviation', result);
    assertDomainKeywordResult('hacker.abbreviation', result);
  });

  test('executes hacker.adjective', () => {
    const result = executeDomainKeyword('hacker.adjective', { faker, args: [] });
    console.log('hacker.adjective', result);
    assertDomainKeywordResult('hacker.adjective', result);
  });

  test('executes hacker.ingverb', () => {
    const result = executeDomainKeyword('hacker.ingverb', { faker, args: [] });
    console.log('hacker.ingverb', result);
    assertDomainKeywordResult('hacker.ingverb', result);
  });

  test('executes hacker.noun', () => {
    const result = executeDomainKeyword('hacker.noun', { faker, args: [] });
    console.log('hacker.noun', result);
    assertDomainKeywordResult('hacker.noun', result);
  });

  test('executes hacker.phrase', () => {
    const result = executeDomainKeyword('hacker.phrase', { faker, args: [] });
    console.log('hacker.phrase', result);
    assertDomainKeywordResult('hacker.phrase', result);
  });

  test('executes hacker.verb', () => {
    const result = executeDomainKeyword('hacker.verb', { faker, args: [] });
    console.log('hacker.verb', result);
    assertDomainKeywordResult('hacker.verb', result);
  });
});
