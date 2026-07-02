import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('color.rgb');

describe('color.rgb parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('color.rgb');
    const parsed = parseKeywordInvocation(`color.rgb(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes color.rgb(casing="upper") successfully', () => {
    const parsed = parseKeywordInvocation('color.rgb(casing="upper")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid casing type before generation', () => {
    expect(validateArgs('casing={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "casing" must be lower, upper or mixed, not object',
    });
  });

  test('rejects invalid format type before generation', () => {
    expect(validateArgs('casing="upper", format={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "format" must be hex, decimal, css or binary, not object',
    });
  });

  test('rejects invalid includeAlpha type before generation', () => {
    expect(validateArgs('casing="upper", includeAlpha={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "includeAlpha" must be boolean, not object',
    });
  });

  test('rejects invalid prefix type before generation', () => {
    expect(validateArgs('casing="upper", prefix={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "prefix" must be string, not object',
    });
  });
});
