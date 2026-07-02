import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('finance.bic');

describe('finance.bic parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('finance.bic');
    const parsed = parseKeywordInvocation(`finance.bic(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes finance.bic(includeBranchCode=true) successfully', () => {
    const parsed = parseKeywordInvocation('finance.bic(includeBranchCode=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid includeBranchCode type before generation', () => {
    expect(validateArgs('includeBranchCode={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "includeBranchCode" must be boolean, not object',
    });
  });
});
