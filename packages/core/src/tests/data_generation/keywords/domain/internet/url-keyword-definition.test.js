import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.url');

describe('internet.url parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.url');
    const parsed = parseKeywordInvocation(`internet.url(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.url(appendSlash=true) successfully', () => {
    const parsed = parseKeywordInvocation('internet.url(appendSlash=true)');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid appendSlash type before generation', () => {
    expect(validateArgs('appendSlash={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "appendSlash" must be boolean, not object',
    });
  });

  test('rejects invalid protocol type before generation', () => {
    expect(validateArgs('appendSlash=true, protocol={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "protocol" must be http or https, not object',
    });
  });
});
