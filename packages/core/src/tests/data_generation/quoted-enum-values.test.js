import { EnumTestDataRuleValidator } from '../../../js/data_generation/enum/enumTestDataRuleValidator.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { PairwiseTestDataGenerator } from '../../../js/data_generation/n-wise/pairwiseTestDataGenerator.js';
import { EnumParser } from '../../../js/data_generation/utils/enumParser.js';
import { assertNoCommonErrorPatternsInRows } from '../utils/outputQualityAssertions.js';

describe('Quoted Enum Values', () => {
  let validator;

  beforeEach(() => {
    validator = new EnumTestDataRuleValidator();
  });

  function expectRuleToMatch(ruleSpec, expectedValues) {
    const parsed = EnumParser.parseEnumRuleSpec(ruleSpec);
    expect(parsed).toMatchObject({
      ok: true,
      values: expectedValues,
    });
  }

  function expectRuleToValidate(ruleSpec) {
    const rule = new TestDataRule('quotedEnum', ruleSpec);
    expect(validator.validate(rule)).toBe(true);
  }

  describe('EnumTestDataRuleValidator with quoted values', () => {
    test('should handle quoted values with commas', () => {
      const ruleSpec = 'enum("active, pending","inactive","completed, finished")';

      expectRuleToMatch(ruleSpec, ['active, pending', 'inactive', 'completed, finished']);
      expectRuleToValidate(ruleSpec);
    });

    test('should handle mixed quoted and unquoted values', () => {
      const ruleSpec = 'enum("high, urgent","medium","low")';

      expectRuleToMatch(ruleSpec, ['high, urgent', 'medium', 'low']);
      expectRuleToValidate(ruleSpec);
    });

    test('should handle datatype.enum format with quotes', () => {
      const ruleSpec = 'datatype.enum("tech, software","business","design, ui")';

      expectRuleToMatch(ruleSpec, ['tech, software', 'business', 'design, ui']);
      expectRuleToValidate(ruleSpec);
    });

    test('should handle awd.datatype.enum format with quotes', () => {
      const ruleSpec = 'awd.datatype.enum("admin, super","user","guest, visitor")';

      expectRuleToMatch(ruleSpec, ['admin, super', 'user', 'guest, visitor']);
      expectRuleToValidate(ruleSpec);
    });
  });

  describe('Integration test with quoted enums in pairwise', () => {
    test('should work with rules that have quoted enum values', () => {
      const rules = [
        new TestDataRule('priority', 'enum("high, urgent","low, normal")'),
        new TestDataRule('status', 'enum("active, running","inactive")'),
      ];

      // Set rule types to enum for pairwise generation
      rules.forEach((rule) => {
        rule.setType('enum');
      });

      const generator = new PairwiseTestDataGenerator();
      const initResult = generator.initializeFromRules(rules);

      expect(initResult.isError).toBe(false);

      const dataResult = generator.generateAllDataRecordsAsRows();
      expect(dataResult.isError).toBe(false);
      expect(dataResult.data && typeof dataResult.data).toBe('object');
      expect(Array.isArray(dataResult.data.data)).toBe(true);

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
      assertNoCommonErrorPatternsInRows(rows);
    });
  });
});
