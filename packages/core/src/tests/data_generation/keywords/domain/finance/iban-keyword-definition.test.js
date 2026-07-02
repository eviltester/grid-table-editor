import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('finance.iban');

describe('finance.iban parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('finance.iban');
    const parsed = parseKeywordInvocation(`finance.iban(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes finance.iban(countryCode="GB") successfully', () => {
    const parsed = parseKeywordInvocation('finance.iban(countryCode="GB")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid countryCode type before generation', () => {
    expect(validateArgs('countryCode={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "countryCode" must be string, not object',
    });
  });

  test('rejects invalid formatted type before generation', () => {
    expect(validateArgs('countryCode="GB", formatted={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "formatted" must be boolean, not object',
    });
  });
});
