import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import {
  executeDomainKeyword,
  getDomainKeywordByAlias,
  validateDomainKeywordArgs,
} from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('location.ordinalDirection');

describe('location.ordinalDirection parameter validation', () => {
  function validateArgs(paramsText) {
    const keyword = getDomainKeywordByAlias('location.ordinalDirection');
    const parsed = parseKeywordInvocation(`location.ordinalDirection(${paramsText})`);

    expect(parsed.errors).toEqual([]);

    return validateDomainKeywordArgs(keyword, parsed.args);
  }

  test('executes location.ordinalDirection(abbreviated=true) successfully', () => {
    const parsed = parseKeywordInvocation('location.ordinalDirection(abbreviated=true)');

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
