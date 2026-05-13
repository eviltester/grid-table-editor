import { RulesParser } from '../../../../js/data_generation/rulesParser.js';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';

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
    expect(parser.errors).toContain('ERROR: Missing Rule Definition for Name');
    expect(parser.testDataRules.rules).toHaveLength(0);
  });

  test('allows comment and blank lines around schema definitions', () => {
    const inputText = `# top comment

Priority
enum(high,medium,low)

  # in between
Status
enum(active,inactive,pending)
`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.testDataRules.rules).toHaveLength(2);
    expect(parser.testDataRules.rules[0].name).toBe('Priority');
    expect(parser.testDataRules.rules[1].name).toBe('Status');
    expect(parser.testDataRules.rules[0].comments).toContain('# top comment');
    expect(parser.testDataRules.rules[1].comments).toContain('# in between');
    const tokens = parser.getSchemaTokens();
    expect(tokens.some((token) => token.kind === 'comment')).toBe(true);
    expect(tokens.some((token) => token.kind === 'blank')).toBe(true);
  });

  test('rejects comment-only or blank-only schema text', () => {
    const parser = new RulesParser(faker, RandExp);
    parser.parseText('# note\n\n  # another');

    expect(parser.isValid()).toBe(false);
    expect(parser.errors).toContain('ERROR: No Rules Defined');
    expect(parser.testDataRules.rules).toHaveLength(0);
  });

  test('rejects blank lines between header and rule definition', () => {
    const parser = new RulesParser(faker, RandExp);
    parser.parseText('Priority\n\nenum(high,medium,low)');

    expect(parser.isValid()).toBe(false);
    expect(parser.errors).toContain('ERROR: Missing Rule Definition for Priority');
    expect(parser.testDataRules.rules).toHaveLength(0);
  });

  test('accepts rule lines that begin with # when header is pending', () => {
    const parser = new RulesParser(faker, RandExp);
    parser.parseText('Color\n#[A-F0-9]{6}');

    expect(parser.isValid()).toBe(true);
    expect(parser.errors).toHaveLength(0);
    expect(parser.testDataRules.rules).toHaveLength(1);
    expect(parser.testDataRules.rules[0].name).toBe('Color');
    expect(parser.testDataRules.rules[0].ruleSpec).toBe('#[A-F0-9]{6}');
  });

  test('preserves comments and blank lines when rebuilding from parsed tokens', () => {
    const inputText = `# a comment that should be skipped
Priority
enum(high,medium,low)

Status
enum(active,inactive,pending)`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    const output = parser.renderSpecFromRulesWithTokens(parser.testDataRules.rules);
    expect(output).toBe(inputText);
  });

  test('preserves comments and blank lines when rebuilding from rule comments', () => {
    const inputText = `# one

Priority
enum(high,medium,low)

# two
Status
enum(active,inactive,pending)`;
    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    const output = parser.renderSpecFromRulesWithComments(parser.testDataRules.rules);
    expect(output).toBe(inputText);
  });
});
