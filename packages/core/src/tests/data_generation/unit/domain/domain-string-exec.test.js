import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('string domain keyword execution', () => {
  test('executes string.alpha', () => {
    const result = executeDomainKeyword('string.alpha', { faker, args: [] });
    console.log('string.alpha', result);
    assertDomainKeywordResult('string.alpha', result);
  });

  test('string.alpha respects length param', () => {
    const result = executeDomainKeyword('string.alpha', { faker, args: [8] });
    console.log('string.alpha(length=8)', result);
    expect(result).toHaveLength(8);
  });

  test('executes string.alphanumeric', () => {
    const result = executeDomainKeyword('string.alphanumeric', { faker, args: [] });
    console.log('string.alpha', result);
    assertDomainKeywordResult('string.alpha', result);
  });

  test('executes string.binary', () => {
    const result = executeDomainKeyword('string.binary', { faker, args: [] });
    console.log('string.binary', result);
    assertDomainKeywordResult('string.binary', result);
  });

  test('executes string.fromCharacters', () => {
    const result = executeDomainKeyword('string.fromCharacters', { faker, args: [['a']] });
    console.log('string.fromCharacters', result);
    assertDomainKeywordResult('string.fromCharacters', result);
  });

  test('executes string.hexadecimal', () => {
    const result = executeDomainKeyword('string.hexadecimal', { faker, args: [] });
    console.log('string.hexadecimal', result);
    assertDomainKeywordResult('string.hexadecimal', result);
  });

  test('executes string.nanoid', () => {
    const result = executeDomainKeyword('string.nanoid', { faker, args: [] });
    console.log('string.nanoid', result);
    assertDomainKeywordResult('string.nanoid', result);
  });

  test('executes string.numeric', () => {
    const result = executeDomainKeyword('string.numeric', { faker, args: [] });
    console.log('string.numeric', result);
    assertDomainKeywordResult('string.numeric', result);
  });

  test('string.numeric respects length param', () => {
    const result = executeDomainKeyword('string.numeric', { faker, args: [6] });
    console.log('string.numeric(length=6)', result);
    expect(result).toMatch(/^\d+$/);
    expect(result).toHaveLength(6);
  });

  test('executes string.octal', () => {
    const result = executeDomainKeyword('string.octal', { faker, args: [] });
    console.log('string.numeric', result);
    assertDomainKeywordResult('string.numeric', result);
  });

  test('executes string.sample', () => {
    const result = executeDomainKeyword('string.sample', { faker, args: [] });
    console.log('string.sample', result);
    assertDomainKeywordResult('string.sample', result);
  });

  test('executes string.symbol', () => {
    const result = executeDomainKeyword('string.symbol', { faker, args: [] });
    console.log('string.symbol', result);
    assertDomainKeywordResult('string.symbol', result);
  });

  test('executes string.ulid', () => {
    const result = executeDomainKeyword('string.ulid', { faker, args: [] });
    console.log('string.ulid', result);
    assertDomainKeywordResult('string.ulid', result);
  });

  test('executes string.uuid', () => {
    const result = executeDomainKeyword('string.uuid', { faker, args: [] });
    console.log('string.uuid', result);
    assertDomainKeywordResult('string.uuid', result);
  });
});
