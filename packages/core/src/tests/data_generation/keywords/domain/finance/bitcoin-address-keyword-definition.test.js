import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('finance.bitcoinAddress');

describe('finance.bitcoinAddress parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('finance.bitcoinAddress');
    const parsed = parseKeywordInvocation(`finance.bitcoinAddress(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes finance.bitcoinAddress(type="bech32") successfully', () => {
    const parsed = parseKeywordInvocation('finance.bitcoinAddress(type="bech32")');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });

  test('rejects invalid type type before generation', () => {
    expect(validateArgs('type={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "type" must be legacy, segwit, bech32 or taproot, not object',
    });
  });

  test('rejects invalid network type before generation', () => {
    expect(validateArgs('type="bech32", network={"bad":true}')).toEqual({
      ok: false,
      error: 'Invalid keyword arguments: argument "network" must be mainnet or testnet, not object',
    });
  });
});
