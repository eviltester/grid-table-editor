import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('color.lch');

describe('color.lch parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('color.lch');
    const parsed = parseKeywordInvocation(`color.lch(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes color.lch(format="decimal") successfully', () => {
    const parsed = parseKeywordInvocation('color.lch(format="decimal")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid format type before generation', () => {
    expect(validateArgs('format={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "format" must be decimal, css or binary, not object',
    });
  });
});
