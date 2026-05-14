import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';

describe('compiler error reporting through functional compiler flows', () => {
  test('compile falls back to literal and reports compiler validation warning when name is empty', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: '', type: '', ruleSpec: '[' }];

    compiler.compile(rules);

    expect(rules[0].type).toBe('literal');
    expect(compiler.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        message: "Evaluating __ as 'literal'",
      })
    );
    expect(compiler.errors[0].column).toBeUndefined();
  });

  test('validate reports faker, regex, enum and unknown-type errors without column when name is empty', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    compiler.rules = [
      { name: '', type: 'faker', ruleSpec: 'not.a.real.command()' },
      { name: '', type: 'regex', ruleSpec: '[' },
      { name: '', type: 'enum', ruleSpec: 'enum()' },
      { name: '', type: 'wat', ruleSpec: 'anything' },
    ];

    compiler.validate();

    expect(compiler.errors.map((error) => error.code)).toEqual([
      'compiler_validation_error',
      'compiler_validation_error',
      'compiler_validation_error',
      'unknown_rule_type',
    ]);
    expect(compiler.errors[0].message).toContain(' failed faker validation - ');
    expect(compiler.errors[1].message).toContain(' failed Regex validation - ');
    expect(compiler.errors[2].message).toContain(' failed enum validation - ');
    expect(compiler.errors[0].message).toContain('__ failed faker validation - ');
    expect(compiler.errors[1].message).toContain('__ failed Regex validation - ');
    expect(compiler.errors[2].message).toContain('__ failed enum validation - ');
    expect(compiler.errors[3].message).toBe('__ has no defined type');
    expect(compiler.errors.every((error) => error.column === undefined)).toBe(true);
  });
});
