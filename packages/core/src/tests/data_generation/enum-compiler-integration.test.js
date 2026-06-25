import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';

describe('TestDataRulesCompiler with Enum Support', () => {
  let compiler;

  beforeEach(() => {
    compiler = new TestDataRulesCompiler(faker, RandExp);
  });

  describe('enum pattern detection', () => {
    test('detects simple comma-separated enums', () => {
      expect(compiler.isEnumPattern('Red,Blue,Green')).toBe(true);
      expect(compiler.isEnumPattern('Active,Inactive')).toBe(true);
    });

    test('detects awd enum formats', () => {
      expect(compiler.isEnumPattern('enum("A", "B")')).toBe(true);
      expect(compiler.isEnumPattern('enum("A")')).toBe(true);
      expect(compiler.isEnumPattern('datatype.enum("Red", "Blue")')).toBe(true);
      expect(compiler.isEnumPattern('awd.datatype.enum("Small", "Large")')).toBe(true);
    });

    test('rejects single values', () => {
      expect(compiler.isEnumPattern('SingleValue')).toBe(false);
    });

    test('detects command-looking CSV as enum values', () => {
      expect(compiler.isEnumPattern('person.firstName,person.lastName')).toBe(true);
    });

    test('detects regex-looking CSV as enum values', () => {
      expect(compiler.isEnumPattern('[A-Z],{3}')).toBe(true);
    });
  });

  describe('enum compilation', () => {
    test('compiles simple enum correctly', () => {
      const rules = [new TestDataRule('Status', 'Active,Inactive,Pending')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("Active", "Inactive", "Pending")');
      expect(compiler.isValid()).toBe(true);
    });

    test('compiles awd enum format correctly', () => {
      const rules = [new TestDataRule('Priority', 'datatype.enum("High", "Medium", "Low")')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("High", "Medium", "Low")');
      expect(compiler.isValid()).toBe(true);
    });

    test('compiles explicit single-value enum correctly', () => {
      const rules = [new TestDataRule('Status', 'enum("Open")')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("Open")');
      expect(compiler.isValid()).toBe(true);
    });

    test('compiles full awd enum format correctly', () => {
      const rules = [new TestDataRule('Priority', 'awd.datatype.enum("High", "Medium", "Low")')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("High", "Medium", "Low")');
      expect(compiler.isValid()).toBe(true);
    });

    test('validates enum rules correctly', () => {
      const rules = [new TestDataRule('Valid', 'One,Two,Three'), new TestDataRule('Invalid', 'SingleValue')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("One", "Two", "Three")');
      expect(rules[1].type).toBe('regex'); // Single value is valid regex (literal text)
      expect(compiler.isValid()).toBe(true);
    });

    test('keeps malformed CSV on the enum validation path', () => {
      const rules = [new TestDataRule('Status', 'One,,Three')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('enum');
      expect(compiler.isValid()).toBe(false);
      expect(compiler.errors).toContainEqual(
        expect.objectContaining({
          code: 'compiler_validation_error',
          column: 'Status',
          message: 'Status failed enum validation - Enum values cannot be empty',
        })
      );
    });

    test('compiles command-looking CSV as enum values instead of a partial domain command', () => {
      const rules = [new TestDataRule('Names', 'person.firstName,person.lastName')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("person.firstName", "person.lastName")');
      expect(compiler.isValid()).toBe(true);
    });

    test('compiles regex-looking CSV as enum values instead of regex', () => {
      const rules = [new TestDataRule('PatternParts', '[A-Z],{3}')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(rules[0].ruleSpec).toBe('datatype.enum("[A-Z]", "{3}")');
      expect(compiler.isValid()).toBe(true);
    });

    test('keeps malformed explicit enum syntax on a validation path', () => {
      const rules = [new TestDataRule('Bad', 'datatype.enum(unclosed')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('domain');
      expect(compiler.isValid()).toBe(false);
      expect(compiler.errors).toContainEqual(
        expect.objectContaining({
          code: 'compiler_validation_error',
          column: 'Bad',
          message: expect.stringContaining('Bad failed domain validation'),
        })
      );
    });
  });
});
