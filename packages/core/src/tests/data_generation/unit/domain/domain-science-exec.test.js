import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('science domain keyword execution', () => {
  test('executes science.chemicalElement', () => {
    const result = executeDomainKeyword('science.chemicalElement', { faker, args: [] });
    console.log('science.chemicalElement', result);
    expect(result).not.toBeUndefined();
  });

  test('executes science.chemicalElement.atomicNumber', () => {
    const result = executeDomainKeyword('science.chemicalElement.atomicNumber', { faker, args: [] });
    console.log('science.chemicalElement.atomicNumber', result);
    expect(result).not.toBeUndefined();
  });

  test('executes science.chemicalElement.name', () => {
    const result = executeDomainKeyword('science.chemicalElement.name', { faker, args: [] });
    console.log('science.chemicalElement.name', result);
    expect(result).not.toBeUndefined();
  });

  test('executes science.chemicalElement.symbol', () => {
    const result = executeDomainKeyword('science.chemicalElement.symbol', { faker, args: [] });
    console.log('science.chemicalElement.symbol', result);
    expect(result).not.toBeUndefined();
  });

  test('executes science.unit', () => {
    const result = executeDomainKeyword('science.unit', { faker, args: [] });
    console.log('science.unit', result);
    expect(result).not.toBeUndefined();
  });
});
