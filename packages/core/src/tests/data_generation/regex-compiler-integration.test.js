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

  test('untyped JavaScript regex literal compiles as regex without literal slashes', () => {
    const rules = [new TestDataRule('Code', '/[A-Z]{3}/')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: '[A-Z]{3}' });
    expect(compiler.errors).toEqual([]);
  });

  test('untyped comma quantifier regex literal compiles as regex instead of enum', () => {
    const rules = [new TestDataRule('Code', '/[A-Z]{2,3}/')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: '[A-Z]{2,3}' });
    expect(compiler.errors).toEqual([]);
  });

  test('untyped JavaScript regex flags fail explicitly instead of being ignored', () => {
    const rules = [new TestDataRule('Code', '/[a-z]{3}/i')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: '[a-z]{3}' });
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Code',
        message: expect.stringContaining('JavaScript regex flags are not supported'),
      })
    );
  });

  test('explicit JavaScript regex literal wrapper compiles without literal slashes', () => {
    const rules = [new TestDataRule('Code', 'regex(/[A-Z]{3}/)')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: '[A-Z]{3}' });
    expect(compiler.errors).toEqual([]);
  });

  test('explicit JavaScript regex literal wrapper rejects unsupported flags', () => {
    const rules = [new TestDataRule('Code', 'regex(/[a-z]{3}/i)')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec: '[a-z]{3}' });
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Code',
        message: expect.stringContaining('JavaScript regex flags are not supported'),
      })
    );
  });

  test.each(['[A-Z]{2,3}', '^GET,POST$', '(?:GET|POST),\\d+'])(
    'untyped comma regex shorthand %s compiles as regex instead of enum',
    (ruleSpec) => {
      const rules = [new TestDataRule('Code', ruleSpec)];
      compiler.compile(rules);
      compiler.validate();

      expect(rules[0]).toMatchObject({ type: 'regex', ruleSpec });
      expect(compiler.errors).toEqual([]);
    }
  );

  test('plain comma-separated words remain implicit enum shorthand', () => {
    const rules = [new TestDataRule('Method', 'GET,POST,PUT')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({
      type: 'domain',
      ruleSpec: 'datatype.enum("GET", "POST", "PUT")',
    });
    expect(compiler.errors).toEqual([]);
  });

  test('explicit enum wrapper stays enum even when values contain regex syntax', () => {
    const rules = [new TestDataRule('Pattern', 'enum("[A-Z]{2,3}","x")')];
    compiler.compile(rules);
    compiler.validate();

    expect(rules[0]).toMatchObject({
      type: 'domain',
      ruleSpec: 'datatype.enum("[A-Z]{2,3}", "x")',
    });
    expect(compiler.errors).toEqual([]);
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
