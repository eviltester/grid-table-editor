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

    test('accepts explicit enum syntax with one value', () => {
      const rule = new TestDataRule('Single', 'enum("OnlyOne")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(true);
      expect(validator.isValid()).toBe(true);
    });

    test('accepts explicit enum syntax with one unquoted numeric value', () => {
      const rule = new TestDataRule('Single', 'enum(10)');
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

    test('rejects explicit enum with trailing empty argument', () => {
      const rule = new TestDataRule('Bad', 'enum("OnlyOne",)');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('cannot be empty');
    });

    test('rejects explicit enum with empty argument between values', () => {
      const rule = new TestDataRule('Bad', 'enum("One",,"Two")');
      rule.type = 'enum';

      const validator = new EnumTestDataRuleValidator();
      const isValid = validator.validate(rule);

      expect(isValid).toBe(false);
      expect(validator.getValidationError()).toContain('cannot be empty');
    });
  });

  describe('extractAwdEnumValues', () => {
    test('extracts values from datatype.enum format', () => {
      const values = EnumParser.extractAwdEnumValues('datatype.enum("A", "B", "C")');

      expect(values).toEqual(['A', 'B', 'C']);
    });

    test('extracts values from documented named datatype.enum values argument', () => {
      const values = EnumParser.extractAwdEnumValues('datatype.enum(values="active,inactive,pending")');

      expect(values).toEqual(['active', 'inactive', 'pending']);
    });

    test('extracts values from unquoted named datatype.enum values argument', () => {
      const values = EnumParser.extractAwdEnumValues('datatype.enum(values=active,inactive,pending)');

      expect(values).toEqual(['active', 'inactive', 'pending']);
    });

    test('extracts values from named awd.datatype.enum values argument', () => {
      const values = EnumParser.extractAwdEnumValues('awd.datatype.enum(values="GET,POST,PUT,PATCH")');

      expect(values).toEqual(['GET', 'POST', 'PUT', 'PATCH']);
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

    test('extracts a single explicit enum value', () => {
      const values = EnumParser.extractAwdEnumValues('enum("Open")');

      expect(values).toEqual(['Open']);
    });

    test('extracts a single explicit unquoted numeric enum value', () => {
      const values = EnumParser.extractAwdEnumValues('enum(10)');

      expect(values).toEqual(['10']);
    });

    test('preserves trailing empty explicit enum arguments for validation', () => {
      const values = EnumParser.extractAwdEnumValues('enum("Open",)');

      expect(values).toEqual(['Open', '']);
    });

    test('preserves empty explicit enum arguments between commas for validation', () => {
      const values = EnumParser.extractAwdEnumValues('enum("Open",,"Closed")');

      expect(values).toEqual(['Open', '', 'Closed']);
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
      const values = EnumParser.extractEnumValues('("a","quoted","bracketed","list")');
      expect(values).toEqual(['a', 'quoted', 'bracketed', 'list']);
    });
  });
});
