/*
 * Purpose:
 * - Covers specific generator preview/export/pairwise flows with Testing Library.
 *
 * Asserts:
 * - preview populates both data-table and output-preview surfaces
 * - generate-to-file exports the selected format with real content
 * - pairwise visibility follows schema eligibility and pairwise export succeeds
 */

import { waitFor } from '@testing-library/dom';
import { createFocusedGeneratorHarness } from './support/focused-generator-harness.js';

describe('generator focused generation flows', () => {
  let harness;

  beforeAll(() => {
    harness = createFocusedGeneratorHarness();
  });

  beforeEach(() => {
    harness.reset();
  });

  test('preview updates data table and output preview with real generated data', async () => {
    await harness.fillRow(0, {
      name: 'Counter',
      sourceType: 'domain',
      command: 'string.counterString',
      params: '()',
    });
    await harness.setPreviewCount(3);
    await harness.clickPreview();

    await waitFor(() => expect(harness.getPreviewDataTable()?.getRowCount()).toBe(3));
    harness.assertSuccessfulPreview('generator focused preview');
    expect(harness.getOutputPreviewText()).toContain('Counter');
  });

  test('generate data exports the selected format using the real exporter', async () => {
    await harness.fillRow(0, {
      name: 'Status',
      sourceType: 'literal',
      value: 'active',
    });
    await harness.selectOutputFormat('json');
    await harness.setGenerateCount(2);
    await harness.clickGenerateData();

    harness.assertSuccessfulDownload('generator focused json download');
    expect(harness.getLastDownload().filename).toBe('generated-data.json');
    expect(harness.getLastDownload().text.trim().startsWith('[')).toBe(true);
  });

  test('pairwise button visibility and pairwise export follow enum eligibility', async () => {
    expect(harness.getPairwiseWrapper().style.display).toBe('none');

    await harness.fillRow(0, {
      name: 'Status',
      sourceType: 'enum',
      value: 'enum(active,inactive,pending)',
    });
    expect(harness.getPairwiseWrapper().style.display).toBe('none');

    await harness.addField();
    await harness.fillRow(1, {
      name: 'Priority',
      sourceType: 'enum',
      value: 'enum(high,medium,low)',
    });

    await waitFor(() => expect(harness.getPairwiseWrapper().style.display).toBe('inline-flex'));
    await harness.clickGeneratePairwise();

    harness.assertSuccessfulDownload('generator focused pairwise download');
    expect(harness.getLastDownload().filename).toBe('all-pairs-data.csv');
    expect(harness.getLastDownload().text).toContain('Status');
    expect(harness.getLastDownload().text.split(/\r?\n/).filter(Boolean).length).toBeGreaterThan(4);
  });
});
