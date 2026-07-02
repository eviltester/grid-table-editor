import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('phone.number');

describe('phone.number parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('phone.number');
    const parsed = parseKeywordInvocation(`phone.number(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes phone.number(style="international") successfully', () => {
    const parsed = parseKeywordInvocation('phone.number(style="international")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid style type before generation', () => {
    expect(validateArgs('style={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "style" must be human, national or international, not object',
    });
  });
});
