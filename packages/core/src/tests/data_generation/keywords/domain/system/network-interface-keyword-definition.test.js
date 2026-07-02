import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('system.networkInterface');

describe('system.networkInterface parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('system.networkInterface');
    const parsed = parseKeywordInvocation(`system.networkInterface(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes system.networkInterface(interfaceType="en", interfaceSchema="mac") successfully', () => {
    const parsed = parseKeywordInvocation('system.networkInterface(interfaceType="en", interfaceSchema="mac")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid interfaceType type before generation', () => {
    expect(validateArgs('interfaceType={"bad":true}, interfaceSchema="mac"')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "interfaceType" must be en, wl or ww, not object',
    });
  });

  test('rejects invalid interfaceSchema type before generation', () => {
    expect(validateArgs('interfaceType="en", interfaceSchema={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "interfaceSchema" must be index, slot, mac or pci, not object',
    });
  });
});
