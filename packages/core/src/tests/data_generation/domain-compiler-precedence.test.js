import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import { TestDataRulesCompiler } from '../../../js/data_generation/testDataRulesCompiler.js';

describe('domain compiler precedence', () => {
  test('classifies domain keyword rules as domain before faker', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'A', type: '', ruleSpec: 'number.int(1,10)' }];

    compiler.compile(rules);

    expect(rules[0].type).toBe('domain');
  });

  test('keeps explicitly typed faker rules as faker', () => {
    const compiler = new TestDataRulesCompiler(faker, RandExp);
    const rules = [{ name: 'A', type: 'faker', ruleSpec: 'person.fullName()' }];

    compiler.compile(rules);

    expect(rules[0].type).toBe('faker');
  });
});
