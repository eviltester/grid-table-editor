import { faker } from '@faker-js/faker';
import { defineDomainKeywordHelpContractTests } from '../define-domain-keyword-help-contract-tests.js';
import { executeDomainKeyword } from '../../../../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../../../../js/domain/domain-keyword-parser.js';

defineDomainKeywordHelpContractTests('internet.jwtAlgorithm');

describe('internet.jwtAlgorithm parameter validation', () => {
  test('executes internet.jwtAlgorithm() successfully', () => {
    const parsed = parseKeywordInvocation('internet.jwtAlgorithm()');

    expect(parsed.errors).toEqual([]);

    const result = executeDomainKeyword(parsed.keyword, { faker, args: parsed.args });

    expect(result).toBeDefined();
  });
});
