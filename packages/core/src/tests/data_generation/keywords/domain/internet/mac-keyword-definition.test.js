import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.mac');

describe('internet.mac parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.mac');
    const parsed = parseKeywordInvocation(`internet.mac(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.mac(separator="-") successfully', () => {
    const parsed = parseKeywordInvocation('internet.mac(separator="-")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid separator type before generation', () => {
    expect(validateArgs('separator={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "separator" must be ":", "-" or "", not object',
    });
  });
});
