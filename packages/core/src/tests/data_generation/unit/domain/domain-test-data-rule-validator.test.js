import { DomainTestDataRuleValidator } from '../../../../../js/data_generation/domain/domainTestDataRuleValidator.js';

describe('DomainTestDataRuleValidator', () => {
  test.each([
    'helpers.arrayElement(["a","b"])',
    'domain.helpers.arrayElement(["a","b"])',
    'awd.domain.helpers.arrayElement(["a","b"])',
  ])('rejects helper-prefixed domain rule "%s"', (ruleSpec) => {
    const validator = new DomainTestDataRuleValidator();
    const isValid = validator.validate({ ruleSpec });
    expect(isValid).toBe(false);
    expect(validator.getValidationError()).toContain('helpers_not_supported_in_domain');
  });
});
