import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';

describe('science domain keyword execution', () => {
  test('executes science.chemicalElement', () => {
    const result = executeDomainKeyword('science.chemicalElement', { faker, args: [] });
    console.log('science.chemicalElement', result);
    assertDomainKeywordResult('science.chemicalElement', result);
  });

  test('executes science.chemicalElement.atomicNumber', () => {
    const result = executeDomainKeyword('science.chemicalElement.atomicNumber', { faker, args: [] });
    console.log('science.chemicalElement.atomicNumber', result);
    assertDomainKeywordResult('science.chemicalElement.atomicNumber', result);
  });

  test('executes science.chemicalElement.name', () => {
    const result = executeDomainKeyword('science.chemicalElement.name', { faker, args: [] });
    console.log('science.chemicalElement.name', result);
    assertDomainKeywordResult('science.chemicalElement.name', result);
  });

  test('executes science.chemicalElement.symbol', () => {
    const result = executeDomainKeyword('science.chemicalElement.symbol', { faker, args: [] });
    console.log('science.chemicalElement.symbol', result);
    assertDomainKeywordResult('science.chemicalElement.symbol', result);
  });

  test('executes science.unit', () => {
    const result = executeDomainKeyword('science.unit', { faker, args: [] });
    console.log('science.unit', result);
    assertDomainKeywordResult('science.unit', result);
  });
});
