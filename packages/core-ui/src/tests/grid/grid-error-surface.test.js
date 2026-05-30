import { JSDOM } from 'jsdom';
import {
  GRID_ERROR_ELEMENT_ID,
  getGridErrorDisplay,
  showGridError,
} from '../../../js/gui_components/data-grid-editor/grid-error-surface.js';

describe('grid-error-surface', () => {
  test('caches error displays per document and renders in the correct DOM', () => {
    const domA = new JSDOM(`<!doctype html><html><body><div id="${GRID_ERROR_ELEMENT_ID}"></div></body></html>`);
    const domB = new JSDOM(`<!doctype html><html><body><div id="${GRID_ERROR_ELEMENT_ID}"></div></body></html>`);

    try {
      const displayA1 = getGridErrorDisplay(domA.window.document);
      const displayA2 = getGridErrorDisplay(domA.window.document);
      const displayB = getGridErrorDisplay(domB.window.document);

      expect(displayA1).toBe(displayA2);
      expect(displayA1).not.toBe(displayB);

      showGridError('A error', domA.window.document);
      showGridError('B error', domB.window.document);

      expect(domA.window.document.getElementById(GRID_ERROR_ELEMENT_ID).textContent).toBe('A error');
      expect(domB.window.document.getElementById(GRID_ERROR_ELEMENT_ID).textContent).toBe('B error');
    } finally {
      domA.window.close();
      domB.window.close();
    }
  });

  test('returns a no-op surface when the grid error element is missing', () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>');

    try {
      const display = getGridErrorDisplay(dom.window.document);
      expect(() => display.show('Missing root')).not.toThrow();
      expect(display.getState()).toEqual({});
    } finally {
      dom.window.close();
    }
  });
});
