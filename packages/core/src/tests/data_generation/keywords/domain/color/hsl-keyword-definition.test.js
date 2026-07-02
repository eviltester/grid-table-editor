import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('color.hsl');

describe('color.hsl parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('color.hsl');
    const parsed = parseKeywordInvocation(`color.hsl(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes color.hsl(format="css") successfully', () => {
    const parsed = parseKeywordInvocation('color.hsl(format="css")');

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

  test('rejects invalid includeAlpha type before generation', () => {
    expect(validateArgs('format="css", includeAlpha={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "includeAlpha" must be boolean, not object',
    });
  });
});
