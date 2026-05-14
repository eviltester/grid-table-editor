import { faker } from '@faker-js/faker';
import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('science domain keyword execution', () => {
  test('executes science.chemicalElement', () => {
    const result = executeDomainKeyword('science.chemicalElement', { faker, args: [] });
    console.log('science.chemicalElement', result);
    expect(result).not.toBeUndefined();
  });

  test('executes science.unit', () => {
    const result = executeDomainKeyword('science.unit', { faker, args: [] });
    console.log('science.unit', result);
    expect(result).not.toBeUndefined();
  });
});
