import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';
import { TestDataRule } from '../../../js/data_generation/testDataRule.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';

describe('TestDataRulesCompiler mixed rule types', () => {
  test('correctly identifies different types in one compilation', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [
      new TestDataRule('Enum', 'Red,Blue,Green'),
      new TestDataRule('Faker', 'person.firstName'),
      new TestDataRule('Regex', '[A-Z]{3}'),
      new TestDataRule('LiteralValue', 'FixedValue'),
      new TestDataRule('AwdEnum', 'enum("A", "B")'),
    ];

    compiler.compile(rules);

    expect(rules[0].type).toBe('enum');
    expect(rules[1].type).toBe('domain');
    expect(rules[2].type).toBe('regex');
    expect(rules[3].type).toBe('regex');
    expect(rules[4].type).toBe('enum');
  });
});
