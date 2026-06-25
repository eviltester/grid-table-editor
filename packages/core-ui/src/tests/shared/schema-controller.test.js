import {
  parseSchemaTextToRows,
  addSchemaRowAfter,
  removeSchemaRowAt,
  moveSchemaRow,
  moveSchemaRowToIndex,
  createSchemaEditingSession,
} from '../../../js/gui_components/shared/test-data/schema/schema-controller.js';
import { jest } from '@jest/globals';

describe('schema-controller', () => {
  test('parseSchemaTextToRows maps parsed rules and preserves tokens', () => {
    const parser = jest.fn().mockReturnValue({
      dataRules: [{ name: 'First', ruleSpec: 'person.firstName()', type: 'faker' }],
      errors: [],
      schemaTokens: [{ kind: 'rule' }],
    });

    const result = parseSchemaTextToRows({
      schemaTextToDataRules: parser,
      schemaText: 'First\nperson.firstName()',
      faker: {},
      RandExp: function RandExp() {},
      mapRuleToRow: (rule, leadingTextLines) => ({
        name: rule.name,
        sourceType: rule.type,
        value: rule.ruleSpec,
        leadingTextLines,
      }),
    });

    expect(result.errors).toEqual([]);
    expect(result.tokens).toEqual([{ kind: 'rule' }]);
    expect(result.rows).toEqual([
      {
        name: 'First',
        sourceType: 'faker',
        value: 'person.firstName()',
        leadingTextLines: [],
      },
    ]);
  });

  test('parseSchemaTextToRows blocks structural parse errors even when partial rows were parsed', () => {
    const parser = jest.fn().mockReturnValue({
      dataRules: [{ name: 'A', ruleSpec: 'literal(a)', type: 'literal' }],
      errors: [{ code: 'missing_rule_definition', message: 'column B requires a data definition' }],
      schemaTokens: [{ kind: 'rule' }],
    });

    const result = parseSchemaTextToRows({
      schemaTextToDataRules: parser,
      schemaText: 'A\nliteral(a)\n\nB',
      faker: {},
      RandExp: function RandExp() {},
      mapRuleToRow: (rule) => ({
        name: rule.name,
        sourceType: rule.type,
        value: rule.ruleSpec,
      }),
    });

    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual([
      { code: 'missing_rule_definition', message: 'column B requires a data definition' },
    ]);
  });

  test('parseSchemaTextToRows preserves compiler validation errors with mapped row context', () => {
    const parser = jest.fn().mockReturnValue({
      dataRules: [{ name: 'Status', ruleSpec: 'datatype.enum()', type: 'domain' }],
      errors: [
        {
          code: 'compiler_validation_error',
          message: 'Status failed domain validation - Invalid keyword arguments: argument "values" is required',
        },
      ],
      schemaTokens: [{ kind: 'rule', rule: 'datatype.enum()' }],
    });

    const result = parseSchemaTextToRows({
      schemaTextToDataRules: parser,
      schemaText: 'Status\ndatatype.enum()',
      faker: {},
      RandExp: function RandExp() {},
      mapRuleToRow: (rule) => ({
        name: rule.name,
        sourceType: rule.type,
        value: rule.ruleSpec,
      }),
    });

    expect(result.rows).toEqual([
      {
        name: 'Status',
        sourceType: 'domain',
        value: 'datatype.enum()',
      },
    ]);
    expect(result.errors).toEqual([
      {
        code: 'compiler_validation_error',
        message: 'Status failed domain validation - Invalid keyword arguments: argument "values" is required',
      },
    ]);
  });

  test('row mutation helpers add remove and move rows immutably', () => {
    const blank = () => ({ name: '', sourceType: 'regex', value: '' });
    const baseRows = [{ name: 'A' }, { name: 'B' }];

    expect(addSchemaRowAfter(baseRows, 0, blank).map((row) => row.name)).toEqual(['A', '', 'B']);
    expect(removeSchemaRowAt([{ name: 'Only' }], 0, blank)).toEqual([blank()]);
    expect(moveSchemaRow(baseRows, 1, -1).map((row) => row.name)).toEqual(['B', 'A']);
    expect(moveSchemaRowToIndex([{ name: 'A' }, { name: 'B' }, { name: 'C' }], 2, 0).map((row) => row.name)).toEqual([
      'C',
      'A',
      'B',
    ]);
  });

  test('schema editing session toggles text mode, syncs rows, and preserves trailing tokens', () => {
    const blank = () => ({
      name: '',
      sourceType: 'regex',
      command: '',
      params: '',
      value: '',
      comments: '',
    });
    const schemaTextToDataRules = jest.fn().mockReturnValueOnce({
      dataRules: [{ name: 'Status', ruleSpec: 'enum(active,inactive)', type: 'enum' }],
      errors: [],
      schemaTokens: [{ kind: 'rule' }],
    });
    const session = createSchemaEditingSession({
      createBlankSchemaRow: blank,
      schemaTextToDataRules,
      faker: {},
      RandExp: function RandExp() {},
      mapRuleToRow: (rule, leadingTextLines) => ({
        name: rule.name,
        sourceType: rule.type,
        value: rule.ruleSpec,
        comments: leadingTextLines.join('\n'),
      }),
      schemaRowsToSpecWithTokens: jest.fn(() => 'Name\nperson.firstName()\n# trailing'),
      initialRows: [{ name: 'Name', sourceType: 'faker', command: 'person.firstName', params: '', value: '' }],
      initialTokens: [{ kind: 'comment', text: '# trailing' }],
    });

    const textToggle = session.toggleMode();
    expect(textToggle).toMatchObject({
      ok: true,
      schemaText: 'Name\nperson.firstName()\n# trailing',
      isTextMode: true,
    });

    const syncResult = session.syncRowsFromText({
      schemaText: 'Status\nenum(active,inactive)',
      preserveEmptyRows: false,
    });

    expect(syncResult.errors).toEqual([]);
    expect(session.getRows()).toEqual([
      { name: 'Status', sourceType: 'enum', value: 'enum(active,inactive)', comments: '' },
    ]);
    expect(session.getTokens()).toEqual([{ kind: 'rule' }]);

    session.setTokens([{ kind: 'rule' }, { kind: 'blank', text: '' }, { kind: 'comment', text: '# trailing note' }]);
    session.addRowAfterIndex(0);
    expect(session.getRows()[1]).toMatchObject({
      comments: '\n# trailing note',
    });
    expect(session.getTokens()).toEqual([]);

    session.setRows([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    session.moveRowToIndex(2, 0);
    expect(session.getRows().map((row) => row.name)).toEqual(['C', 'A', 'B']);
  });

  test('schema editing session does not leave text mode when partial text has structural parse errors', () => {
    const blank = () => ({
      name: '',
      sourceType: 'regex',
      command: '',
      params: '',
      value: '',
      comments: '',
    });
    const schemaTextToDataRules = jest.fn().mockReturnValue({
      dataRules: [{ name: 'A', ruleSpec: 'literal(a)', type: 'literal' }],
      errors: [{ code: 'missing_rule_definition', message: 'column B requires a data definition' }],
      schemaTokens: [{ kind: 'rule' }],
    });
    const session = createSchemaEditingSession({
      createBlankSchemaRow: blank,
      schemaTextToDataRules,
      faker: {},
      RandExp: function RandExp() {},
      mapRuleToRow: (rule) => ({
        name: rule.name,
        sourceType: rule.type,
        value: rule.ruleSpec,
      }),
      schemaRowsToSpecWithTokens: jest.fn(() => 'A\nliteral(a)\n\nB'),
      initialRows: [{ name: 'A', sourceType: 'literal', value: 'a' }],
      initialTextMode: true,
    });

    const result = session.toggleMode({ schemaText: 'A\nliteral(a)\n\nB' });

    expect(result).toMatchObject({
      ok: false,
      errors: [{ code: 'missing_rule_definition', message: 'column B requires a data definition' }],
    });
    expect(session.getTextMode()).toBe(true);
    expect(session.getRows()).toEqual([{ name: 'A', sourceType: 'literal', value: 'a' }]);
  });

  test('schema editing session does not apply rows or leave text mode when text has compiler validation errors', () => {
    const blank = () => ({
      name: '',
      sourceType: 'regex',
      command: '',
      params: '',
      value: '',
      comments: '',
    });
    const schemaTextToDataRules = jest.fn().mockReturnValue({
      dataRules: [{ name: 'Status', ruleSpec: 'datatype.enum()', type: 'domain' }],
      errors: [
        {
          code: 'compiler_validation_error',
          message: 'Status failed domain validation - Invalid keyword arguments: argument "values" is required',
        },
      ],
      schemaTokens: [{ kind: 'rule' }],
    });
    const session = createSchemaEditingSession({
      createBlankSchemaRow: blank,
      schemaTextToDataRules,
      faker: {},
      RandExp: function RandExp() {},
      mapRuleToRow: (rule) => ({
        name: rule.name,
        sourceType: rule.type,
        value: rule.ruleSpec,
      }),
      schemaRowsToSpecWithTokens: jest.fn(() => 'Status\ndatatype.enum()'),
      initialRows: [{ name: 'Previous', sourceType: 'literal', value: 'ok' }],
      initialTextMode: true,
    });

    const syncResult = session.syncRowsFromText({
      schemaText: 'Status\ndatatype.enum()',
      preserveEmptyRows: false,
    });
    const toggleResult = session.toggleMode({ schemaText: 'Status\ndatatype.enum()' });

    expect(syncResult.errors).toEqual([
      {
        code: 'compiler_validation_error',
        message: 'Status failed domain validation - Invalid keyword arguments: argument "values" is required',
      },
    ]);
    expect(syncResult.rows).toEqual([{ name: 'Status', sourceType: 'domain', value: 'datatype.enum()' }]);
    expect(toggleResult.ok).toBe(false);
    expect(session.getTextMode()).toBe(true);
    expect(session.getRows()).toEqual([{ name: 'Previous', sourceType: 'literal', value: 'ok' }]);
  });
});
