import { describe, expect, test } from '@jest/globals';
import {
  presentUiGenerationNotice,
  presentUiGenerationResult,
} from '../../../js/gui_components/shared/test-data/generation/ui-generation-status-presenter.js';

function createResult({ ok = true, rowCount = 0, errors = [], aborted = false, failedRows = 0 } = {}) {
  return {
    ok,
    errors,
    aborted,
    dataTable: {
      getRowCount: () => rowCount,
    },
    statusContext: {
      generatedRows: rowCount,
      failedRows,
    },
  };
}

describe('ui generation status presenter', () => {
  test('presents successful app generation statuses with preview context', () => {
    expect(
      presentUiGenerationResult({
        surface: 'app',
        operationKind: 'generateRows',
        result: createResult({ rowCount: 2 }),
        previewUpdated: true,
      })
    ).toEqual({
      outcome: 'success',
      schemaMessage: null,
      statusMessage: 'Generate complete. Grid and preview updated.',
      statusOptions: { dismissable: true },
    });

    expect(
      presentUiGenerationResult({
        surface: 'app',
        operationKind: 'generateCombinations',
        result: createResult({ rowCount: 4 }),
        previewUpdated: false,
        strength: 2,
      }).statusMessage
    ).toBe('Generated 4 2-wise combinations. Grid updated.');
  });

  test('presents successful generator download statuses', () => {
    expect(
      presentUiGenerationResult({
        surface: 'generator',
        operationKind: 'generateRows',
        result: createResult({ rowCount: 3 }),
        filename: 'generated-data.csv',
      }).statusMessage
    ).toBe('Download ready: generated-data.csv');

    expect(
      presentUiGenerationResult({
        surface: 'generator',
        operationKind: 'generatePairwise',
        result: createResult({ rowCount: 6 }),
        filename: 'all-pairs.csv',
      }).statusMessage
    ).toBe('Download ready: all-pairs.csv (6 combinations)');
  });

  test('presents shared warning mappings for insufficient enum columns and invalid n-wise strength', () => {
    const insufficient = presentUiGenerationResult({
      surface: 'app',
      operationKind: 'generatePairwise',
      result: createResult({
        ok: false,
        errors: [
          { code: 'insufficient_enum_columns', message: 'Pairwise generation requires at least 2 enum columns.' },
        ],
      }),
    });
    const invalidStrength = presentUiGenerationResult({
      surface: 'app',
      operationKind: 'generateCombinations',
      result: createResult({
        ok: false,
        errors: [
          { code: 'invalid_nwise_strength', message: 'n-wise strength must be between 2 and 1 for this schema.' },
        ],
      }),
    });

    expect(insufficient.statusMessage).toBe('Insufficient enum columns. Grid unchanged.');
    expect(invalidStrength.statusMessage).toBe('Invalid n-wise strength. Grid unchanged.');
    expect(insufficient.statusOptions).toEqual({ severity: 'warning', dismissable: true });
    expect(invalidStrength.statusOptions).toEqual({ severity: 'warning', dismissable: true });
  });

  test('presents aborted constraint-limited generation with retry-limit context', () => {
    const presentation = presentUiGenerationResult({
      surface: 'app',
      operationKind: 'generateRows',
      result: createResult({
        ok: false,
        aborted: true,
        rowCount: 1,
        failedRows: 1000,
      }),
      retryLimitReached: true,
    });

    expect(presentation.schemaMessage).toBe(
      'Schema Constraints are impacting row generation - generated 1 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation. Retry limit reached.'
    );
    expect(presentation.statusMessage).toBe(
      'Schema Constraints are impacting row generation - generated 1 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation. Retry limit reached. Grid updated.'
    );
    expect(presentation.statusOptions).toEqual({ severity: 'warning', dismissable: true });
  });

  test('presents amend constraint failures and hard errors distinctly', () => {
    expect(
      presentUiGenerationResult({
        surface: 'app',
        operationKind: 'amendRows',
        result: createResult({
          ok: false,
          errors: [{ code: 'constraint_generation_failed', message: 'constraint failure' }],
        }),
      }).statusMessage
    ).toBe('Amend stopped by schema constraints. Grid unchanged.');

    expect(
      presentUiGenerationResult({
        surface: 'app',
        operationKind: 'amendRows',
        result: createResult({
          ok: false,
          errors: [{ code: 'row_count_exceeds_imported', message: 'Row count exceeds imported row count 1.' }],
        }),
      }).statusMessage
    ).toBe('Amend failed. Grid unchanged.');
  });

  test('keeps generator failures unsuffixed while app failures explain that the grid is unchanged', () => {
    const result = createResult({
      ok: false,
      errors: [{ code: 'insufficient_enum_columns', message: 'Pairwise generation requires at least 2 enum columns.' }],
    });

    expect(
      presentUiGenerationResult({
        surface: 'app',
        operationKind: 'generatePairwise',
        result,
      }).statusMessage
    ).toBe('Insufficient enum columns. Grid unchanged.');
    expect(
      presentUiGenerationResult({
        surface: 'generator',
        operationKind: 'generatePairwise',
        result,
      }).statusMessage
    ).toBe('Insufficient enum columns.');
  });

  test('presents cartesian skip notices consistently across surfaces', () => {
    expect(presentUiGenerationNotice({ noticeKind: 'cartesianSkipped', surface: 'app' })).toEqual({
      outcome: 'warning',
      schemaMessage: null,
      statusMessage: 'Cartesian product generation skipped.',
      statusOptions: { severity: 'warning', dismissable: true },
    });
  });
});
