import { faker } from '@faker-js/faker';
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

  test('accepts valid typed domain params', () => {
    const validator = new DomainTestDataRuleValidator();

    const isValid = validator.validate({ ruleSpec: 'internet.httpMethod(commonOnly=true)' });

    expect(isValid).toBe(true);
    expect(validator.lastParsed).toEqual(
      expect.objectContaining({
        keyword: 'internet.httpMethod',
        recognized: true,
        args: [true],
        errors: [],
      })
    );
  });

  test('rejects mistyped domain params using keyword metadata', () => {
    const validator = new DomainTestDataRuleValidator();

    const isValid = validator.validate({ ruleSpec: 'internet.httpMethod(commonOnly="true")' });

    expect(isValid).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid keyword arguments: argument "commonOnly" must be boolean, not string'
    );
    expect(validator.lastParsed).toEqual(
      expect.objectContaining({
        keyword: 'internet.httpMethod',
        recognized: true,
        args: ['true'],
        errors: [],
      })
    );
  });

  test('rejects reversed number bounds using shared semantic arg validation', () => {
    const validator = new DomainTestDataRuleValidator();

    const isValid = validator.validate({ ruleSpec: 'number.int(min=47, max=32)' });

    expect(isValid).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid keyword arguments: argument "min" must be less than or equal to argument "max"'
    );
  });

  test('keeps malformed recognized invocations on the domain path', () => {
    const validator = new DomainTestDataRuleValidator();

    const isValid = validator.validate({ ruleSpec: 'internet.httpMethod(commonOnly=true' });

    expect(isValid).toBe(false);
    expect(validator.getValidationError()).toBe('Invalid keyword invocation: missing closing parenthesis');
    expect(validator.lastParsed).toEqual(
      expect.objectContaining({
        keyword: 'internet.httpMethod',
        recognized: true,
        args: [],
        errors: ['Invalid keyword invocation: missing closing parenthesis'],
      })
    );
  });

  test('accepts syntactically valid domain commands without dry-run execution when no faker is supplied', () => {
    const validator = new DomainTestDataRuleValidator();

    const isValid = validator.validate({ ruleSpec: 'word.adjective(length=999, strategy="fail")' });

    expect(isValid).toBe(true);
  });

  test('rejects domain commands that would throw during generation when faker is supplied', () => {
    const validator = new DomainTestDataRuleValidator(faker);

    const isValid = validator.validate({ ruleSpec: 'word.adjective(length=999, strategy="fail")' });

    expect(isValid).toBe(false);
    expect(validator.getValidationError()).toContain('No words found that match the given length.');
  });

  test('rejects unsatisfiable BigInt params before generation', () => {
    const validator = new DomainTestDataRuleValidator(faker);

    const isValid = validator.validate({ ruleSpec: 'number.bigInt(min=1, max=5, multipleOf=10)' });

    expect(isValid).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid keyword arguments: arguments "min", "max", and "multipleOf" do not allow any generated BigInt value'
    );
  });
});
