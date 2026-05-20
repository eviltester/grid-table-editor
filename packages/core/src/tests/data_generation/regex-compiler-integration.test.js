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

  test('explicit empty regex compiles to regex empty string', () => {
    const rules = [new TestDataRule('EmptyRegex', 'regex("")')];
    compiler.compile(rules);
    expect(rules[0].type).toBe('regex');
    expect(rules[0].ruleSpec).toBe('');
  });
});
