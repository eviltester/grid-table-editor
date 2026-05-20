import {
  parseSchemaTextToRows,
  addSchemaRowAfter,
  removeSchemaRowAt,
  moveSchemaRow,
} from '../../../js/gui_components/shared/test-data/schema-controller.js';
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
});
