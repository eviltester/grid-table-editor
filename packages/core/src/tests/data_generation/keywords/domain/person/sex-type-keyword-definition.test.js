import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('person.sexType');

describe('person.sexType parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('person.sexType');
    const parsed = parseKeywordInvocation(`person.sexType(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes person.sexType(includeGeneric=false) successfully', () => {
    const parsed = parseKeywordInvocation('person.sexType(includeGeneric=false)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid includeGeneric type before generation', () => {
    expect(validateArgs('includeGeneric={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "includeGeneric" must be boolean, not object',
    });
  });
});
