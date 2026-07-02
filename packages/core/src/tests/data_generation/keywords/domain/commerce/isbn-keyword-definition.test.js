import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('commerce.isbn');

describe('commerce.isbn parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('commerce.isbn');
    const parsed = parseKeywordInvocation(`commerce.isbn(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes commerce.isbn(separator="-") successfully', () => {
    const parsed = parseKeywordInvocation('commerce.isbn(separator="-")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid separator type before generation', () => {
    expect(validateArgs('separator={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "separator" must be string, not object',
    });
  });

  test('rejects invalid variant type before generation', () => {
    expect(validateArgs('separator="-", variant={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "variant" must be 10 or 13, not object',
    });
  });
});
