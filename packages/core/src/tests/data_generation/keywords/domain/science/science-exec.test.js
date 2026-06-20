import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { expectMeaningfulString } from '../../../unit/domain/domain-assertions.test-helper.js';

describe('science domain keyword execution', () => {
  test('executes science.chemicalElement', () => {
    const result = executeDomainKeyword('science.chemicalElement', { faker, args: [] });
    console.log('science.chemicalElement', result);
    expect(result).toEqual(
      expect.objectContaining({
        symbol: expect.any(String),
        name: expect.any(String),
        atomicNumber: expect.any(Number),
      })
    );
  });

  test('executes science.chemicalElement.atomicNumber', () => {
    const result = executeDomainKeyword('science.chemicalElement.atomicNumber', { faker, args: [] });
    console.log('science.chemicalElement.atomicNumber', result);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(118);
  });

  test('executes science.chemicalElement.name', () => {
    const result = executeDomainKeyword('science.chemicalElement.name', { faker, args: [] });
    console.log('science.chemicalElement.name', result);
    expectMeaningfulString(result);
  });

  test('executes science.chemicalElement.symbol', () => {
    const result = executeDomainKeyword('science.chemicalElement.symbol', { faker, args: [] });
    console.log('science.chemicalElement.symbol', result);
    expect(result).toMatch(/^[A-Z][a-z]?$/);
  });

  test('executes science.unit', () => {
    const result = executeDomainKeyword('science.unit', { faker, args: [] });
    console.log('science.unit', result);
    expect(result).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        symbol: expect.any(String),
      })
    );
  });
});
