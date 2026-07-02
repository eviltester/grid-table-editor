import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('git.commitDate');

describe('git.commitDate parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('git.commitDate');
    const parsed = parseKeywordInvocation(`git.commitDate(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes git.commitDate(refDate="2024-01-01T00:00:00.000Z") successfully', () => {
    const parsed = parseKeywordInvocation('git.commitDate(refDate="2024-01-01T00:00:00.000Z")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be string, date or number, not object',
    });
  });
});
