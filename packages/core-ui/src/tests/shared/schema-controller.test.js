import {
  parseSchemaTextToRows,
  addSchemaRowAfter,
  removeSchemaRowAt,
  moveSchemaRow,
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

  test('row mutation helpers add remove and move rows immutably', () => {
    const blank = () => ({ name: '', sourceType: 'regex', value: '' });
    const baseRows = [{ name: 'A' }, { name: 'B' }];

    expect(addSchemaRowAfter(baseRows, 0, blank).map((row) => row.name)).toEqual(['A', '', 'B']);
    expect(removeSchemaRowAt([{ name: 'Only' }], 0, blank)).toEqual([blank()]);
    expect(moveSchemaRow(baseRows, 1, -1).map((row) => row.name)).toEqual(['B', 'A']);
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
  });
});
