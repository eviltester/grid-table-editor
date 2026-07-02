import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('system.fileExt');

describe('system.fileExt parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('system.fileExt');
    const parsed = parseKeywordInvocation(`system.fileExt(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes system.fileExt(mimeType="image/png") successfully', () => {
    const parsed = parseKeywordInvocation('system.fileExt(mimeType="image/png")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid mimeType type before generation', () => {
    expect(validateArgs('mimeType={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "mimeType" must be string, not object',
    });
  });
});
