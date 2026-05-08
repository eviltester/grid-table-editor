import { TestDataRules } from '../../../../js/data_generation/testDataRules.js';

describe('TestDataRules collection behavior', () => {
  test('getRule finds a rule by name', () => {
    const rules = new TestDataRules();
    rules.addRule('FirstName', 'person.firstName');
    rules.addRule('LastName', 'person.lastName');

    const rule = rules.getRule('LastName');
    expect(rule).toBeDefined();
    expect(rule.name).toBe('LastName');
    expect(rule.ruleSpec).toBe('person.lastName');
  });

  test('getRule matches case-insensitively and trims whitespace', () => {
    const rules = new TestDataRules();
    rules.addRule('  FullName  ', 'person.fullName');

    const rule = rules.getRule('  fullname ');
    expect(rule).toBeDefined();
    expect(rule.name).toBe('FullName');
  });

  test('getRule returns undefined for unknown names', () => {
    const rules = new TestDataRules();
    rules.addRule('Email', 'internet.email');

    expect(rules.getRule('missing')).toBeUndefined();
  });
});
