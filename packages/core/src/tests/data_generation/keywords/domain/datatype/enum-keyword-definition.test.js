import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('datatype.enum');

describe('datatype.enum parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('datatype.enum');
    const parsed = parseKeywordInvocation(`datatype.enum(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes datatype.enum(values=["GET","POST","PUT"]) successfully', () => {
    const parsed = parseKeywordInvocation('datatype.enum(values=["GET","POST","PUT"])');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { args: parsed.args });

    expect(['GET', 'POST', 'PUT']).toContain(result);
  });

  test('rejects missing enum values before generation', () => {
    expect(validateArgs('')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "values" is required',
    });
  });

  test('rejects empty csv enum values before generation', () => {
    expect(validateArgs('values=""')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "values" is required',
    });
  });

  test('rejects empty array enum values before generation', () => {
    expect(validateArgs('values=[]')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "values" is required',
    });
  });

  test('rejects blank enum entries before generation', () => {
    expect(validateArgs('values=["GET",""]')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: enum values cannot be empty',
    });
  });

  test('rejects invalid enum value type before generation', () => {
    expect(validateArgs('values={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "values" must be comma-separated list or array, not object',
    });
  });
});
