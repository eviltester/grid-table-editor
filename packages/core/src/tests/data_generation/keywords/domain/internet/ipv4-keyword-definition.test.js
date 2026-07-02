import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.ipv4');

describe('internet.ipv4 parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('internet.ipv4');
    const parsed = parseKeywordInvocation(`internet.ipv4(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes internet.ipv4(cidrBlock="192.168.0.0/24") successfully', () => {
    const parsed = parseKeywordInvocation('internet.ipv4(cidrBlock="192.168.0.0/24")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid cidrBlock type before generation', () => {
    expect(validateArgs('cidrBlock={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "cidrBlock" must be string, not object',
    });
  });

  test('rejects invalid network type before generation', () => {
    expect(validateArgs('cidrBlock="192.168.0.0/24", network={"bad":true}')).toEqual({
      ok: false,
      error:
        'Invalid keyword arguments: argument "network" must be any, loopback, private-a, private-b, private-c, test-net-1, test-net-2, test-net-3, link-local or multicast, not object',
    });
  });
});
