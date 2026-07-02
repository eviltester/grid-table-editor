import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('system.cron');

describe('system.cron parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('system.cron');
    const parsed = parseKeywordInvocation(`system.cron(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes system.cron(includeNonStandard=true) successfully', () => {
    const parsed = parseKeywordInvocation('system.cron(includeNonStandard=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid includeNonStandard type before generation', () => {
    expect(validateArgs('includeNonStandard={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "includeNonStandard" must be boolean, not object',
    });
  });

  test('rejects invalid includeYear type before generation', () => {
    expect(validateArgs('includeNonStandard=true, includeYear={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "includeYear" must be boolean, not object',
    });
  });
});
