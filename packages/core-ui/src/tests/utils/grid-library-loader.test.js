import { JSDOM } from 'jsdom';
import {
  ensureGridLibraryLoaded,
  resetEnginePromise,
} from '../../../js/gui_components/data-grid-editor/grid-library-loader.js';

describe('grid-library-loader', () => {
  let dom;
  let doc;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><head></head><body></body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    doc = dom.window.document;
    delete global.agGrid;
    delete global.Tabulator;
    resetEnginePromise();
  });

  afterEach(() => {
    dom.window.close();
  });

  function triggerScriptLoadById(id) {
    const script = doc.getElementById(id);
    script.onload();
  }

  function triggerScriptErrorById(id) {
    const script = doc.getElementById(id);
    script.onerror();
  }

  test('injects tabulator script and css', async () => {
    const promise = ensureGridLibraryLoaded({ document: doc });

    const tabScript = doc.getElementById('tabulator-script');
    const tabCss = doc.getElementById('tabulator-css');
    expect(tabScript).toBeTruthy();
    expect(tabScript.src).toContain('tabulator-tables');
    expect(tabCss).toBeTruthy();
    expect(tabCss.href).toContain('tabulator-tables');

    triggerScriptLoadById('tabulator-script');
    await expect(promise).resolves.toBeUndefined();
  });

  test('repeated loads are idempotent and do not duplicate tags', async () => {
    const p1 = ensureGridLibraryLoaded({ document: doc });
    const p2 = ensureGridLibraryLoaded({ document: doc });
    expect(p1).toBe(p2);
    expect(doc.querySelectorAll('#tabulator-script').length).toBe(1);
    expect(doc.querySelectorAll('#tabulator-css').length).toBe(1);

    triggerScriptLoadById('tabulator-script');
    await expect(p1).resolves.toBeUndefined();
  });

  test('failed load rejects promise', async () => {
    const p = ensureGridLibraryLoaded({ document: doc });
    triggerScriptErrorById('tabulator-script');
    await expect(p).rejects.toThrow('Failed loading script');
  });
});
