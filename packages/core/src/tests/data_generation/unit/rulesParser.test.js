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

  test('can parse inline pict-style column definitions into rules', () => {
    const inputText = `Browser: Chrome,Firefox,Safari
Status: enum("Open","Closed")
Name: person.fullName`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.testDataRules.rules).toHaveLength(3);
    expect(parser.testDataRules.rules[0]).toMatchObject({ name: 'Browser', ruleSpec: 'Chrome,Firefox,Safari' });
    expect(parser.testDataRules.rules[1]).toMatchObject({ name: 'Status', ruleSpec: 'enum("Open","Closed")' });
    expect(parser.testDataRules.rules[2]).toMatchObject({ name: 'Name', ruleSpec: 'person.fullName' });
    expect(parser.getSchemaTokens().every((token) => token.kind !== 'rule' || token.inline === true)).toBe(true);
  });

  test('flags an empty rule definition line', () => {
    const inputText = `Name
`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(false);
    expect(parser.errors).toContainEqual(
      expect.objectContaining({
        code: 'missing_rule_definition',
        column: 'Name',
      })
    );
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
    expect(parser.errors).toContainEqual(
      expect.objectContaining({
        code: 'invalid_schema_pairing',
      })
    );
    expect(parser.testDataRules.rules).toHaveLength(0);
  });

  test('rejects blank lines between header and rule definition', () => {
    const parser = new RulesParser(faker, RandExp);
    parser.parseText('Priority\n\nenum(high,medium,low)');

    expect(parser.isValid()).toBe(false);
    expect(parser.errors).toContainEqual(
      expect.objectContaining({
        code: 'missing_rule_definition',
        column: 'Priority',
      })
    );
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

  test('preserves inline pict-style rules when rebuilding from parsed tokens', () => {
    const inputText = `# compact
Priority: enum(high,medium,low)
Status: person.jobTitle`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.renderSpecFromRulesWithTokens(parser.testDataRules.rules)).toBe(inputText);
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

  test('parses IF THEN constraints and preserves them as schema tokens', () => {
    const inputText = `Status
enum(active,inactive)
Result
enum(pass,fail)

IF [Status] = "inactive" THEN [Result] = "fail" ENDIF`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.testDataRules.constraints).toHaveLength(1);
    expect(parser.testDataRules.constraints[0]).toMatchObject({
      terminator: 'ENDIF',
      referencedParameters: ['Status', 'Result'],
    });
    expect(parser.getSchemaTokens().some((token) => token.kind === 'constraint')).toBe(true);
    expect(parser.renderSpecFromRulesWithTokens(parser.testDataRules.rules)).toBe(inputText);
  });

  test('does not treat IF-prefixed field names as constraints', () => {
    const inputText = `IF Condition
enum(yes,no)
Status
enum(open,closed)`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.errors).toHaveLength(0);
    expect(parser.testDataRules.rules).toHaveLength(2);
    expect(parser.testDataRules.rules[0].name).toBe('IF Condition');
    expect(parser.testDataRules.rules[0].ruleSpec).toBe('enum(yes,no)');
    expect(parser.testDataRules.constraints).toHaveLength(0);
  });

  test('does not treat non-rule colon lines as inline pict definitions', () => {
    const inputText = `Environment: Browser
enum(chrome,firefox)`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.testDataRules.rules).toHaveLength(1);
    expect(parser.testDataRules.rules[0]).toMatchObject({
      name: 'Environment: Browser',
      ruleSpec: 'enum(chrome,firefox)',
    });
  });

  test('does not treat ENDIF inside a parameter reference as the constraint terminator', () => {
    const inputText = `ENDIF
enum(yes,no)
Status
enum(open,closed)

IF [Status] = "open" THEN [ENDIF] = "yes" ENDIF`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.errors).toHaveLength(0);
    expect(parser.testDataRules.rules).toHaveLength(2);
    expect(parser.testDataRules.constraints).toHaveLength(1);
    expect(parser.testDataRules.constraints[0]).toMatchObject({
      terminator: 'ENDIF',
      referencedParameters: ['Status', 'ENDIF'],
    });
  });

  test('handles doubled backslashes before quotes when scanning for a constraint terminator', () => {
    const inputText = `Column One
enum("a\\\\","b")
Column Two
enum(yes,no)

IF [Column One] = "a\\\\" THEN [Column Two] = "yes";
Status
enum(active,inactive)`;

    const parser = new RulesParser(faker, RandExp);
    parser.parseText(inputText);

    expect(parser.isValid()).toBe(true);
    expect(parser.errors).toHaveLength(0);
    expect(parser.testDataRules.rules).toHaveLength(3);
    expect(parser.testDataRules.constraints).toHaveLength(1);
    expect(parser.testDataRules.constraints[0]).toMatchObject({
      terminator: ';',
      referencedParameters: ['Column One', 'Column Two'],
    });
    expect(parser.testDataRules.rules[2].name).toBe('Status');
    expect(parser.testDataRules.rules[2].ruleSpec).toBe('enum(active,inactive)');
  });
});
