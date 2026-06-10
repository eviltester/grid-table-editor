import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '../../../js/data_generation/schema-rules-adapter.js';

describe('schema rules adapter', () => {
  test('returns dataRules for valid schema text', () => {
    const result = schemaTextToDataRules({
      schemaText: 'Name\nperson.fullName\nStatus\nenum(active,inactive)',
      faker,
      RandExp,
    });

    expect(result.errors).toEqual([]);
    expect(result.dataRules).toHaveLength(2);
    expect(result.dataRules[0].name).toBe('Name');
    expect(result.dataRules[1].name).toBe('Status');
  });

  test('can return invalid compiled rules for known domain keywords when requested', () => {
    const result = schemaTextToDataRules({
      schemaText: 'Name\nperson.fullName(10)',
      faker,
      RandExp,
      includeInvalidRules: true,
    });

    expect(result.errors).toEqual([
      expect.objectContaining({
        code: 'compiler_validation_error',
      }),
    ]);
    expect(result.dataRules).toEqual([
      expect.objectContaining({
        name: 'Name',
        ruleSpec: 'person.fullName(10)',
        type: 'domain',
      }),
    ]);
  });

  test('returns errors for invalid schema text', () => {
    const result = schemaTextToDataRules({
      schemaText: 't1\n',
      faker,
      RandExp,
    });

    expect(result.dataRules).toEqual([]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe('missing_rule_definition');
    expect(result.errors[0].column).toBe('t1');
    expect(result.errors[0].message).toBe('column t1 requires a data definition, use \'literal("")\' for blank data');
  });

  test('returns invalid schema pairing for comment-only schema text', () => {
    const result = schemaTextToDataRules({
      schemaText: '# only a comment\n\n# still only comments',
      faker,
      RandExp,
    });

    expect(result.dataRules).toEqual([]);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: 'invalid_schema_pairing',
      })
    );
  });

  test('renders data rules to schema text preserving blank literal wrapper', () => {
    const rendered = dataRulesToSchemaText({
      dataRules: [
        { name: 't1', ruleSpec: 'literal("")', comments: '' },
        { name: 't2', ruleSpec: 'literal(   123)', comments: '' },
      ],
    });

    expect(rendered.errors).toEqual([]);
    expect(rendered.text).toBe('t1\nliteral("")\nt2\nliteral(   123)');
  });

  test('prefers schema tokens when rendering so blank lines are preserved', () => {
    const rendered = dataRulesToSchemaText({
      dataRules: [
        { name: 'Priority', ruleSpec: 'enum(high,medium,low)', comments: '# old comment' },
        { name: 'Status', ruleSpec: 'enum(active,inactive,pending)', comments: '' },
      ],
      schemaTokens: [
        { kind: 'comment', text: '# top' },
        { kind: 'blank', text: '' },
        { kind: 'rule' },
        { kind: 'blank', text: '' },
        { kind: 'blank', text: '' },
        { kind: 'rule' },
      ],
    });

    expect(rendered.errors).toEqual([]);
    expect(rendered.text).toBe('# top\n\nPriority\nenum(high,medium,low)\n\n\nStatus\nenum(active,inactive,pending)');
  });

  test('parses and round-trips schema constraints preserving the authored terminator', () => {
    const schemaText = `Priority
enum(high,low)
Status
enum(open,closed)

IF [Priority] = "high" THEN [Status] = "open" ENDIF`;

    const parsed = schemaTextToDataRules({
      schemaText,
      faker,
      RandExp,
    });

    expect(parsed.errors).toEqual([]);
    expect(parsed.constraints).toHaveLength(1);
    expect(parsed.constraints[0]).toMatchObject({
      terminator: 'ENDIF',
      referencedParameters: ['Priority', 'Status'],
    });

    const rendered = dataRulesToSchemaText({
      dataRules: parsed.dataRules,
      schemaTokens: parsed.schemaTokens,
      constraints: parsed.constraints,
    });

    expect(rendered.text).toBe(schemaText);
  });

  test('reports invalid enum values used in constraints', () => {
    const parsed = schemaTextToDataRules({
      schemaText: `Priority
enum(high,low)
Status
enum(open,closed)

IF [Priority] = "urgent" THEN [Status] = "open" ENDIF`,
      faker,
      RandExp,
    });

    expect(parsed.dataRules).toEqual([]);
    expect(parsed.errors).toContainEqual(
      expect.objectContaining({
        code: 'invalid_constraint_enum_value',
        parameterName: 'Priority',
      })
    );
  });

  test('reports invalid regex values used in constraints', () => {
    const parsed = schemaTextToDataRules({
      schemaText: `Ticket
[A-Z]{3}-\\d{4}

IF [Ticket] = "bob" THEN [Ticket] <> "xyz" ENDIF`,
      faker,
      RandExp,
    });

    expect(parsed.dataRules).toEqual([]);
    expect(parsed.errors).toContainEqual(
      expect.objectContaining({
        code: 'invalid_constraint_regex_value',
        parameterName: 'Ticket',
      })
    );
  });

  test('keeps invalid regex rule errors stable when constraints reference the same column', () => {
    const parsed = schemaTextToDataRules({
      schemaText: `Ticket
regex([)

IF [Ticket] = "ABC-1234" THEN [Ticket] <> "XYZ-9999" ENDIF`,
      faker,
      RandExp,
    });

    expect(parsed.dataRules).toEqual([]);
    expect(() => parsed.errors).not.toThrow();
    expect(parsed.errors).toContainEqual(
      expect.objectContaining({
        code: 'compiler_validation_error',
        column: 'Ticket',
      })
    );
  });

  test('converts schema rows to data rules with canonical validation errors', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [
        { name: '', sourceType: 'regex', value: '[0-9]' },
        { name: 'First', sourceType: 'faker', command: '' },
      ],
    });

    expect(result.dataRules).toEqual([]);
    expect(result.errors.map((error) => error.code)).toEqual(['missing_column_name', 'missing_faker_command']);
  });

  test('reports missing domain command for domain rows', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [{ name: 'First', sourceType: 'domain', command: '' }],
    });
    expect(result.dataRules).toEqual([]);
    expect(result.errors.map((error) => error.code)).toEqual(['missing_domain_command']);
  });

  test('reports helpers_not_supported_in_domain for domain helper commands', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [{ name: 'First', sourceType: 'domain', command: 'helpers.fake', params: '("x")' }],
    });
    expect(result.dataRules).toEqual([]);
    expect(result.errors.map((error) => error.code)).toEqual(['helpers_not_supported_in_domain']);
    expect(result.errors.map((error) => error.message)).toEqual([
      'Row 1: helpers.* is faker-only; use faker.helpers.*',
    ]);
  });

  test('returns missing schema rows error for empty schema row list', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [],
    });

    expect(result.dataRules).toEqual([]);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: 'missing_schema_rows',
      })
    );
  });

  test('converts valid schema rows to data rules', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [
        { name: 'A', sourceType: 'literal', value: 'literal(   123)' },
        { name: 'B', sourceType: 'faker', command: 'word.noun', params: '()' },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.dataRules).toEqual([
      { name: 'A', ruleSpec: 'literal(   123)', comments: '', type: 'literal' },
      { name: 'B', ruleSpec: 'word.noun()', comments: '', type: 'faker' },
    ]);
  });

  test('converts valid domain schema rows to data rules', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [{ name: 'A', sourceType: 'domain', command: 'number.int', params: '(1,10)' }],
    });
    expect(result.errors).toEqual([]);
    expect(result.dataRules).toEqual([{ name: 'A', ruleSpec: 'number.int(1,10)', comments: '', type: 'domain' }]);
  });

  test('ignores fully blank rows when at least one real schema row exists', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [
        { name: 'Status', sourceType: 'literal', value: 'active' },
        { name: '', sourceType: 'regex', command: '', params: '', value: '', comments: '' },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.dataRules).toEqual([{ name: 'Status', ruleSpec: 'literal(active)', comments: '', type: 'literal' }]);
  });

  test('converts empty literal schema row value to literal("")', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [{ name: 'A', sourceType: 'literal', value: '   ' }],
    });

    expect(result.errors).toEqual([]);
    expect(result.dataRules).toEqual([{ name: 'A', ruleSpec: 'literal("")', comments: '', type: 'literal' }]);
  });

  test('converts empty regex schema row value to regex("")', () => {
    const result = schemaRowsToDataRules({
      schemaRows: [{ name: 'A', sourceType: 'regex', value: '   ' }],
    });

    expect(result.errors).toEqual([]);
    expect(result.dataRules).toEqual([{ name: 'A', ruleSpec: 'regex("")', comments: '', type: 'regex' }]);
  });
});
