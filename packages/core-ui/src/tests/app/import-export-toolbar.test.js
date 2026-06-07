import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import * as importExportToolbarExports from '../../../js/gui_components/app/import-export-toolbar/index.js';
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

  test('public barrel is component-factory-only', () => {
    expect(importExportToolbarExports.createImportExportToolbarComponent).toBe(createImportExportToolbarComponent);
    expect(importExportToolbarExports.ImportExportToolbarController).toBeUndefined();
    expect(importExportToolbarExports.ImportExportToolbarView).toBeUndefined();
  });

  test('binds tooltip help on mount for each toolbar section help icon', () => {
    createImportExportToolbarComponent({ root, documentObj });

    const helpIcons = Array.from(root.querySelectorAll('[data-help-role="help-icon"][data-help]'));
    const setTextFromGridButton = root.querySelector('[data-role="set-text-from-grid-button"]');
    const setGridFromTextButton = root.querySelector('[data-role="set-grid-from-text-button"]');
    const fileInput = root.querySelector('[data-role="file-input"]');
    const clipboardImportButton = root.querySelector('[data-role="clipboard-import-button"]');
    const dropZone = root.querySelector('[data-role="drop-zone"]');
    const fileFormatLabels = root.querySelectorAll('[data-role="file-format-label"]');
    const exportStatus = root.querySelector('[data-role="export-progress-status"]');
    const importStatus = root.querySelector('[data-role="import-progress-status"]');
    const errorStatus = root.querySelector('[data-role="error-status"]');

    expect(global.tippy).toHaveBeenCalled();
    expect(helpIcons).toHaveLength(3);
    expect(helpIcons.map((icon) => icon.getAttribute('data-help'))).toEqual([
      'import-export-grid-preview-sync',
      'import-export-import',
      'import-export-download',
    ]);
    helpIcons.forEach((icon) => {
      expect(icon.getAttribute('role')).toBe('button');
      expect(icon.getAttribute('aria-label')).toBe('Show help');
    });
    expect(setTextFromGridButton?.id).toBe('settextfromgridbutton');
    expect(setGridFromTextButton?.id).toBe('setgridfromtextbutton');
    expect(fileInput?.id).toBe('csvinput');
    expect(clipboardImportButton?.textContent).toContain('From Clipboard');
    expect(dropZone?.id).toBe('dropzone');
    expect(fileFormatLabels).toHaveLength(3);
    expect(exportStatus?.id).toBe('export-progress-status');
    expect(importStatus?.id).toBe('import-progress-status');
    expect(errorStatus?.id).toBe('import-export-error');
  });

  test('renders import controls before the download segment in the composed toolbar layout', () => {
    createImportExportToolbarComponent({ root, documentObj });

    const dropZone = root.querySelector('[data-role="drop-zone"]');
    const downloadButton = root.querySelector('[data-role="download-button"]');
    const { Node } = root.ownerDocument.defaultView;

    expect(dropZone.compareDocumentPosition(downloadButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('can mount from the root ownerDocument without a global document', () => {
    const originalDocument = global.document;
    delete global.document;

    try {
      createImportExportToolbarComponent({ root });

      const helpIcons = root.querySelectorAll('[data-help-role="help-icon"][data-help]');
      expect(helpIcons).toHaveLength(3);
      expect(global.tippy).toHaveBeenCalled();
    } finally {
      global.document = originalDocument;
    }
  });

  test('mirrors disabled button state to aria-disabled for import/export actions', () => {
    const component = createImportExportToolbarComponent({
      root,
      documentObj,
      props: {
        mode: 'preview',
        previewTextDirty: false,
        importBusy: false,
        exportBusy: false,
        supportsImport: true,
        supportsExport: true,
      },
    });

    const downloadButton = root.querySelector('[data-role="download-button"]');
    const setTextFromGridButton = root.querySelector('[data-role="set-text-from-grid-button"]');
    const setGridFromTextButton = root.querySelector('[data-role="set-grid-from-text-button"]');
    const clipboardImportButton = root.querySelector('[data-role="clipboard-import-button"]');

    expect(downloadButton.disabled).toBe(false);
    expect(downloadButton.getAttribute('aria-disabled')).toBe('false');
    expect(setTextFromGridButton.disabled).toBe(false);
    expect(setTextFromGridButton.getAttribute('aria-disabled')).toBe('false');
    expect(setGridFromTextButton.disabled).toBe(true);
    expect(setGridFromTextButton.getAttribute('aria-disabled')).toBe('true');
    expect(clipboardImportButton.disabled).toBe(false);
    expect(clipboardImportButton.getAttribute('aria-disabled')).toBe('false');

    component.update({ importBusy: true, exportBusy: true });

    expect(downloadButton.disabled).toBe(true);
    expect(downloadButton.getAttribute('aria-disabled')).toBe('true');
    expect(setTextFromGridButton.disabled).toBe(true);
    expect(setTextFromGridButton.getAttribute('aria-disabled')).toBe('true');
    expect(setGridFromTextButton.disabled).toBe(true);
    expect(setGridFromTextButton.getAttribute('aria-disabled')).toBe('true');
    expect(clipboardImportButton.disabled).toBe(true);
    expect(clipboardImportButton.getAttribute('aria-disabled')).toBe('true');
  });

  test('binds file selection through the default file-import adapter in standalone usage', () => {
    const onFileSelected = jest.fn();

    createImportExportToolbarComponent({
      root,
      documentObj,
      callbacks: {
        onFileSelected,
      },
    });

    const fileInput = root.querySelector('[data-role="file-input"]');
    const file = new dom.window.File(['name,status\nAva,active'], 'toolbar-import.csv', {
      type: 'text/csv',
    });

    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [file],
    });

    fileInput.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(onFileSelected).toHaveBeenCalledWith(file);
  });
});
