import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('string.counterString');

describe('string.counterString parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('string.counterString');
    const parsed = parseKeywordInvocation(`string.counterString(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes string.counterString(min=15) successfully', () => {
    const parsed = parseKeywordInvocation('string.counterString(min=15)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid min type before generation', () => {
    expect(validateArgs('min={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "min" must be integer, not object',
    });
  });

  test('rejects invalid max type before generation', () => {
    expect(validateArgs('min=15, max={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "max" must be integer, not object',
    });
  });

  test('rejects invalid delimiter type before generation', () => {
    expect(validateArgs('min=15, delimiter={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "delimiter" must be string, not object',
    });
  });
});
