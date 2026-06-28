import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';

describe('TestDataRulesCompiler regex pattern detection', () => {
  let compiler;

  beforeEach(() => {
    compiler = new TestDataRulesCompiler(faker, RandExp);
  });

  test('detects explicit regex formats', () => {
    expect(compiler.isRegexPattern('regex([A-Z]{3})')).toBe(true);
    expect(compiler.isRegexPattern('datatype.regex(\\d{2})')).toBe(true);
    expect(compiler.isRegexPattern('awd.datatype.regex(value)')).toBe(true);
  });

  test('explicit empty regex stays regex but fails validation', () => {
    const rules = [new TestDataRule('EmptyRegex', 'regex("")')];
    compiler.compile(rules);

    expect(rules[0].type).toBe('regex');
    expect(rules[0].ruleSpec).toBe('');
    compiler.validate();
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'EmptyRegex',
        message: expect.stringContaining('Regex pattern is required and cannot be blank'),
      })
    );
  });

  test('explicit malformed regex stays regex but fails validation', () => {
    const rules = [new TestDataRule('BadRegex', 'datatype.regex([)')];
    compiler.compile(rules);

    expect(rules[0].type).toBe('regex');
    expect(rules[0].ruleSpec).toBe('[');
    compiler.validate();
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'BadRegex',
        message: expect.stringContaining('Unterminated character class'),
      })
    );
  });

  test('untyped blank rules no longer fall through to regex', () => {
    const rules = [new TestDataRule('BlankRule', '')];
    compiler.compile(rules);

    expect(rules[0].type).toBe('literal');
    expect(compiler.errors).toEqual([]);
  });

  test('untyped malformed regex-like text falls back to literal', () => {
    const rules = [new TestDataRule('RawBadRegex', '[')];
    compiler.compile(rules);

    expect(rules[0].type).toBe('literal');
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'RawBadRegex',
        message: "Evaluating RawBadRegex as 'literal'",
      })
    );
  });
});
