import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('image.personPortrait');

describe('image.personPortrait parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('image.personPortrait');
    const parsed = parseKeywordInvocation(`image.personPortrait(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes image.personPortrait(sex="female", size=128) successfully', () => {
    const parsed = parseKeywordInvocation('image.personPortrait(sex="female", size=128)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid sex type before generation', () => {
    expect(validateArgs('sex={"bad":true}, size=128')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "sex" must be female, generic or male, not object',
    });
  });

  test('rejects invalid size type before generation', () => {
    expect(validateArgs('sex="female", size={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "size" must be 512, 256, 128, 64 or 32, not object',
    });
  });
});
