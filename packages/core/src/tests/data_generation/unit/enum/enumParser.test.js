import { EnumParser } from '../../../../../js/data_generation/utils/enumParser.js';
import { EnumTestDataRuleValidator } from '../../../../../js/data_generation/enum/enumTestDataRuleValidator.js';
import { TestDataRule } from '../../../../../js/data_generation/testDataRule.js';

const VALID_ENUM_RULE_SPECS = [
  {
    label: 'schema shorthand CSV literal',
    ruleSpec: 'active,inactive,pending',
    values: ['active', 'inactive', 'pending'],
    explicit: false,
    source: 'implicit-csv',
  },
  {
    label: 'schema shorthand quoted CSV literal',
    ruleSpec: 'active,"needs space",pending',
    values: ['active', 'needs space', 'pending'],
    explicit: false,
    source: 'implicit-csv',
  },
  {
    label: 'schema shorthand CSV literal with doubled quote escaping',
    ruleSpec: 'active,"needs ""quote",pending',
    values: ['active', 'needs "quote', 'pending'],
    explicit: false,
    source: 'implicit-csv',
  },
  {
    label: 'single positional CSV string',
    ruleSpec: 'enum("active,\\"needs space\\",pending")',
    values: ['active', 'needs space', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'multiple positional strings',
    ruleSpec: 'enum("active", "needs space", "pending")',
    values: ['active', 'needs space', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'positional string array',
    ruleSpec: 'enum(["active", "needs space", "pending"])',
    values: ['active', 'needs space', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'named CSV string',
    ruleSpec: 'enum(csv="active,needs space,pending")',
    values: ['active', 'needs space', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'named string array',
    ruleSpec: 'enum(values=["active", "needs space", "pending"])',
    values: ['active', 'needs space', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'compatibility named CSV string through values',
    ruleSpec: 'enum(values="active,needs space,pending")',
    values: ['active', 'needs space', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'datatype enum named CSV string',
    ruleSpec: 'datatype.enum(csv="active,inactive,pending")',
    values: ['active', 'inactive', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'awd datatype enum named string array',
    ruleSpec: 'awd.datatype.enum(values=["active", "inactive", "pending"])',
    values: ['active', 'inactive', 'pending'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'single explicit quoted value',
    ruleSpec: 'enum("Open")',
    values: ['Open'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'single explicit numeric-looking string value',
    ruleSpec: 'enum("10")',
    values: ['10'],
    explicit: true,
    source: 'function',
  },
  {
    label: 'schema shorthand command-looking CSV literal',
    ruleSpec: 'person.firstName,person.lastName',
    values: ['person.firstName', 'person.lastName'],
    explicit: false,
    source: 'implicit-csv',
  },
  {
    label: 'schema shorthand regex-looking CSV literal',
    ruleSpec: '[A-Z],{3}',
    values: ['[A-Z]', '{3}'],
    explicit: false,
    source: 'implicit-csv',
  },
];

const ENUM_LIST_INPUT_FRAGMENTS = [
  {
    label: 'parenthesized comma-separated list',
    value: '(active,inactive,pending)',
    values: ['active', 'inactive', 'pending'],
    schemaRuleSpec: 'enum("active","inactive","pending")',
  },
  {
    label: 'quoted parenthesized comma-separated list',
    value: '("active","inactive","pending")',
    values: ['active', 'inactive', 'pending'],
    schemaRuleSpec: 'enum("active","inactive","pending")',
  },
];

const INVALID_ENUM_RULE_SPECS = [
  {
    label: 'blank input is not enum syntax',
    ruleSpec: '',
    explicit: false,
    source: '',
    error: 'Invalid enum format',
    enumRuleSpec: false,
  },
  {
    label: 'single value without explicit enum syntax falls through',
    ruleSpec: 'SingleValue',
    explicit: false,
    source: '',
    error: 'Invalid enum format',
    enumRuleSpec: false,
  },
  {
    label: 'non-enum command invocation with comma params is not enum CSV',
    ruleSpec: 'number.int(min=47, max=32)',
    explicit: false,
    source: '',
    error: 'Invalid enum format',
    enumRuleSpec: false,
  },
  {
    label: 'implicit CSV with an empty value is rejected as enum syntax',
    ruleSpec: 'active,,pending',
    explicit: false,
    source: 'implicit-csv',
    error: 'Enum values cannot be empty',
    enumRuleSpec: true,
  },
  {
    label: 'implicit CSV with an unclosed quote is rejected as enum syntax',
    ruleSpec: 'active,"pending',
    explicit: false,
    source: 'implicit-csv',
    error: 'Invalid enum CSV: unclosed quote',
    enumRuleSpec: true,
  },
  {
    label: 'enum shorthand is rejected',
    ruleSpec: 'enum active,inactive,pending',
    explicit: true,
    source: 'shorthand',
    error: 'Invalid enum format: use a CSV literal or enum("value1", "value2")',
    enumRuleSpec: true,
  },
  {
    label: 'bare values inside enum invocation are rejected',
    ruleSpec: 'enum(active,inactive,pending)',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes',
    enumRuleSpec: true,
  },
  {
    label: 'bare values inside datatype enum invocation are rejected',
    ruleSpec: 'datatype.enum(active,inactive,pending)',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes',
    enumRuleSpec: true,
  },
  {
    label: 'bare values inside awd datatype enum invocation are rejected',
    ruleSpec: 'awd.datatype.enum(active,inactive,pending)',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes',
    enumRuleSpec: true,
  },
  {
    label: 'function prefix without closing parenthesis is an invalid explicit enum',
    ruleSpec: 'datatype.enum(unclosed',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: bare values are not allowed; wrap strings in quotes',
    enumRuleSpec: true,
  },
  {
    label: 'function call with trailing text is an invalid explicit enum',
    ruleSpec: 'datatype.enum("active") trailing',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword invocation: unexpected trailing content',
    enumRuleSpec: true,
  },
  {
    label: 'empty enum invocation has no values',
    ruleSpec: 'enum()',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: argument "values" is required',
    enumRuleSpec: true,
  },
  {
    label: 'unknown named argument is rejected',
    ruleSpec: 'datatype.enum(valuez="active,pending")',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: unknown named argument "valuez"',
    enumRuleSpec: true,
  },
  {
    label: 'unclosed named values quote is rejected',
    ruleSpec: 'datatype.enum(values="active,pending)',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: unbalanced expression',
    enumRuleSpec: true,
  },
  {
    label: 'unclosed CSV quote is rejected',
    ruleSpec: 'datatype.enum(csv="active,\\"pending")',
    explicit: true,
    source: 'function',
    error: 'Invalid enum CSV: unclosed quote',
    enumRuleSpec: true,
  },
  {
    label: 'empty CSV value is rejected',
    ruleSpec: 'datatype.enum(csv="active,,pending")',
    explicit: true,
    source: 'function',
    error: 'Enum values cannot be empty',
    enumRuleSpec: true,
  },
  {
    label: 'non-string array value is rejected',
    ruleSpec: 'datatype.enum(values=["active", 10])',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: argument "values" must contain only strings',
    enumRuleSpec: true,
  },
  {
    label: 'empty array is rejected',
    ruleSpec: 'datatype.enum(values=[])',
    explicit: true,
    source: 'function',
    error: 'Invalid keyword arguments: argument "values" is required',
    enumRuleSpec: true,
  },
];

const INVALID_ENUM_VALUE_RULES = [
  {
    label: 'implicit enum type with one value',
    ruleSpec: 'OnlyOne',
    expectedError: 'Invalid enum format',
  },
  {
    label: 'implicit enum type with empty middle value',
    ruleSpec: 'One,,Three',
    expectedError: 'Enum values cannot be empty',
  },
  {
    label: 'explicit enum with trailing empty value',
    ruleSpec: 'enum("OnlyOne,")',
    expectedError: 'Enum values cannot be empty',
  },
  {
    label: 'explicit enum with empty middle value',
    ruleSpec: 'enum("One,,Two")',
    expectedError: 'Enum values cannot be empty',
  },
];

describe('EnumParser acceptance contract', () => {
  test.each(VALID_ENUM_RULE_SPECS)('parses valid $label', ({ ruleSpec, values, explicit, source }) => {
    expect(EnumParser.parseEnumRuleSpec(ruleSpec)).toEqual({
      ok: true,
      values,
      explicit,
      source,
      error: '',
    });
    expect(EnumParser.buildCanonicalDomainRuleSpec(ruleSpec)).toBe(
      `datatype.enum(${values.map((value) => JSON.stringify(value)).join(', ')})`
    );
    expect(EnumParser.buildCanonicalSchemaRuleSpec(ruleSpec)).toBe(
      `enum(${values.map((value) => JSON.stringify(value)).join(',')})`
    );
  });

  test.each(INVALID_ENUM_RULE_SPECS)(
    'reports invalid parser case: $label',
    ({ ruleSpec, explicit, source, error, enumRuleSpec }) => {
      expect(EnumParser.parseEnumRuleSpec(ruleSpec)).toEqual({
        ok: false,
        values: [],
        explicit,
        source,
        error,
      });
      expect(EnumParser.isEnumRuleSpec(ruleSpec)).toBe(enumRuleSpec);
    }
  );

  test.each(INVALID_ENUM_VALUE_RULES)('reports invalid enum values: $label', ({ ruleSpec, expectedError }) => {
    const rule = new TestDataRule('Status', ruleSpec);
    rule.type = 'enum';
    const validator = new EnumTestDataRuleValidator();

    expect(validator.validate(rule)).toBe(false);
    expect(validator.getValidationError()).toBe(expectedError);
  });

  test.each(ENUM_LIST_INPUT_FRAGMENTS)(
    'parses $label as an enum list input fragment, not a public schema rule spec',
    ({ value, values, schemaRuleSpec }) => {
      expect(EnumParser.parseEnumRuleSpec(value)).toMatchObject({
        ok: true,
        values,
        explicit: true,
        source: 'parenthesized-list',
      });
      expect(EnumParser.isEnumRuleSpec(value)).toBe(false);
      expect(EnumParser.isEnumRuleSpec(value, { includeParenthesizedList: true })).toBe(true);
      expect(EnumParser.isCanonicalSchemaSerializableEnumRuleSpec(value)).toBe(false);
      expect(EnumParser.buildSchemaRuleSpecFromInput(value)).toBe(schemaRuleSpec);
    }
  );

  test('treats valid comma-separated rule text as enum CSV before command or regex interpretation', () => {
    expect(EnumParser.isEnumRuleSpec('active,inactive,pending')).toBe(true);
    expect(EnumParser.isEnumRuleSpec('person.firstName,person.lastName')).toBe(true);
    expect(EnumParser.isEnumRuleSpec('[A-Z],{3}')).toBe(true);
    expect(EnumParser.isEnumRuleSpec('(active,inactive,pending)')).toBe(false);
    expect(EnumParser.isEnumRuleSpec('(active,inactive,pending)', { includeParenthesizedList: true })).toBe(true);
  });

  test('extracts display values for UI enum fields without changing the authored list shape', () => {
    expect(EnumParser.extractEnumDisplayValue('datatype.enum("active","inactive","pending")')).toBe(
      'active,inactive,pending'
    );
    expect(EnumParser.extractEnumDisplayValue('datatype.enum("active, running"," inactive ")')).toBe(
      '"active, running"," inactive "'
    );
    expect(EnumParser.extractEnumDisplayValue('enum active,inactive,pending')).toBe('active,inactive,pending');
    expect(EnumParser.extractEnumDisplayValue('(active,inactive,pending)')).toBe('active,inactive,pending');
    expect(EnumParser.buildSchemaRuleSpecFromInput('("active","inactive","pending")')).toBe(
      'enum("active","inactive","pending")'
    );
  });
});
