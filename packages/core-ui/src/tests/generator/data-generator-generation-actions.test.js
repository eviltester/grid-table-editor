import { JSDOM } from 'jsdom';
import {
  parseGeneratorRowCount,
  updateGeneratorPairwiseButtonVisibility,
} from '../../../js/gui_components/generator/generation/index.js';

describe('generator generation actions', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      '<!doctype html><html><body><input id="previewRowsCount" max="50" value="999" /><div id="generateAllPairsButtonWrapper"></div></body></html>'
    );
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('parseGeneratorRowCount enforces max values', () => {
    const parsed = parseGeneratorRowCount({ documentObj: document, inputId: 'previewRowsCount' });

    expect(parsed.value).toBe(50);
    expect(parsed.errors).toEqual(['previewRowsCount must be less than or equal to 50.']);
  });

  test('updateGeneratorPairwiseButtonVisibility hides wrapper for invalid schema', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      documentObj: document,
      syncSchemaRowsFromTextMode: () => ({ rows: [{ sourceType: 'enum', value: 'a,b' }], errors: ['bad'] }),
      validateSchemaRows: () => ({ rows: [], errors: [] }),
    });

    expect(isVisible).toBe(false);
    expect(document.getElementById('generateAllPairsButtonWrapper').style.display).toBe('none');
  });

  test('updateGeneratorPairwiseButtonVisibility returns true for pairwise-eligible schema', () => {
    const isVisible = updateGeneratorPairwiseButtonVisibility({
      documentObj: document,
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
    expect(document.getElementById('generateAllPairsButtonWrapper').style.display).toBe('inline-flex');
  });
});
