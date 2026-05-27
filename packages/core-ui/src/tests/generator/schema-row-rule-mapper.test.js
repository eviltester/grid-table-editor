import {
  SOURCE_TYPE_FAKER,
  SOURCE_TYPE_DOMAIN,
  SOURCE_TYPE_REGEX,
  SOURCE_TYPE_LITERAL,
  SOURCE_TYPE_ENUM,
  normaliseSourceType,
  normaliseFakerCommand,
  normaliseDomainCommand,
  buildRuleSpecFromSchemaRow,
  extractLiteralValueFromRuleSpec,
  extractRegexValueFromRuleSpec,
  extractEnumValueFromRuleSpec,
  buildDataRuleFromSchemaRow,
} from '../../../js/gui_components/shared/schema-row-rule-mapper.js';

describe('schema-row-rule-mapper', () => {
  test('exports source type constants', () => {
    expect(SOURCE_TYPE_FAKER).toBe('faker');
    expect(SOURCE_TYPE_DOMAIN).toBe('domain');
    expect(SOURCE_TYPE_REGEX).toBe('regex');
    expect(SOURCE_TYPE_LITERAL).toBe('literal');
    expect(SOURCE_TYPE_ENUM).toBe('enum');
  });

  test('normaliseSourceType returns supported values and defaults to regex', () => {
    expect(normaliseSourceType(' FAKER ')).toBe('faker');
    expect(normaliseSourceType('domain')).toBe('domain');
    expect(normaliseSourceType('literal')).toBe('literal');
    expect(normaliseSourceType('unknown')).toBe('regex');
    expect(normaliseSourceType('')).toBe('regex');
  });

  test('normaliseFakerCommand strips faker prefix', () => {
    expect(normaliseFakerCommand('faker.person.firstName')).toBe('person.firstName');
    expect(normaliseFakerCommand('person.firstName')).toBe('person.firstName');
  });

  test('normaliseDomainCommand trims only', () => {
    expect(normaliseDomainCommand(' number.int ')).toBe('number.int');
  });

  test('buildRuleSpecFromSchemaRow handles faker and domain rows', () => {
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'faker', command: 'faker.person.firstName', params: '()' })).toBe(
      'person.firstName()'
    );
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'domain', command: 'number.int', params: '(1,10)' })).toBe(
      'number.int(1,10)'
    );
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'domain', command: 'datatype.enum', params: 'a,raw,list' })).toBe(
      'enum(a,raw,list)'
    );
    expect(
      buildRuleSpecFromSchemaRow({ sourceType: 'domain', command: 'datatype.enum', params: '(a,bracketed,list)' })
    ).toBe('enum(a,bracketed,list)');
    expect(
      buildRuleSpecFromSchemaRow({
        sourceType: 'domain',
        command: 'datatype.enum',
        params: '("a","quoted","bracketed","list")',
      })
    ).toBe('enum("a","quoted","bracketed","list")');
  });

  test('buildRuleSpecFromSchemaRow handles literal rows including blank default', () => {
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'literal', value: 'Fixed' })).toBe('literal(Fixed)');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'literal', value: '   ' })).toBe('literal("")');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'literal', value: 'literal(abc)' })).toBe('literal(abc)');
  });

  test('buildRuleSpecFromSchemaRow handles regex rows including blank named default', () => {
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'regex', value: '[A-Z]{3}' })).toBe('[A-Z]{3}');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'regex', name: 'Code', value: '   ' })).toBe('regex("")');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'regex', value: 'regex("[A-Z]{3}")' })).toBe('regex("[A-Z]{3}")');
  });

  test('buildRuleSpecFromSchemaRow handles enum rows including wrapper', () => {
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'enum', value: '1,2,3' })).toBe('enum(1,2,3)');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'enum', value: 'enum(a,b)' })).toBe('enum(a,b)');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'enum', value: 'enum a,b,c' })).toBe('enum(a,b,c)');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'enum', value: '(a,b,c)' })).toBe('enum(a,b,c)');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'enum', value: '"a","b","c"' })).toBe('enum("a","b","c")');
    expect(buildRuleSpecFromSchemaRow({ sourceType: 'enum', value: '   ' })).toBe('');
  });

  test('extractEnumValueFromRuleSpec unwraps enum aliases and shorthand', () => {
    expect(extractEnumValueFromRuleSpec('enum(a,b,c)')).toBe('a,b,c');
    expect(extractEnumValueFromRuleSpec('datatype.enum(active,inactive,pending)')).toBe('active,inactive,pending');
    expect(extractEnumValueFromRuleSpec('enum active,inactive,pending')).toBe('active,inactive,pending');
    expect(extractEnumValueFromRuleSpec('(a,b,c)')).toBe('a,b,c');
  });

  test('extractLiteralValueFromRuleSpec unwraps literal aliases and keeps plain text', () => {
    expect(extractLiteralValueFromRuleSpec('literal(Fixed)')).toBe('Fixed');
    expect(extractLiteralValueFromRuleSpec('datatype.literal(123)')).toBe('123');
    expect(extractLiteralValueFromRuleSpec('awd.datatype.literal(value)')).toBe('value');
    expect(extractLiteralValueFromRuleSpec('literal("")')).toBe('');
    expect(extractLiteralValueFromRuleSpec('plain')).toBe('plain');
  });

  test('extractRegexValueFromRuleSpec unwraps regex aliases and keeps plain text', () => {
    expect(extractRegexValueFromRuleSpec('regex("[A-Z]{3}")')).toBe('"[A-Z]{3}"');
    expect(extractRegexValueFromRuleSpec('datatype.regex(\\d{2})')).toBe('\\d{2}');
    expect(extractRegexValueFromRuleSpec('awd.datatype.regex(x+)')).toBe('x+');
    expect(extractRegexValueFromRuleSpec('regex("")')).toBe('');
    expect(extractRegexValueFromRuleSpec('plain')).toBe('plain');
  });

  test('buildDataRuleFromSchemaRow returns null for fully blank row', () => {
    expect(buildDataRuleFromSchemaRow({ name: '', sourceType: 'regex', value: '' })).toBeNull();
  });

  test('buildDataRuleFromSchemaRow builds rule object with comments and leading text lines', () => {
    expect(
      buildDataRuleFromSchemaRow({
        name: 'Priority',
        sourceType: 'enum',
        value: 'high,medium,low',
        comments: 'important',
        leadingTextLines: ['# comment', ''],
      })
    ).toEqual({
      name: 'Priority',
      ruleSpec: 'enum(high,medium,low)',
      comments: 'important',
      leadingTextLines: ['# comment', ''],
    });
  });
});
