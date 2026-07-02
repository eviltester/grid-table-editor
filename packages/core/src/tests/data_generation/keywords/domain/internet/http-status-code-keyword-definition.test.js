import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.httpStatusCode');

describe('internet.httpStatusCode parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.httpStatusCode');
    const parsed = parseKeywordInvocation(`internet.httpStatusCode(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.httpStatusCode(types=["success"]) successfully', () => {
    const parsed = parseKeywordInvocation('internet.httpStatusCode(types=["success"])');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('number');
  });

  test('rejects invalid types type before generation', () => {
    expect(validateArgs('types={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "types" must be array, not object',
    });
  });

  test('rejects empty types before generation', () => {
    expect(validateArgs('types=[]')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "types" must not be empty',
    });
  });

  test('rejects unsupported types before generation', () => {
    expect(validateArgs('types=["unsupported-value"]')).toEqual({
      ok: false,
      error:
        'Invalid keyword arguments: argument "types" contains unsupported value "unsupported-value". Allowed values are informational, success, redirection, clientError, serverError',
    });
  });
});
