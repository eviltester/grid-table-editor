/*
 * Purpose:
 * - Covers specific embedded app test-data schema-editing flows with Testing Library.
 *
 * Asserts:
 * - schema grid edits sync into text schema
 * - text schema edits repopulate the grid model
 * - invalid schema surfaces an error and clears on recovery
 * - sample schema shortcut populates the textarea and becomes generatable
 * - deleting selected schema rows updates the text schema
 */

import { waitFor } from '@testing-library/dom';
import { jest } from '@jest/globals';
import { TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT } from '../../../js/gui_components/shared/test-data/schema/schema-examples.js';
import { createFocusedAppTestDataHarness } from './support/focused-app-test-data-harness.js';

jest.setTimeout(15000);

describe('app test-data focused schema sync', () => {
  let harness;

  beforeAll(() => {
    harness = createFocusedAppTestDataHarness();
  });

  beforeEach(() => {
    harness.reset();
  });

  test('grid edits sync to schema text and text edits repopulate the grid', async () => {
    await harness.addColumn();
    await harness.fillGridRow(0, {
      name: 'Code',
      sourceType: 'regex',
      value: '[A-Z]{2}',
    });

    await waitFor(() => expect(harness.getSchemaText()).toContain('Code'));
    expect(harness.getSchemaText()).toContain('[A-Z]{2}');

    await harness.setSchemaText('Status\nactive,inactive');

    await waitFor(() =>
      expect(
        document.querySelectorAll('[data-role="schema-rows-region"] .shared-schema-row').length
      ).toBeGreaterThanOrEqual(1)
    );
    const row = harness.getGridRow(0);
    expect(row.querySelector('[data-field="name"]').value).toBe('Status');
    expect(row.querySelector('[data-field="sourceType"]').value).toBe('enum');
  });

  test('invalid text schema shows an error and clears after recovery', async () => {
    await harness.setSchemaText('OnlyName');
    await waitFor(() => expect(harness.getSchemaErrorText().length).toBeGreaterThan(0));

    await harness.setSchemaText('Status\nactive,inactive');

    await waitFor(() => expect(harness.getSchemaErrorText()).toBe(''));
    expect(
      document.querySelectorAll('[data-role="schema-rows-region"] .shared-schema-row').length
    ).toBeGreaterThanOrEqual(1);
  });

  test('sample schema shortcut populates text schema and becomes generatable', async () => {
    await harness.clickInjectedSampleButton();

    await waitFor(() => expect(harness.getSchemaText()).toBe(TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT));
    await harness.clickGenerate();

    harness.assertSuccessfulGeneration('app sample schema generation');
  });

  test('deleting selected schema rows removes them from the text schema', async () => {
    await harness.addColumn();
    await harness.fillGridRow(0, {
      name: 'Status',
      sourceType: 'enum',
      value: 'enum(active,inactive)',
    });
    await harness.addColumn();
    await harness.fillGridRow(1, {
      name: 'Code',
      sourceType: 'regex',
      value: '[A-Z]{2}',
    });

    await waitFor(() => expect(harness.getSchemaText()).toContain('Code'));
    await harness.selectGridRow(0);
    await harness.deleteSelectedColumns();

    await waitFor(() =>
      expect(
        document.querySelectorAll('[data-role="schema-rows-region"] .shared-schema-row').length
      ).toBeGreaterThanOrEqual(1)
    );
    expect(harness.getSchemaText()).not.toContain('Status');
    expect(harness.getSchemaText()).toContain('Code');
  }, 45000);
});
