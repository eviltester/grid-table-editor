import { RulesParser } from '../../../packages/core/js/data_generation/rulesParser.js';
import { faker } from '@faker-js/faker';

const RandExp = require('randexp');

describe('RulesParser parses a block of text to return a collection of rules', () => {
  test('can parse a valid two line string into rules', () => {
    const inputText = `Name
person.fullName`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);

    expect(parser.testDataRules.rules[0].name).toBe('Name');
    // current parser does not parse the type, type is assigned during compilation
    expect(parser.testDataRules.rules[0].type).toBe('');
    expect(parser.testDataRules.rules[0].ruleSpec).toBe('person.fullName');
  });

  test('flags an empty rule definition line', () => {
    const inputText = `Name
`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(false);
    expect(parser.errors).toContain('ERROR: Missing Rule on line 2');
    expect(parser.testDataRules.rules).toHaveLength(0);
  });
});
