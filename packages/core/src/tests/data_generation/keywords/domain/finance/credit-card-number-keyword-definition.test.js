import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('finance.creditCardNumber');

describe('finance.creditCardNumber parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('finance.creditCardNumber');
    const parsed = parseKeywordInvocation(`finance.creditCardNumber(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes finance.creditCardNumber(issuer="Visa") successfully', () => {
    const parsed = parseKeywordInvocation('finance.creditCardNumber(issuer="Visa")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid issuer type before generation', () => {
    expect(validateArgs('issuer={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "issuer" must be string, not object',
    });
  });
});
