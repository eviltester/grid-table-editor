import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('lorem domain keyword execution', () => {
  test('executes lorem.lines', () => {
    const result = executeDomainKeyword('lorem.lines', { faker, args: [] });
    console.log('lorem.lines', result);
    assertDomainKeywordResult('lorem.lines', result);
  });

  test('executes lorem.paragraph', () => {
    const result = executeDomainKeyword('lorem.paragraph', { faker, args: [] });
    console.log('lorem.paragraph', result);
    assertDomainKeywordResult('lorem.paragraph', result);
  });

  test('executes lorem.paragraphs', () => {
    const result = executeDomainKeyword('lorem.paragraphs', { faker, args: [] });
    console.log('lorem.paragraphs', result);
    assertDomainKeywordResult('lorem.paragraphs', result);
  });

  test('executes lorem.sentence', () => {
    const result = executeDomainKeyword('lorem.sentence', { faker, args: [] });
    console.log('lorem.sentence', result);
    assertDomainKeywordResult('lorem.sentence', result);
  });

  test('executes lorem.sentences', () => {
    const result = executeDomainKeyword('lorem.sentences', { faker, args: [] });
    console.log('lorem.sentences', result);
    assertDomainKeywordResult('lorem.sentences', result);
  });

  test('executes lorem.slug', () => {
    const result = executeDomainKeyword('lorem.slug', { faker, args: [] });
    console.log('lorem.slug', result);
    assertDomainKeywordResult('lorem.slug', result);
  });

  test('executes lorem.text', () => {
    const result = executeDomainKeyword('lorem.text', { faker, args: [] });
    console.log('lorem.text', result);
    assertDomainKeywordResult('lorem.text', result);
  });

  test('executes lorem.word', () => {
    const result = executeDomainKeyword('lorem.word', { faker, args: [] });
    console.log('lorem.word', result);
    assertDomainKeywordResult('lorem.word', result);
  });

  test('executes lorem.words', () => {
    const result = executeDomainKeyword('lorem.words', { faker, args: [] });
    console.log('lorem.words', result);
    assertDomainKeywordResult('lorem.words', result);
  });
});
