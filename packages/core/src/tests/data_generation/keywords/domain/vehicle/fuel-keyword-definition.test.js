import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('vehicle.fuel');

describe('vehicle.fuel parameter validation', () => {
  test('executes vehicle.fuel() successfully', () => {
    const parsed = parseKeywordInvocation('vehicle.fuel()');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });
});
