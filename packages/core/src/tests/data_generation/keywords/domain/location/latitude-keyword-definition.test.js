import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('location.latitude');

describe('location.latitude parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('location.latitude');
    const parsed = parseKeywordInvocation(`location.latitude(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes location.latitude(max=10, min=1) successfully', () => {
    const parsed = parseKeywordInvocation('location.latitude(max=10, min=1)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('number');
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('min={"bad":true}, max=10')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be number, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('min=1, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be number, not object',
    });
  });

  test('rejects invalid precision type before generation', () => {
    expect(validateArgs('min=1, max=10, precision={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "precision" must be number, not object',
    });
  });

  test('rejects min greater than max before generation', () => {
    expect(validateArgs('min=10, max=1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"',
    });
  });
});
