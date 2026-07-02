import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('commerce.price');

describe('commerce.price parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('commerce.price');
    const parsed = parseKeywordInvocation(`commerce.price(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes commerce.price(dec=2, max=10, min=1, symbol="$") successfully', () => {
    const parsed = parseKeywordInvocation('commerce.price(dec=2, max=10, min=1, symbol="$")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid dec type before generation', () => {
    expect(validateArgs('dec={"bad":true}, max=10, min=1, symbol="$"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "dec" must be integer, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('dec=2, max={"bad":true}, min=1, symbol="$"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be number, not object',
    });
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('dec=2, max=10, min={"bad":true}, symbol="$"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be number, not object',
    });
  });

  test('rejects invalid symbol type before generation', () => {
    expect(validateArgs('dec=2, max=10, min=1, symbol={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "symbol" must be string, not object',
    });
  });
});
