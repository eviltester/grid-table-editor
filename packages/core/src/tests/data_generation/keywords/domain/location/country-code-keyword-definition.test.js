import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('location.countryCode');

describe('location.countryCode parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('location.countryCode');
    const parsed = parseKeywordInvocation(`location.countryCode(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes location.countryCode(variant="alpha-3") successfully', () => {
    const parsed = parseKeywordInvocation('location.countryCode(variant="alpha-3")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid variant type before generation', () => {
    expect(validateArgs('variant={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "variant" must be alpha-2, alpha-3 or numeric, not object',
    });
  });
});
