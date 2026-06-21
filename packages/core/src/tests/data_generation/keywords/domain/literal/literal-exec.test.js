import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

describe('literal domain keyword execution', () => {
  test('executes literal.value with provided value', () => {
    const result = executeDomainKeyword('literal.value', { args: [1] });
    expect(result).toBe(1);
  });

  test('defaults literal.value to empty string when value is omitted', () => {
    const result = executeDomainKeyword('literal.value', { args: [] });
    expect(result).toBe('');
  });

  test('executes literal.value with named string argument and preserves string type', () => {
    const parsed = parseKeywordInvocation('literal.value(value="Pending")');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args });
    expect(result).toBe('Pending');
    expect(typeof result).toBe('string');
  });

  test('executes literal.value with named boolean argument and preserves boolean type', () => {
    const parsed = parseKeywordInvocation('literal.value(value=true)');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args });
    expect(result).toBe(true);
    expect(typeof result).toBe('boolean');
  });

  test('executes literal.value with named number argument and preserves number type', () => {
    const parsed = parseKeywordInvocation('literal.value(value=42)');
    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args });
    expect(result).toBe(42);
    expect(typeof result).toBe('number');
  });
});
