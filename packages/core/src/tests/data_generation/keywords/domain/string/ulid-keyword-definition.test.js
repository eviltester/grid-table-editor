import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('string.ulid');

describe('string.ulid parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('string.ulid');
    const parsed = parseKeywordInvocation(`string.ulid(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes string.ulid(refDate=1718755200000) successfully', () => {
    const parsed = parseKeywordInvocation('string.ulid(refDate=1718755200000)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid refDate type before generation', () => {
    expect(validateArgs('refDate={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "refDate" must be number, not object',
    });
  });
});
