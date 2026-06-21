/*
 * Purpose:
 * - Covers specific generator schema-editing user flows with Testing Library.
 *
 * Asserts:
 * - source-type changes swap the visible controls and help link state
 * - text-mode round-trip preserves valid schema and blocks invalid schema
 * - sample schema insertion respects the currently visible schema/text mode
 * - row reordering and removal update the rendered schema text order
 */

import { jest } from '@jest/globals';
import { waitFor, within } from '@testing-library/dom';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../js/gui_components/shared/test-data/schema/schema-examples.js';
import { createFocusedGeneratorHarness } from './support/focused-generator-harness.js';

jest.setTimeout(45000);

describe('generator focused schema editing', () => {
  let harness;

  beforeAll(() => {
    harness = createFocusedGeneratorHarness();
  });

  beforeEach(() => {
    harness.reset();
  });

  test('source-type editing swaps row controls and help links', async () => {
    await harness.fillRow(0, {
      name: 'Generated Name',
      sourceType: 'faker',
      command: 'helpers.arrayElement',
      params: '(["Ada","Bob"])',
    });

    await waitFor(() => {
      expect(within(harness.getRow(0)).queryByPlaceholderText('Value / Regex')).toBeNull();
      expect(within(harness.getRow(0)).getByPlaceholderText('Params e.g. (10)')).toBeTruthy();
    });
    expect(harness.getHelpLink(0).hidden).toBe(false);
    expect(harness.getHelpLink(0).getAttribute('href')).toBe('https://anywaydata.com/docs/test-data/faker/helpers');

    await harness.fillRow(0, {
      name: 'Counter',
      sourceType: 'domain',
      command: 'string.counterString',
      params: '()',
    });
    await waitFor(() => expect(harness.getHelpLink(0).hidden).toBe(false));
    expect(harness.getHelpLink(0).getAttribute('href')).toContain('/docs/test-data/');

    await harness.fillRow(0, {
      name: 'Fixed',
      sourceType: 'literal',
      value: 'Hello',
    });

    await waitFor(() => {
      expect(within(harness.getRow(0)).getByPlaceholderText('Value / Regex')).toBeTruthy();
      expect(within(harness.getRow(0)).queryByPlaceholderText('Params e.g. (10)')).toBeNull();
    });
  });

  test('faker helpers.arrayElement preview returns only supplied array members', async () => {
    await harness.fillRow(0, {
      name: 'Pick',
      sourceType: 'faker',
      command: 'helpers.arrayElement',
      params: '(["A","B","C"])',
    });
    await harness.setPreviewCount(8);
    await harness.clickPreview();

    harness.assertSuccessfulPreview('helpers.arrayElement preview');

    const previewTable = harness.getPreviewDataTable();
    expect(previewTable).toBeTruthy();
    expect(previewTable.getRowCount()).toBeGreaterThan(0);

    for (let rowIndex = 0; rowIndex < previewTable.getRowCount(); rowIndex += 1) {
      expect(['A', 'B', 'C']).toContain(previewTable.getCell(rowIndex, 0));
    }
  });

  test('text-mode invalid schema shows error and valid schema round-trips back to rows', async () => {
    await harness.fillRow(0, {
      name: 'Code',
      sourceType: 'regex',
      value: '[A-Z]{2}',
    });

    await harness.toggleToTextMode();
    expect(harness.getSchemaText()).toContain('Code');
    expect(harness.getSchemaText()).toContain('[A-Z]{2}');

    await harness.setSchemaText('BrokenOnlyName');
    await harness.toggleToSchemaMode();

    expect(harness.getSchemaErrorText().length).toBeGreaterThan(0);
    expect(harness.getSchemaTextContainer().style.display).toBe('block');

    await harness.setSchemaText('Status\nenum(active,inactive,pending)');
    await harness.toggleToSchemaMode();

    await waitFor(() => expect(document.querySelectorAll('.shared-schema-row').length).toBe(1));
    expect(harness.getSchemaErrorText()).toBe('');
    expect(within(harness.getRow(0)).getByDisplayValue('Status')).toBeTruthy();
  });

  test('sample schema insertion populates text mode and rebuilds schema rows', async () => {
    await harness.toggleToTextMode();
    await harness.clickInjectedSampleButton();

    await waitFor(() => expect(harness.getSchemaText()).toBe(GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT));

    await harness.toggleToSchemaMode();
    await waitFor(() => expect(document.querySelectorAll('.shared-schema-row').length).toBeGreaterThan(1));
  });

  test('sample schema insertion in schema mode keeps schema mode visible and updates rows', async () => {
    expect(harness.getSchemaRowsContainer().style.display).toBe('flex');
    expect(harness.getSchemaTextContainer().style.display).toBe('none');

    await harness.clickInjectedSampleButton();

    await waitFor(() => expect(document.querySelectorAll('.shared-schema-row').length).toBeGreaterThan(1));
    expect(harness.getSchemaRowsContainer().style.display).toBe('flex');
    expect(harness.getSchemaTextContainer().style.display).toBe('none');
  });

  test('schema row reorder and removal are reflected in text mode', async () => {
    await harness.fillRow(0, {
      name: 'First',
      sourceType: 'literal',
      value: 'alpha',
    });
    await harness.addField();
    await harness.fillRow(1, {
      name: 'Second',
      sourceType: 'literal',
      value: 'beta',
    });

    await harness.clickRowAction(1, 'up');
    await harness.toggleToTextMode();

    expect(harness.getSchemaText().indexOf('Second')).toBeLessThan(harness.getSchemaText().indexOf('First'));

    await harness.toggleToSchemaMode();
    await harness.clickRowAction(0, 'remove');
    await harness.toggleToTextMode();

    expect(harness.getSchemaText()).not.toContain('Second');
    expect(harness.getSchemaText()).toContain('First');
  });
});
