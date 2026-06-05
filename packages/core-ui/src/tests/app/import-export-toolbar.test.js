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
    dom.window.tippy = global.tippy;
  });

  afterEach(() => {
    dom.window.close();
    delete global.tippy;
    delete dom.window.tippy;
    jest.restoreAllMocks();
  });

  test('binds tooltip help on mount for the toolbar help icon', () => {
    createImportExportToolbarComponent({ root, documentObj });

    const helpIcon = root.querySelector('.helpicon[data-help]');
    const setTextFromGridButton = root.querySelector('[data-role="set-text-from-grid-button"]');
    const setGridFromTextButton = root.querySelector('[data-role="set-grid-from-text-button"]');
    const fileInput = root.querySelector('[data-role="file-input"]');
    const dropZone = root.querySelector('[data-role="drop-zone"]');
    const fileFormatLabels = root.querySelectorAll('[data-role="file-format-label"]');
    const exportStatus = root.querySelector('[data-role="export-progress-status"]');
    const importStatus = root.querySelector('[data-role="import-progress-status"]');
    const errorStatus = root.querySelector('[data-role="error-status"]');

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcon.getAttribute('role')).toBe('button');
    expect(helpIcon.getAttribute('aria-label')).toBe('Show help');
    expect(setTextFromGridButton?.id).toBe('settextfromgridbutton');
    expect(setGridFromTextButton?.id).toBe('setgridfromtextbutton');
    expect(fileInput?.id).toBe('csvinput');
    expect(dropZone?.id).toBe('dropzone');
    expect(fileFormatLabels).toHaveLength(3);
    expect(exportStatus?.id).toBe('export-progress-status');
    expect(importStatus?.id).toBe('import-progress-status');
    expect(errorStatus?.id).toBe('import-export-error');
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
