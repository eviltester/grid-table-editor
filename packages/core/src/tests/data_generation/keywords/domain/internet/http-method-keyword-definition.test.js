import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.httpMethod');

describe('internet.httpMethod parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.httpMethod');
    const parsed = parseKeywordInvocation(`internet.httpMethod(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.httpMethod(commonOnly=true) successfully', () => {
    const parsed = parseKeywordInvocation('internet.httpMethod(commonOnly=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid commonOnly type before generation', () => {
    expect(validateArgs('commonOnly={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "commonOnly" must be boolean, not object',
    });
  });

  test('rejects invalid excludes type before generation', () => {
    expect(validateArgs('commonOnly=true, excludes={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "excludes" must be string, not object',
    });
  });
});
