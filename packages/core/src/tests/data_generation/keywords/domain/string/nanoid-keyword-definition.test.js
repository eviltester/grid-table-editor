import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('string.nanoid');

describe('string.nanoid parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('string.nanoid');
    const parsed = parseKeywordInvocation(`string.nanoid(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes string.nanoid(length=5) successfully', () => {
    const parsed = parseKeywordInvocation('string.nanoid(length=5)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid length type before generation', () => {
    expect(validateArgs('length={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be number, not object',
    });
  });

  test('rejects zero length before generation', () => {
    expect(validateArgs('length=0')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects negative length before generation', () => {
    expect(validateArgs('length=-1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be greater than 0',
    });
  });

  test('rejects fractional length before generation', () => {
    expect(validateArgs('length=1.5')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "length" must be an integer',
    });
  });
});
