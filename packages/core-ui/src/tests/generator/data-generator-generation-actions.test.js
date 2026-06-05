import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  renderGeneratorOutputPreview,
  updateGeneratorPairwiseButtonVisibility,
} from '../../../js/gui_components/generator/generation/index.js';

describe('generator generation actions', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="generateAllPairsButtonWrapper"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('updateGeneratorPairwiseButtonVisibility hides wrapper for invalid schema', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      syncSchemaRowsFromTextMode: () => ({ rows: [{ sourceType: 'enum', value: 'a,b' }], errors: ['bad'] }),
      validateSchemaRows: () => ({ rows: [], errors: [] }),
    });

    expect(isVisible).toBe(false);
  });

  test('updateGeneratorPairwiseButtonVisibility returns true for pairwise-eligible schema', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      syncSchemaRowsFromTextMode: () => ({
        rows: [
          { sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
          { sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
        ],
        errors: [],
      }),
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
    });

    expect(isVisible).toBe(true);
  });

  test('renderGeneratorOutputPreview writes through the injected preview setter only', () => {
    const setOutputPreviewText = jest.fn();
    const exporter = {
      canExport: jest.fn(() => true),
      getDataTableAs: jest.fn(() => 'json:sync:2'),
    };
    const fakeDataTable = { getRowCount: () => 2 };

    renderGeneratorOutputPreview({
      getSelectedOutputType: () => 'json',
      getPreviewDataTable: () => fakeDataTable,
      exporter,
      setOutputPreviewText,
    });

    expect(setOutputPreviewText).toHaveBeenCalledWith('json:sync:2');
  });

  test('updateGeneratorPairwiseButtonVisibility does not require a document object', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      getCurrentSchemaState: () => ({
        rows: [
          { sourceType: 'enum', value: 'enum(chrome,firefox,safari)' },
          { sourceType: 'enum', value: 'enum(free,pro,enterprise)' },
        ],
        errors: [],
      }),
      validateSchemaRows: (rows) => ({ rows, errors: [] }),
    });

    expect(isVisible).toBe(true);
  });
});
