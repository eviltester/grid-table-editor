import { EnumTestDataRuleValidator } from '../../../../../js/data_generation/enum/enumTestDataRuleValidator.js';
import { TestDataRule } from '../../../../../js/data_generation/testDataRule.js';
import { EnumParser } from '../../../../../js/data_generation/utils/enumParser.js';

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

    test('rejects enum with only one value', () => {
      const rule = new TestDataRule('Single', 'OnlyOne');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('at least 2 values');
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
      expect(validator.getValidationError()).toContain('Invalid enum format');
    });
  });

  describe('extractAwdEnumValues', () => {
    test('extracts values from datatype.enum format', () => {
      const values = EnumParser.extractAwdEnumValues('datatype.enum("A", "B", "C")');

      expect(values).toEqual(['A', 'B', 'C']);
    });

    test('handles spaces in enum format', () => {
      const values = EnumParser.extractAwdEnumValues('enum( "First" , "Second" , "Third" )');

      expect(values).toEqual(['First', 'Second', 'Third']);
    });

    test('extracts unquoted values from enum format', () => {
      const values = EnumParser.extractAwdEnumValues('enum(GET,POST,PUT,DELETE)');

      expect(values).toEqual(['GET', 'POST', 'PUT', 'DELETE']);
    });

    test('extracts mixed quoted and unquoted values from enum format', () => {
      const values = EnumParser.extractAwdEnumValues('enum(basic,"with space",advanced)');

      expect(values).toEqual(['basic', 'with space', 'advanced']);
    });

    test('extracts shorthand enum values without parentheses', () => {
      const values = EnumParser.extractEnumValues('enum active,inactive,pending');
      expect(values).toEqual(['active', 'inactive', 'pending']);
    });

    test('extracts bracketed csv list values', () => {
      const values = EnumParser.extractEnumValues('(a,bracketed,list)');
      expect(values).toEqual(['a', 'bracketed', 'list']);
    });

    test('extracts quoted bracketed list values', () => {
      const values = EnumParser.extractEnumValues('("a","quoteded","bracketed","list")');
      expect(values).toEqual(['a', 'quoteded', 'bracketed', 'list']);
    });
  });
});
