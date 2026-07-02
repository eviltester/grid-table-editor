import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.emoji');

describe('internet.emoji parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.emoji');
    const parsed = parseKeywordInvocation(`internet.emoji(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.emoji(types=["food"]) successfully', () => {
    const parsed = parseKeywordInvocation('internet.emoji(types=["food"])');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid types type before generation', () => {
    expect(validateArgs('types={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "types" must be array, not object',
    });
  });
});
