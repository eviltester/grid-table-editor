import {
  countEnumSchemaRows,
  hasMinimumEnumColumns,
  isNWiseEligibleForSchemaRows,
  isPairwiseEligibleForDataRules,
} from '../../../js/gui_components/shared/test-data/generation/ui-derived-state.js';

describe('ui-derived-state', () => {
  test('counts enum schema rows and applies minimum threshold', () => {
    const rows = [{ sourceType: 'enum' }, { sourceType: 'regex' }, { sourceType: 'enum' }];

    expect(countEnumSchemaRows(rows)).toBe(2);
    expect(hasMinimumEnumColumns(2)).toBe(true);
    expect(isNWiseEligibleForSchemaRows(rows)).toBe(true);
  });

  test('treats domain datatype.enum rows as enum-capable for n-wise eligibility', () => {
    const rows = [
      { sourceType: 'domain', command: 'datatype.enum', params: 'active,inactive,pending' },
      { sourceType: 'enum', value: 'enum(high,low)' },
    ];

    expect(countEnumSchemaRows(rows)).toBe(2);
    expect(isNWiseEligibleForSchemaRows(rows)).toBe(true);
  });

  test('checks pairwise eligibility from parsed rules', () => {
    expect(isPairwiseEligibleForDataRules([{ type: 'enum' }, { type: 'regex' }])).toBe(false);
    expect(isPairwiseEligibleForDataRules([{ type: 'enum' }, { type: 'enum' }])).toBe(true);
  });
});
