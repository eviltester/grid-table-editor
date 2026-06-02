import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createImportExportToolbarComponent } from '../../../js/gui_components/app/import-export-toolbar/index.js';

describe('ImportExportToolbar', () => {
  let dom;
  let documentObj;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    documentObj = dom.window.document;
    root = documentObj.getElementById('root');
    global.document = documentObj;
    global.window = dom.window;
    global.tippy = jest.fn();
  });

  afterEach(() => {
    dom.window.close();
    delete global.tippy;
    jest.restoreAllMocks();
  });

  test('binds tooltip help on mount for the toolbar help icon', () => {
    createImportExportToolbarComponent({ root, documentObj });

    const helpIcon = root.querySelector('.helpicon[data-help]');

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
  });

  test('can mount from the root ownerDocument without a global document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      createImportExportToolbarComponent({ root });

      const helpIcon = root.querySelector('.helpicon[data-help]');
      expect(helpIcon).not.toBeNull();
      expect(global.tippy).toHaveBeenCalled();
    } finally {
      global.document = originalDocument;
    }
  });
});
