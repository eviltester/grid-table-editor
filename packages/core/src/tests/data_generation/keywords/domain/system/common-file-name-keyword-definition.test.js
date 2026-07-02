import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('system.commonFileName');

describe('system.commonFileName parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('system.commonFileName');
    const parsed = parseKeywordInvocation(`system.commonFileName(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes system.commonFileName(extension="txt") successfully', () => {
    const parsed = parseKeywordInvocation('system.commonFileName(extension="txt")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid extension type before generation', () => {
    expect(validateArgs('extension={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "extension" must be string, not object',
    });
  });
});
