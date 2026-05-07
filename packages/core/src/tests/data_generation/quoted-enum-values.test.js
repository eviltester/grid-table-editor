import { EnumTestDataRuleValidator } from '../../../js/data_generation/enum/enumTestDataRuleValidator.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { PairwiseTestDataGenerator } from '../../../js/data_generation/all-pairs/pairwiseTestDataGenerator.js';
import { EnumParser } from '../../../js/data_generation/utils/enumParser.js';

describe('Quoted Enum Values', () => {
  let validator;

  beforeEach(() => {
    validator = new EnumTestDataRuleValidator();
  });

  describe('EnumTestDataRuleValidator with quoted values', () => {
    test('should handle quoted values with commas', () => {
      const rule = new TestDataRule('status', 'enum("active, pending","inactive","completed, finished")');

      const isValid = validator.validate(rule);
      expect(isValid).toBe(true);

      const values = EnumParser.extractAwdEnumValues('enum("active, pending","inactive","completed, finished")');
      expect(values).toEqual(['active, pending', 'inactive', 'completed, finished']);
    });

    test('should handle mixed quoted and unquoted values', () => {
      const rule = new TestDataRule('priority', 'enum("high, urgent",medium,low)');

      const isValid = validator.validate(rule);
      expect(isValid).toBe(true);

      const values = EnumParser.extractAwdEnumValues('enum("high, urgent",medium,low)');
      expect(values).toEqual(['high, urgent', 'medium', 'low']);
    });

    test('should handle datatype.enum format with quotes', () => {
      const rule = new TestDataRule('category', 'datatype.enum("tech, software","business","design, ui")');

      const isValid = validator.validate(rule);
      expect(isValid).toBe(true);

      const values = EnumParser.extractAwdEnumValues('datatype.enum("tech, software","business","design, ui")');
      expect(values).toEqual(['tech, software', 'business', 'design, ui']);
    });

    test('should handle awd.datatype.enum format with quotes', () => {
      const rule = new TestDataRule('role', 'awd.datatype.enum("admin, super","user","guest, visitor")');

      const isValid = validator.validate(rule);
      expect(isValid).toBe(true);

      const values = EnumParser.extractAwdEnumValues('awd.datatype.enum("admin, super","user","guest, visitor")');
      expect(values).toEqual(['admin, super', 'user', 'guest, visitor']);
    });
  });

  describe('PairwiseTestDataGenerator with quoted enum values', () => {
    test('should properly extract quoted enum values for pairwise generation', () => {
      // Test simple format
      const simpleValues = EnumParser.extractEnumValues('red,blue,green');
      expect(simpleValues).toEqual(['red', 'blue', 'green']);

      // Test quoted format with commas
      const quotedValues = EnumParser.extractEnumValues('enum("red, crimson","blue, navy","green")');
      expect(quotedValues).toEqual(['red, crimson', 'blue, navy', 'green']);

      // Test mixed format
      const mixedValues = EnumParser.extractEnumValues('enum("high, urgent",medium,low)');
      expect(mixedValues).toEqual(['high, urgent', 'medium', 'low']);
    });
  });

  describe('Integration test with quoted enums in pairwise', () => {
    test('should work with rules that have quoted enum values', () => {
      const rules = [
        new TestDataRule('priority', 'enum("high, urgent","low, normal")'),
        new TestDataRule('status', 'enum("active, running","inactive")'),
      ];

      // Set rule types to enum for pairwise generation
      rules.forEach((rule) => rule.setType('enum'));

      const generator = new PairwiseTestDataGenerator();
      const initResult = generator.initializeFromRules(rules);

      expect(initResult.isError).toBe(false);

      const dataResult = generator.generateAllDataRecordsAsRows();
      expect(dataResult.isError).toBe(false);
      expect(dataResult.data).toBeDefined();
      expect(dataResult.data.data).toBeDefined();

      const [headers, ...rows] = dataResult.data.data;
      expect(headers).toEqual(['priority', 'status']);

      // Check that the quoted values are properly used
      const allPriorityValues = rows.map((row) => row[0]);
      const allStatusValues = rows.map((row) => row[1]);

      expect(allPriorityValues).toContain('high, urgent');
      expect(allPriorityValues).toContain('low, normal');
      expect(allStatusValues).toContain('active, running');
      expect(allStatusValues).toContain('inactive');

      // Verify we have all 4 possible combinations for 2x2 pairwise
      expect(rows.length).toBe(4);
    });
  });
});
