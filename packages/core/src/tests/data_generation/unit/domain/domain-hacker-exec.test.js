import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('hacker domain keyword execution', () => {
  test('executes hacker.abbreviation', () => {
    const result = executeDomainKeyword('hacker.abbreviation', { faker, args: [] });
    console.log('hacker.abbreviation', result);
    expect(result).not.toBeUndefined();
  });

  test('executes hacker.adjective', () => {
    const result = executeDomainKeyword('hacker.adjective', { faker, args: [] });
    console.log('hacker.adjective', result);
    expect(result).not.toBeUndefined();
  });

  test('executes hacker.ingverb', () => {
    const result = executeDomainKeyword('hacker.ingverb', { faker, args: [] });
    console.log('hacker.ingverb', result);
    expect(result).not.toBeUndefined();
  });

  test('executes hacker.noun', () => {
    const result = executeDomainKeyword('hacker.noun', { faker, args: [] });
    console.log('hacker.noun', result);
    expect(result).not.toBeUndefined();
  });

  test('executes hacker.phrase', () => {
    const result = executeDomainKeyword('hacker.phrase', { faker, args: [] });
    console.log('hacker.phrase', result);
    expect(result).not.toBeUndefined();
  });

  test('executes hacker.verb', () => {
    const result = executeDomainKeyword('hacker.verb', { faker, args: [] });
    console.log('hacker.verb', result);
    expect(result).not.toBeUndefined();
  });
});
