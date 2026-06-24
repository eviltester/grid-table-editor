import { EnumParser } from '../../../../../js/data_generation/utils/enumParser.js';

const ENUM_SURFACES = [
  ['implicit comma-separated list', 'active,inactive,pending', false, 'implicit-csv'],
  ['quoted comma-separated list', '"active","inactive","pending"', false, 'implicit-csv'],
  ['parenthesized comma-separated list', '(active,inactive,pending)', true, 'parenthesized-list'],
  ['enum shorthand', 'enum active,inactive,pending', true, 'shorthand'],
  ['enum function', 'enum("active","inactive","pending")', true, 'function'],
  ['enum named values function', 'enum(values="active,inactive,pending")', true, 'function'],
  ['datatype enum function', 'datatype.enum("active","inactive","pending")', true, 'function'],
  ['datatype enum named values function', 'datatype.enum(values="active,inactive,pending")', true, 'function'],
  ['awd datatype enum function', 'awd.datatype.enum("active","inactive","pending")', true, 'function'],
  ['awd datatype enum named values function', 'awd.datatype.enum(values="active,inactive,pending")', true, 'function'],
];

describe('EnumParser shared enum surface parser', () => {
  test.each(ENUM_SURFACES)('parses %s', (_label, ruleSpec, explicit, source) => {
    expect(EnumParser.parseEnumRuleSpec(ruleSpec)).toEqual({
      ok: true,
      values: ['active', 'inactive', 'pending'],
      explicit,
      source,
      error: '',
    });
  });

  test('keeps compiler-oriented detection compatible with previous implicit enum heuristics', () => {
    expect(EnumParser.isEnumRuleSpec('active,inactive,pending')).toBe(true);
    expect(EnumParser.isEnumRuleSpec('person.firstName,person.lastName')).toBe(false);
    expect(EnumParser.isEnumRuleSpec('[A-Z],{3}')).toBe(false);
    expect(EnumParser.isEnumRuleSpec('(active,inactive,pending)')).toBe(false);
    expect(EnumParser.isEnumRuleSpec('(active,inactive,pending)', { includeParenthesizedList: true })).toBe(true);
  });

  test('reports malformed explicit enum invocations without classifying arbitrary text as enum', () => {
    expect(EnumParser.parseEnumRuleSpec('datatype.enum(unclosed')).toMatchObject({
      ok: false,
      explicit: true,
      source: 'function',
      error: 'Invalid enum format',
    });
    expect(EnumParser.isEnumRuleSpec('datatype.enum(unclosed')).toBe(true);
    expect(EnumParser.parseEnumRuleSpec('SingleValue')).toMatchObject({
      ok: false,
      explicit: false,
      source: '',
    });
    expect(EnumParser.isEnumRuleSpec('SingleValue')).toBe(false);
  });

  test('builds canonical internal and public enum rule specs from values or rule text', () => {
    expect(EnumParser.buildCanonicalDomainRuleSpec(['active', 'inactive', 'pending'])).toBe(
      'datatype.enum("active", "inactive", "pending")'
    );
    expect(EnumParser.buildCanonicalDomainRuleSpec('enum(values="active,inactive,pending")')).toBe(
      'datatype.enum("active", "inactive", "pending")'
    );
    expect(EnumParser.buildCanonicalSchemaRuleSpec('awd.datatype.enum("active","inactive","pending")')).toBe(
      'enum(active,inactive,pending)'
    );
  });

  test('extracts display values for UI enum fields without changing the authored list shape', () => {
    expect(EnumParser.extractEnumDisplayValue('datatype.enum(active,inactive,pending)')).toBe(
      'active,inactive,pending'
    );
    expect(EnumParser.extractEnumDisplayValue('enum active,inactive,pending')).toBe('active,inactive,pending');
    expect(EnumParser.extractEnumDisplayValue('(active,inactive,pending)')).toBe('active,inactive,pending');
    expect(EnumParser.buildSchemaRuleSpecFromInput('("active","inactive","pending")')).toBe(
      'enum("active","inactive","pending")'
    );
  });
});
