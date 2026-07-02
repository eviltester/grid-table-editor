import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('location.streetAddress');

describe('location.streetAddress parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('location.streetAddress');
    const parsed = parseKeywordInvocation(`location.streetAddress(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes location.streetAddress(useFullAddress=true) successfully', () => {
    const parsed = parseKeywordInvocation('location.streetAddress(useFullAddress=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid useFullAddress type before generation', () => {
    expect(validateArgs('useFullAddress={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "useFullAddress" must be boolean, not object',
    });
  });
});
