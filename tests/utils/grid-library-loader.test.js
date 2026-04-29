import { JSDOM } from 'jsdom';
import {
  ensureGridLibraryLoaded,
  resetEnginePromise,
} from '../../packages/core-ui/js/gui_components/data-grid-editor/grid-library-loader.js';

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

  test('ag-grid path injects ag-grid script only', async () => {
    const promise = ensureGridLibraryLoaded({ engine: 'ag-grid', document: doc });

    const agScript = doc.getElementById('ag-grid-script');
    expect(agScript).toBeTruthy();
    expect(agScript.src).toContain('ag-grid-community');
    expect(doc.getElementById('tabulator-script')).toBeFalsy();
    expect(doc.getElementById('tabulator-css')).toBeFalsy();

    triggerScriptLoadById('ag-grid-script');
    await expect(promise).resolves.toBeUndefined();
  });

  test('tabulator path injects tabulator script and css only', async () => {
    const promise = ensureGridLibraryLoaded({ engine: 'tabulator', document: doc });

    const tabScript = doc.getElementById('tabulator-script');
    const tabCss = doc.getElementById('tabulator-css');
    expect(tabScript).toBeTruthy();
    expect(tabScript.src).toContain('tabulator-tables');
    expect(tabCss).toBeTruthy();
    expect(tabCss.href).toContain('tabulator-tables');
    expect(doc.getElementById('ag-grid-script')).toBeFalsy();

    triggerScriptLoadById('tabulator-script');
    await expect(promise).resolves.toBeUndefined();
  });

  test('repeated loads are idempotent and do not duplicate tags', async () => {
    const p1 = ensureGridLibraryLoaded({ engine: 'tabulator', document: doc });
    const p2 = ensureGridLibraryLoaded({ engine: 'tabulator', document: doc });
    expect(p1).toBe(p2);
    expect(doc.querySelectorAll('#tabulator-script').length).toBe(1);
    expect(doc.querySelectorAll('#tabulator-css').length).toBe(1);

    triggerScriptLoadById('tabulator-script');
    await expect(p1).resolves.toBeUndefined();
  });

  test('failed load rejects promise', async () => {
    const p = ensureGridLibraryLoaded({ engine: 'ag-grid', document: doc });
    triggerScriptErrorById('ag-grid-script');
    await expect(p).rejects.toThrow('Failed loading script');
  });

  test('query-string engine ag-grid injects only ag-grid assets', async () => {
    const p = ensureGridLibraryLoaded({
      document: doc,
      locationSearch: '?grid=ag-grid',
      globalObject: {},
    });

    expect(doc.getElementById('ag-grid-script')).toBeTruthy();
    expect(doc.getElementById('tabulator-script')).toBeFalsy();
    expect(doc.getElementById('tabulator-css')).toBeFalsy();

    triggerScriptLoadById('ag-grid-script');
    await expect(p).resolves.toBeUndefined();
  });

  test('query-string engine tabulator injects only tabulator assets', async () => {
    const p = ensureGridLibraryLoaded({
      document: doc,
      locationSearch: '?grid=tabulator',
      globalObject: {},
    });

    expect(doc.getElementById('tabulator-script')).toBeTruthy();
    expect(doc.getElementById('tabulator-css')).toBeTruthy();
    expect(doc.getElementById('ag-grid-script')).toBeFalsy();

    triggerScriptLoadById('tabulator-script');
    await expect(p).resolves.toBeUndefined();
  });
});
