import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';

describe('TestDataRulesCompiler literal pattern detection', () => {
  let compiler;

  beforeEach(() => {
    compiler = new TestDataRulesCompiler(faker, RandExp);
  });

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
    const rules = [new TestDataRule('EmptyLiteral', 'literal("")')];
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
