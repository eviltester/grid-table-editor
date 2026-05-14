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
      expect(compiler.isEnumPattern('datatype.enum("Red", "Blue")')).toBe(true);
      expect(compiler.isEnumPattern('awd.datatype.enum("Small", "Large")')).toBe(true);
    });

    test('rejects single values', () => {
      expect(compiler.isEnumPattern('SingleValue')).toBe(false);
    });

    test('rejects faker-like patterns', () => {
      expect(compiler.isEnumPattern('person.firstName,person.lastName')).toBe(false);
    });

    test('rejects regex-like patterns', () => {
      expect(compiler.isEnumPattern('[A-Z],{3}')).toBe(false);
    });
  });

  describe('enum compilation', () => {
    test('compiles simple enum correctly', () => {
      const rules = [new TestDataRule('Status', 'Active,Inactive,Pending')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('enum');
      expect(compiler.isValid()).toBe(true);
    });

    test('compiles awd enum format correctly', () => {
      const rules = [new TestDataRule('Priority', 'datatype.enum("High", "Medium", "Low")')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('enum');
      expect(compiler.isValid()).toBe(true);
    });

    test('compiles full awd enum format correctly', () => {
      const rules = [new TestDataRule('Priority', 'awd.datatype.enum("High", "Medium", "Low")')];

      compiler.compile(rules);

      expect(rules[0].type).toBe('enum');
      expect(compiler.isValid()).toBe(true);
    });

    test('validates enum rules correctly', () => {
      const rules = [new TestDataRule('Valid', 'One,Two,Three'), new TestDataRule('Invalid', 'SingleValue')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('enum');
      expect(rules[1].type).toBe('regex'); // Single value is valid regex (literal text)
      expect(compiler.isValid()).toBe(true);
    });

    test('handles malformed awd enum gracefully', () => {
      const rules = [new TestDataRule('Bad', 'datatype.enum(unclosed')];

      compiler.compile(rules);
      compiler.validate();

      expect(rules[0].type).toBe('literal'); // Falls back to literal
      expect(compiler.isValid()).toBe(true);
    });
  });

  describe('mixed rule types', () => {
    test('correctly identifies different types in one compilation', () => {
      const rules = [
        new TestDataRule('Enum', 'Red,Blue,Green'),
        new TestDataRule('Faker', 'person.firstName'),
        new TestDataRule('Regex', '[A-Z]{3}'),
        new TestDataRule('LiteralValue', 'FixedValue'),
        new TestDataRule('AwdEnum', 'enum("A", "B")'),
      ];

      compiler.compile(rules);

      expect(rules[0].type).toBe('enum');
      expect(rules[1].type).toBe('faker');
      expect(rules[2].type).toBe('regex');
      expect(rules[3].type).toBe('regex'); // Simple text is valid regex
      expect(rules[4].type).toBe('enum');
    });
  });

  describe('literal pattern detection', () => {
    test('detects explicit literal formats', () => {
      expect(compiler.isLiteralPattern('literal(.)')).toBe(true);
      expect(compiler.isLiteralPattern('datatype.literal(1,2,3)')).toBe(true);
      expect(compiler.isLiteralPattern('awd.datatype.literal(value)')).toBe(true);
    });

    test('explicit literal compiles to literal type and unwraps value', () => {
      const rules = [new TestDataRule('DotLiteral', 'literal(.)')];
      compiler.compile(rules);
      expect(rules[0].type).toBe('literal');
      expect(rules[0].ruleSpec).toBe('.');
    });

    test('explicit empty literal compiles to literal empty string', () => {
      const rules = [new TestDataRule('EmptyLiteral', 'literal()')];
      compiler.compile(rules);
      expect(rules[0].type).toBe('literal');
      expect(rules[0].ruleSpec).toBe('');
    });

    test('explicit whitespace literal compiles to literal whitespace', () => {
      const rules = [new TestDataRule('SpaceLiteral', 'literal(   )')];
      compiler.compile(rules);
      expect(rules[0].type).toBe('literal');
      expect(rules[0].ruleSpec).toBe('   ');
    });
  });
});
