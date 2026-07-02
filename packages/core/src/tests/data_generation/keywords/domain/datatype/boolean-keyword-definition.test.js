import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('datatype.boolean');

describe('datatype.boolean parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('datatype.boolean');
    const parsed = parseKeywordInvocation(`datatype.boolean(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes datatype.boolean(probability=0.5) successfully', () => {
    const parsed = parseKeywordInvocation('datatype.boolean(probability=0.5)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(typeof result).toBe('boolean');
  });

  test('rejects invalid probability type before generation', () => {
    expect(validateArgs('probability={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "probability" must be number, not object',
    });
  });

  test('rejects probability above range before generation', () => {
    expect(validateArgs('probability=2')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "probability" must be between 0 and 1',
    });
  });

  test('rejects probability below range before generation', () => {
    expect(validateArgs('probability=-0.1')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "probability" must be between 0 and 1',
    });
  });
});
