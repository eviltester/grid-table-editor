import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('person domain keyword execution', () => {
  test('executes person.bio', () => {
    const result = executeDomainKeyword('person.bio', { faker, args: [] });
    console.log('person.bio', result);
    assertDomainKeywordResult('person.bio', result);
  });

  test('executes person.firstName', () => {
    const result = executeDomainKeyword('person.firstName', { faker, args: [] });
    console.log('person.firstName', result);
    assertDomainKeywordResult('person.firstName', result);
  });

  test('executes person.fullName', () => {
    const result = executeDomainKeyword('person.fullName', { faker, args: [] });
    console.log('person.fullName', result);
    assertDomainKeywordResult('person.fullName', result);
  });

  test('executes person.gender', () => {
    const result = executeDomainKeyword('person.gender', { faker, args: [] });
    console.log('person.gender', result);
    assertDomainKeywordResult('person.gender', result);
  });

  test('executes person.jobArea', () => {
    const result = executeDomainKeyword('person.jobArea', { faker, args: [] });
    console.log('person.jobArea', result);
    assertDomainKeywordResult('person.jobArea', result);
  });

  test('executes person.jobDescriptor', () => {
    const result = executeDomainKeyword('person.jobDescriptor', { faker, args: [] });
    console.log('person.jobDescriptor', result);
    assertDomainKeywordResult('person.jobDescriptor', result);
  });

  test('executes person.jobTitle', () => {
    const result = executeDomainKeyword('person.jobTitle', { faker, args: [] });
    console.log('person.jobTitle', result);
    assertDomainKeywordResult('person.jobTitle', result);
  });

  test('executes person.jobType', () => {
    const result = executeDomainKeyword('person.jobType', { faker, args: [] });
    console.log('person.jobType', result);
    assertDomainKeywordResult('person.jobType', result);
  });

  test('executes person.lastName', () => {
    const result = executeDomainKeyword('person.lastName', { faker, args: [] });
    console.log('person.lastName', result);
    assertDomainKeywordResult('person.lastName', result);
  });

  test('executes person.middleName', () => {
    const result = executeDomainKeyword('person.middleName', { faker, args: [] });
    console.log('person.middleName', result);
    assertDomainKeywordResult('person.middleName', result);
  });

  test('executes person.prefix', () => {
    const result = executeDomainKeyword('person.prefix', { faker, args: [] });
    console.log('person.prefix', result);
    assertDomainKeywordResult('person.prefix', result);
  });

  test('executes person.sex', () => {
    const result = executeDomainKeyword('person.sex', { faker, args: [] });
    console.log('person.sex', result);
    assertDomainKeywordResult('person.sex', result);
  });

  test('executes person.sexType', () => {
    const result = executeDomainKeyword('person.sexType', { faker, args: [] });
    console.log('person.sexType', result);
    assertDomainKeywordResult('person.sexType', result);
  });

  test('executes person.suffix', () => {
    const result = executeDomainKeyword('person.suffix', { faker, args: [] });
    console.log('person.suffix', result);
    assertDomainKeywordResult('person.suffix', result);
  });

  test('executes person.zodiacSign', () => {
    const result = executeDomainKeyword('person.zodiacSign', { faker, args: [] });
    console.log('person.zodiacSign', result);
    assertDomainKeywordResult('person.zodiacSign', result);
  });
});
