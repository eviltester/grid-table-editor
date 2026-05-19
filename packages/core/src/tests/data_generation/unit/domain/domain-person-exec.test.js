import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from './domain-assertions.test-helper.js';

describe('person domain keyword execution', () => {
  test('executes person.bio', () => {
    const result = executeDomainKeyword('person.bio', { faker, args: [] });
    console.log('person.bio', result);
    expectMeaningfulString(result);
  });

  test('executes person.firstName', () => {
    const result = executeDomainKeyword('person.firstName', { faker, args: [] });
    console.log('person.firstName', result);
    expectMeaningfulString(result);
  });

  test('executes person.fullName', () => {
    const result = executeDomainKeyword('person.fullName', { faker, args: [] });
    console.log('person.fullName', result);
    expectMeaningfulString(result);
  });

  test('executes person.gender', () => {
    const result = executeDomainKeyword('person.gender', { faker, args: [] });
    console.log('person.gender', result);
    expectMeaningfulString(result);
  });

  test('executes person.jobArea', () => {
    const result = executeDomainKeyword('person.jobArea', { faker, args: [] });
    console.log('person.jobArea', result);
    expectMeaningfulString(result);
  });

  test('executes person.jobDescriptor', () => {
    const result = executeDomainKeyword('person.jobDescriptor', { faker, args: [] });
    console.log('person.jobDescriptor', result);
    expectMeaningfulString(result);
  });

  test('executes person.jobTitle', () => {
    const result = executeDomainKeyword('person.jobTitle', { faker, args: [] });
    console.log('person.jobTitle', result);
    expectMeaningfulString(result);
  });

  test('executes person.jobType', () => {
    const result = executeDomainKeyword('person.jobType', { faker, args: [] });
    console.log('person.jobType', result);
    expectMeaningfulString(result);
  });

  test('executes person.lastName', () => {
    const result = executeDomainKeyword('person.lastName', { faker, args: [] });
    console.log('person.lastName', result);
    expectMeaningfulString(result);
  });

  test('executes person.middleName', () => {
    const result = executeDomainKeyword('person.middleName', { faker, args: [] });
    console.log('person.middleName', result);
    expectMeaningfulString(result);
  });

  test('executes person.prefix', () => {
    const result = executeDomainKeyword('person.prefix', { faker, args: [] });
    console.log('person.prefix', result);
    expectMeaningfulString(result);
  });

  test('executes person.sex', () => {
    const result = executeDomainKeyword('person.sex', { faker, args: [] });
    console.log('person.sex', result);
    expectMeaningfulString(result);
  });

  test('executes person.sexType', () => {
    const result = executeDomainKeyword('person.sexType', { faker, args: [] });
    console.log('person.sexType', result);
    expectMeaningfulString(result);
  });

  test('executes person.suffix', () => {
    const result = executeDomainKeyword('person.suffix', { faker, args: [] });
    console.log('person.suffix', result);
    expectMeaningfulString(result);
  });

  test('executes person.zodiacSign', () => {
    const result = executeDomainKeyword('person.zodiacSign', { faker, args: [] });
    console.log('person.zodiacSign', result);
    expectMeaningfulString(result);
  });
});
