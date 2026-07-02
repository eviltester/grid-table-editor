import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('literal.value');

describe('literal.value parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('literal.value');
    const parsed = parseKeywordInvocation(`literal.value(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes literal.value(value="Pending") successfully', () => {
    const parsed = parseKeywordInvocation('literal.value(value="Pending")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args });

    expect(result).toBe('Pending');
  });

  test('rejects invalid value type before generation', () => {
    expect(validateArgs('value={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "value" must be string, number or boolean, not object',
    });
  });
});
