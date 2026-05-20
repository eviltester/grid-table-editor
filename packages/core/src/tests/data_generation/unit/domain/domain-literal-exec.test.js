import { executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';

describe('literal domain keyword execution', () => {
  test('executes literal.value with provided value', () => {
    const result = executeDomainKeyword('literal.value', { args: [1] });
    expect(result).toBe(1);
  });

  test('defaults literal.value to empty string when value is omitted', () => {
    const result = executeDomainKeyword('literal.value', { args: [] });
    expect(result).toBe('');
  });
});
