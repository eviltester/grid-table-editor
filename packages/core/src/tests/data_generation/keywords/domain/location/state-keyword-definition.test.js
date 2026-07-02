import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('location.state');

describe('location.state parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('location.state');
    const parsed = parseKeywordInvocation(`location.state(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes location.state(abbreviated=true) successfully', () => {
    const parsed = parseKeywordInvocation('location.state(abbreviated=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid abbreviated type before generation', () => {
    expect(validateArgs('abbreviated={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "abbreviated" must be boolean, not object',
    });
  });
});
