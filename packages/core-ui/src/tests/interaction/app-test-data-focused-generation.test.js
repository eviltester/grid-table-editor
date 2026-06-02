/*
 * Purpose:
 * - Covers specific embedded app test-data generation flows with Testing Library.
 *
 * Asserts:
 * - generation-mode radio changes update visible row-count defaults
 * - generate and refresh preview use real generated/exported data
 * - pairwise visibility follows enum eligibility and pairwise generation succeeds
 * - amend modes respect grid row counts and selected-row requirements
 */

import { waitFor } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { createFocusedAppTestDataHarness } from './support/focused-app-test-data-harness.js';

jest.setTimeout(15000);

describe('app test-data focused generation flows', () => {
  let harness;

  beforeAll(() => {
    harness = createFocusedAppTestDataHarness();
  });

  beforeEach(() => {
    harness.setMainGridState({ rowCount: 7, selectedRowIndexes: [0, 2, 4] });
    harness.reset();
  });

  test('generation modes update the visible row-count defaults', async () => {
    expect(harness.getGenerateCount()).toBe('1');

    await harness.selectMode('amend-table');
    expect(harness.getGenerateCount()).toBe('7');

    await harness.selectMode('amend-selected');
    expect(harness.getGenerateCount()).toBe('3');
  });

  test('generate and refresh preview use real output without error indicators', async () => {
    await harness.addColumn();
    await harness.fillGridRow(0, {
      name: 'Counter',
      sourceType: 'domain',
      command: 'string.counterString',
      params: '()',
    });
    await harness.setGenerateCount(2);
    await harness.clickGenerate();
    harness.assertSuccessfulGeneration('app focused generate');

    await harness.clickRefreshPreview();
    harness.assertSuccessfulPreview('app focused refresh preview');
    expect(harness.getPreviewText()).toContain('Counter');
  });

  test('pairwise generation is only visible for eligible schema and succeeds when shown', async () => {
    expect(harness.getPairwiseButton().style.display).toBe('none');

    await harness.setSchemaText('Status\nenum(active,inactive,pending)');
    expect(harness.getPairwiseButton().style.display).toBe('none');

    await harness.setSchemaText('Status\nenum(active,inactive,pending)\nPriority\nenum(high,medium,low)');

    await waitFor(() => expect(harness.getPairwiseButton().style.display).not.toBe('none'));
    await harness.clickGeneratePairwise();

    harness.assertSuccessfulGeneration('app focused pairwise');
    expect(harness.getLatestDataTable().getRowCount()).toBeGreaterThan(4);
  });

  test('amend-table generation uses the current grid row count', async () => {
    await harness.addColumn();
    await harness.fillGridRow(0, {
      name: 'Counter',
      sourceType: 'domain',
      command: 'string.counterString',
      params: '()',
    });

    await harness.setGenerateCount(7);
    await harness.clickGenerate();
    harness.assertSuccessfulGeneration('app seed table generation');
    expect(harness.getLatestDataTable().getRowCount()).toBe(7);

    await harness.selectMode('amend-table');
    expect(harness.getGenerateCount()).toBe('7');

    await harness.clickGenerate();
    harness.assertSuccessfulGeneration('app amend-table generation');
    expect(harness.getLatestDataTable().getRowCount()).toBe(7);
  });

  test('amend-selected requires a selection before generating', async () => {
    await harness.setMainGridState({ rowCount: 7, selectedRowIndexes: [] });
    harness.reset();

    await harness.addColumn();
    await harness.fillGridRow(0, {
      name: 'Counter',
      sourceType: 'domain',
      command: 'string.counterString',
      params: '()',
    });

    await harness.selectMode('amend-selected');
    expect(harness.getGenerateCount()).toBe('0');

    await harness.clickGenerate({ waitForData: false });
    await waitFor(() => expect(harness.getSchemaErrorText()).toContain('No rows selected'));
  });

  test('domain datatype.enum generates as enum values', async () => {
    await harness.addColumn();
    await harness.fillGridRow(0, {
      name: 'Status',
      sourceType: 'domain',
      command: 'datatype.enum',
      params: 'active,inactive,pending',
    });

    await harness.setGenerateCount(3);
    await harness.clickGenerate();
    harness.assertSuccessfulGeneration('app datatype.enum generation');
    expect(harness.getSchemaErrorText()).toBe('');

    const dataTable = harness.getLatestDataTable();
    const statusColumnIndex = dataTable.getHeaders().indexOf('Status');
    expect(statusColumnIndex).toBeGreaterThanOrEqual(0);
    const allowedValues = new Set(['active', 'inactive', 'pending']);
    for (let rowIndex = 0; rowIndex < dataTable.getRowCount(); rowIndex += 1) {
      const value = String(dataTable.getCell(rowIndex, statusColumnIndex));
      expect(allowedValues.has(value)).toBe(true);
    }
  });
});
