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

  test('returns a no-op surface without a document object', () => {
    const display = getGridErrorDisplay(null);

    expect(() => display.show('Missing root')).not.toThrow();
    expect(() => showGridError('No document', null)).not.toThrow();
    expect(display.getState()).toEqual({});
  });

  test('supports a rooted resolver so callers do not need the global grid error id', () => {
    const dom = new JSDOM(`
      <!doctype html>
      <html>
        <body>
          <section data-role="grid-root">
            <div data-role="grid-error-status"></div>
          </section>
        </body>
      </html>
    `);

    try {
      const resolveElement = () => dom.window.document.querySelector('[data-role="grid-error-status"]');
      const displayA = getGridErrorDisplay({
        documentObj: dom.window.document,
        resolveElement,
      });
      const displayB = getGridErrorDisplay({
        documentObj: dom.window.document,
        resolveElement,
      });

      expect(displayA).toBe(displayB);

      showGridError('Scoped error', {
        documentObj: dom.window.document,
        resolveElement,
      });

      expect(dom.window.document.querySelector('[data-role="grid-error-status"]').textContent).toBe('Scoped error');
      expect(dom.window.document.getElementById(GRID_ERROR_ELEMENT_ID)).toBeNull();
    } finally {
      dom.window.close();
    }
  });
});
