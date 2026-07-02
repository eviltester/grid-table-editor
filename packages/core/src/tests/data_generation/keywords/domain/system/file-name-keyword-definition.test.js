import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('system.fileName');

describe('system.fileName parameter validation', () => {
  function validateExtensionCount(extensionCount) {
    const keyword = getDomainKeywordByAlias('system.fileName');
    return validateDomainKeywordArgs(keyword, [extensionCount]);
  }

  test.each([[1], [2]])('accepts positive integer extensionCount %s', (extensionCount) => {
    expect(validateExtensionCount(extensionCount)).toEqual({ ok: true });
  });

  test.each([[0], [-1]])('rejects non-positive extensionCount %s before generation', (extensionCount) => {
    expect(validateExtensionCount(extensionCount)).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extensionCount" must be greater than 0',
    });
  });

  test('rejects fractional extensionCount before generation', () => {
    expect(validateExtensionCount(1.5)).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extensionCount" must be an integer',
    });
  });

  test('executes system.fileName(extensionCount=1) against Faker', () => {
    const parsed = parseKeywordInvocation('system.fileName(extensionCount=1)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result.split('.')).toHaveLength(2);
  });

  test.each([
    [
      'system.fileName(extensionCount=-1)',
      'Invalid keyword arguments: argument "extensionCount" must be greater than 0',
    ],
    [
      'system.fileName(extensionCount=0)',
      'Invalid keyword arguments: argument "extensionCount" must be greater than 0',
    ],
    [
      'system.fileName(extensionCount="-1")',
      'Invalid keyword arguments: argument "extensionCount" must be number, not string',
    ],
    ['system.fileName(extensionCount=1.5)', 'Invalid keyword arguments: argument "extensionCount" must be an integer'],
  ])('throws validation error for invalid named invocation %s', (functionCall, expectedError) => {
    const parsed = parseKeywordInvocation(functionCall);

    expect(parsed.errors).toEqual([]);
    expect(() => executeDomainKeyword(parsed.keyword, { faker: {}, args: parsed.args })).toThrow(expectedError);
  });
});
