import { TestDataRule } from '../../../../../js/data_generation/testDataRule.js';
import { FakerTestDataRuleValidator } from '../../../../../js/data_generation/faker/fakerTestDataRuleValidator.js';
import { faker } from '@faker-js/faker';

describe('Can validate Faker TestDataRules using FakerTestDataRuleValidator', () => {
  test('can determine a invalid Faker TestDataRule', () => {
    const rule = new TestDataRule('Test', 'internet.ea');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);
    expect(validator.isValid()).toBe(false);
  });

  test('can determine a invalid Faker TestDataRule does not match faker call', () => {
    const rule = new TestDataRule('Test', 'internet');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);
    expect(validator.isValid()).toBe(false);
  });

  test('can determine a syntax error for Faker TestDataRule', () => {
    const rule = new TestDataRule('Test', "internet.email('bob'");
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);
    expect(validator.isValid()).toBe(false);
  });

  test('keeps malformed recognized helper invocations on the faker path', () => {
    const rule = new TestDataRule('Test', 'helpers.fromRegExp("("[A-Z]{2}[0-9]{2}")")');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);

    expect(validator.isValid()).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing'
    );
    expect(validator.lastParsed).toEqual({
      command: 'helpers.fromRegExp',
      recognized: true,
      error: 'Invalid Faker API Call Unsafe faker rule syntax detected: requires complex argument parsing',
    });
  });

  test('will not process empty Faker TestDataRule', () => {
    const rule = new TestDataRule('Test', '');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);
    expect(validator.isValid()).toBe(false);
  });

  test('accepts helpers.mustache with js-style object literal arguments', () => {
    const rule = new TestDataRule('Test', 'helpers.mustache("{{name}}", { name: "Ada" })');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);
    expect(validator.isValid()).toBe(true);
  });

  test('rejects malformed helpers.arrayElement params with array guidance', () => {
    const rule = new TestDataRule('Test', 'helpers.arrayElement(["A", "B")');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);

    expect(validator.isValid()).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid Faker API Call helpers.arrayElement requires an array argument, e.g. helpers.arrayElement(["A", "B", "C"]).'
    );
  });

  test('rejects helpers.rangeToNumber range object without max', () => {
    const rule = new TestDataRule('Test', 'helpers.rangeToNumber({ min: 5 })');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);

    expect(validator.isValid()).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid Faker API Call helpers.rangeToNumber range object requires max'
    );
  });

  test('rejects helpers.rangeToNumber range object when min is greater than max', () => {
    const rule = new TestDataRule('Test', 'helpers.rangeToNumber({ min: 9, max: 5 })');
    rule.type = 'faker';

    const validator = new FakerTestDataRuleValidator(faker);
    validator.validate(rule);

    expect(validator.isValid()).toBe(false);
    expect(validator.getValidationError()).toBe(
      'Invalid Faker API Call helpers.rangeToNumber range min must be less than or equal to max'
    );
  });
});
