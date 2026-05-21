import {
  countEnumSchemaRows,
  hasMinimumEnumColumns,
  isPairwiseEligibleForSchemaRows,
  isPairwiseEligibleForDataRules,
} from '../../../js/gui_components/shared/test-data/generation/ui-derived-state.js';

describe('ui-derived-state', () => {
  test('counts enum schema rows and applies minimum threshold', () => {
    const rows = [{ sourceType: 'enum' }, { sourceType: 'regex' }, { sourceType: 'enum' }];

    expect(countEnumSchemaRows(rows)).toBe(2);
    expect(hasMinimumEnumColumns(2)).toBe(true);
    expect(isPairwiseEligibleForSchemaRows(rows)).toBe(true);
  });

  test('checks pairwise eligibility from parsed rules', () => {
    expect(isPairwiseEligibleForDataRules([{ type: 'enum' }, { type: 'regex' }])).toBe(false);
    expect(isPairwiseEligibleForDataRules([{ type: 'enum' }, { type: 'enum' }])).toBe(true);
  });
});
