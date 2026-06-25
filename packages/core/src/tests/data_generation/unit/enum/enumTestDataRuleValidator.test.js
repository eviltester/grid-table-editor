import { EnumTestDataRuleValidator } from '../../../../../js/data_generation/enum/enumTestDataRuleValidator.js';
import { TestDataRule } from '../../../../../js/data_generation/testDataRule.js';

describe('EnumTestDataRuleValidator', () => {
  describe('validates enum formats', () => {
    test('validates simple comma-separated enum', () => {
      const rule = new TestDataRule('Status', 'Active,Inactive,Pending');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('validates awd datatype.enum format', () => {
      const rule = new TestDataRule('Color', 'datatype.enum("Red", "Blue", "Green")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('validates awd.datatype.enum format', () => {
      const rule = new TestDataRule('Size', 'awd.datatype.enum("Small", "Medium", "Large")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('validates short enum format', () => {
      const rule = new TestDataRule('Size', 'enum("S", "M", "L")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('accepts explicit enum syntax with one value', () => {
      const rule = new TestDataRule('Single', 'enum("OnlyOne")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('accepts explicit enum syntax with one numeric-looking string value', () => {
      const rule = new TestDataRule('Single', 'enum("10")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('validates command-looking comma-separated values as enum literals', () => {
      const rule = new TestDataRule('Names', 'person.firstName,person.lastName');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('validates regex-looking comma-separated values as enum literals', () => {
      const rule = new TestDataRule('Patterns', '[A-Z],{3}');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('rejects enum with only one value', () => {
      const rule = new TestDataRule('Single', 'OnlyOne');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('Invalid enum format');
    });

    test('rejects enum with empty values', () => {
      const rule = new TestDataRule('Empty', 'One,,Three');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('cannot be empty');
    });

    test('rejects malformed awd enum format', () => {
      const rule = new TestDataRule('Bad', 'datatype.enum()'); // Empty enum
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('argument "values" is required');
    });

    test('rejects explicit enum with trailing empty argument', () => {
      const rule = new TestDataRule('Bad', 'enum("OnlyOne",)');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('missing argument after comma');
    });

    test('rejects explicit enum with empty argument between values', () => {
      const rule = new TestDataRule('Bad', 'enum("One",,"Two")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('missing argument after comma');
    });
  });
});
