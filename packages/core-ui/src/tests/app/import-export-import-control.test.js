import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createImportExportImportControlComponent } from '../../../js/gui_components/app/import-export-import-control/index.js';

describe('ImportExportImportControl', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    root = dom.window.document.getElementById('root');
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('shows file input and drop zone with the selected extension', () => {
    const createFileImportBindingsAdapter = jest.fn(() => ({ destroy: jest.fn() }));
    const onImportFromClipboard = jest.fn();
    createImportExportImportControlComponent({
      root,
      props: {
        fileExtension: '.json',
      },
      callbacks: {
        onImportFromClipboard,
      },
      services: {
        createFileImportBindingsAdapter,
      },
    });

    const fileInput = root.querySelector('[data-role="file-input"]');
    const fileInputLabel = root.querySelector('[data-role="file-input-label"]');
    const clipboardImportButton = root.querySelector('[data-role="clipboard-import-button"]');
    const dropZone = root.querySelector('[data-role="drop-zone"]');
    const labels = Array.from(root.querySelectorAll('[data-role="file-format-label"]')).map(
      (element) => element.textContent
    );

    expect(fileInput.id).toBe('csvinput');
    expect(fileInputLabel.id).toBe('csvinputlabel');
    expect(clipboardImportButton.textContent).toContain('From Clipboard');
    clipboardImportButton.click();
    expect(onImportFromClipboard).toHaveBeenCalledTimes(1);
    expect(dropZone.id).toBe('dropzone');
    expect(labels).toEqual(['.json', '.json']);
    expect(createFileImportBindingsAdapter).toHaveBeenCalledTimes(1);
  });

  test('emits import trim settings and enables the field list only in selected-fields mode', () => {
    const onImportTrimSettingsChange = jest.fn();
    createImportExportImportControlComponent({
      root,
      props: {
        trimInput: false,
        trimInputFieldsEnabled: false,
        trimInputFieldsCsv: 'Name',
      },
      callbacks: {
        onImportTrimSettingsChange,
      },
      services: {
        createFileImportBindingsAdapter: () => ({ destroy: jest.fn() }),
      },
    });

    const trimInputOnRadio = root.querySelector('[data-role="trim-input-on-radio"]');
    const trimInputFieldsSelectedRadio = root.querySelector('[data-role="trim-input-fields-selected-radio"]');
    const trimInputFieldsText = root.querySelector('[data-role="trim-input-fields-text"]');

    expect(trimInputFieldsText.disabled).toBe(true);

    trimInputOnRadio.click();
    trimInputFieldsSelectedRadio.click();
    trimInputFieldsText.value = 'Name, Role';
    trimInputFieldsText.dispatchEvent(new dom.window.Event('input', { bubbles: true }));

    expect(onImportTrimSettingsChange).toHaveBeenLastCalledWith({
      trimInput: true,
      trimInputFieldsEnabled: true,
      trimInputFieldsCsv: 'Name, Role',
    });
  });

  test('disables the file input and shows progress status while importing', () => {
    createImportExportImportControlComponent({
      root,
      props: {
        importBusy: true,
        importStatusMessage: 'Preparing file import...',
        importStatusLoading: true,
      },
      services: {
        createFileImportBindingsAdapter: () => ({ destroy: jest.fn() }),
      },
    });

    const fileInput = root.querySelector('[data-role="file-input"]');
    const clipboardImportButton = root.querySelector('[data-role="clipboard-import-button"]');
    const importStatus = root.querySelector('[data-role="import-progress-status"]');

    expect(fileInput.disabled).toBe(true);
    expect(fileInput.getAttribute('aria-disabled')).toBe('true');
    expect(clipboardImportButton.disabled).toBe(true);
    expect(clipboardImportButton.getAttribute('aria-disabled')).toBe('true');
    expect(importStatus.textContent).toBe('Preparing file import...');
    expect(importStatus.classList.contains('is-loading')).toBe(true);
  });
});
