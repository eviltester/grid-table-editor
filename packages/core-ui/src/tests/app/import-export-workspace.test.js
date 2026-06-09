import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { jest } from '@jest/globals';
import { fireEvent, waitFor } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
import * as importExportWorkspaceExports from '../../../js/gui_components/app/import-export-workspace/index.js';
import { createImportExportWorkspaceComponent } from '../../../js/gui_components/app/import-export-workspace/index.js';

function createTable(rowCount = 3) {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(['Name', 'Role']);
  for (let index = 0; index < rowCount; index += 1) {
    dataTable.appendDataRow([`Name ${index + 1}`, `Role ${index + 1}`]);
  }
  return dataTable;
}

function createFakeFormatOptionsPanel() {
  return {
    update: jest.fn(),
    isSupported: jest.fn(() => false),
    getOptionsFromGui: jest.fn(() => null),
    destroy: jest.fn(),
  };
}

function getPreviewRowCountInput(documentObj) {
  return documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="preview-row-count-root"] input');
}

function getPreviewTextArea(documentObj) {
  return documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="preview-text-editor"]');
}

function getCopyTextButton(documentObj) {
  return documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="copy-text-button"]');
}

function getCopyTextButtonLabel(documentObj) {
  return documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="copy-text-label"]');
}

function createHarness({ props = {}, services = {} } = {}) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
  const documentObj = dom.window.document;
  global.document = documentObj;
  global.window = dom.window;
  const exporter = {
    canExport: jest.fn(() => true),
    getFileExtensionFor: jest.fn((type) => `.${type}`),
    getGridAsGenericDataTable: jest.fn((limit) => createTable(limit)),
    getDataTableAs: jest.fn((type, dataTable) => `${type}:rows:${dataTable.getRowCount()}`),
    getGridAs: jest.fn((type) => `full:${type}`),
    getOptionsForType: jest.fn(() => undefined),
  };
  const importer = {
    canImport: jest.fn(() => true),
    getFileExtensionFor: jest.fn((type) => `.${type}`),
    toGenericDataTable: jest.fn(() => createTable(4)),
    setGridFromGenericDataTable: jest.fn(() => Promise.resolve()),
    importText: jest.fn(() => Promise.resolve()),
  };
  const component = createImportExportWorkspaceComponent({
    root: documentObj.getElementById('root'),
    documentObj,
    props,
    services: {
      importer,
      exporter,
      createFormatOptionsPanel: createFakeFormatOptionsPanel,
      yieldToUi: async () => {},
      scheduleTimeoutFn: jest.fn(),
      requestConfirm: jest.fn(async () => true),
      clipboardService: {
        copyFromTextArea: jest.fn(),
        readText: jest.fn(async () => 'Name,Role\nAda,Engineer'),
        canReadText: jest.fn(() => true),
      },
      ...services,
    },
  });

  return {
    component,
    documentObj,
    dom,
    exporter,
    importer,
    root: documentObj.getElementById('root'),
  };
}

describe('ImportExportWorkspace', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.document;
    delete global.window;
  });

  test('public barrel is component-factory-only', () => {
    expect(importExportWorkspaceExports.createImportExportWorkspaceComponent).toBe(
      createImportExportWorkspaceComponent
    );
    expect(importExportWorkspaceExports.ImportExportWorkspaceController).toBeUndefined();
    expect(importExportWorkspaceExports.ImportExportWorkspaceView).toBeUndefined();
  });

  test('mounts real controls, normalizes preview row count, and renders format previews without legacy controls', () => {
    const { component, documentObj, dom, exporter } = createHarness({
      props: { previewRowLimit: 0 },
    });

    expect(documentObj.querySelector('#tabbedTextArea')).not.toBeNull();
    expect(documentObj.querySelector('[data-role="text-preview-editor-root"]')).not.toBeNull();
    expect(documentObj.querySelector('#settextfromgridbutton')).not.toBeNull();
    expect(documentObj.querySelector('[data-role="grid-preview-sync-root"] #settextfromgridbutton')).not.toBeNull();
    expect(documentObj.querySelector('[data-role="import-export-toolbar-details"] #settextfromgridbutton')).toBeNull();
    expect(documentObj.querySelector('[data-role="import-export-toolbar-details"]')?.open).toBe(false);
    expect(
      documentObj.querySelector('[data-role="import-export-toolbar-details"] [data-role="auto-preview-checkbox"]')
    ).toBeNull();
    expect(
      documentObj.querySelector('[data-role="import-export-toolbar-details"] [data-role="preview-edit-mode-button"]')
    ).toBeNull();
    expect(getPreviewRowCountInput(documentObj)).not.toBeNull();
    expect(getPreviewRowCountInput(documentObj).getAttribute('aria-label')).toBe('Preview row count');
    expect(documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="edit-area"]')).not.toBeNull();
    expect(
      documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="options-panel-root"]')
    ).not.toBeNull();
    expect(
      documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="options-preview-splitter"]')
    ).not.toBeNull();
    expect(
      documentObj.querySelector('[data-role="text-preview-editor-root"] [data-role="preview-text-wrapper"]')
    ).not.toBeNull();
    expect(component.getState().previewRowLimit).toBe(1);
    fireEvent.click(documentObj.querySelector('#settextfromgridbutton'));

    expect(exporter.getGridAsGenericDataTable).toHaveBeenCalledWith(1);
    expect(getPreviewTextArea(documentObj).value).toBe('csv:rows:1');

    fireEvent.click(documentObj.querySelector('[data-role="format-main-tab-action"][data-type="json"]'));

    expect(component.getState().selectedFormat).toBe('json');
    expect(getPreviewTextArea(documentObj).value).toBe('json:rows:1');
    expect(documentObj.querySelector('#filedownload').textContent).toContain('.json');

    const previewRowCount = getPreviewRowCountInput(documentObj);
    previewRowCount.value = '7';
    fireEvent.input(previewRowCount, { target: { value: '7' } });

    expect(component.getState().previewRowLimit).toBe(7);

    component.update({ previewRowLimit: 100 });

    expect(component.getState().previewRowLimit).toBe(50);
    expect(getPreviewRowCountInput(documentObj).value).toBe('50');

    component.destroy();
    dom.window.close();
  });

  test('setFileFormatType updates selected format through the same path as the selector UI', () => {
    const { component, documentObj, dom } = createHarness({
      props: { previewRowLimit: 1 },
    });

    component.setFileFormatType('json');

    expect(component.getState().selectedFormat).toBe('json');
    expect(documentObj.querySelector('#filedownload').textContent).toContain('.json');
    expect(getPreviewTextArea(documentObj).value).toBe('json:rows:1');

    component.destroy();
    dom.window.close();
  });

  test('setFileFormatType without an argument re-syncs the current format instead of resetting to csv', () => {
    const { component, documentObj, dom } = createHarness({
      props: { previewRowLimit: 1, selectedFormat: 'json' },
    });

    component.renderTextFromGrid();
    component.setFileFormatType();

    expect(component.getState().selectedFormat).toBe('json');
    expect(documentObj.querySelector('#filedownload').textContent).toContain('.json');
    expect(getPreviewTextArea(documentObj).value).toBe('json:rows:1');

    component.destroy();
    dom.window.close();
  });

  test('tracks preview text dirty state and imports preview-limited text through injected services', async () => {
    const { component, documentObj, dom, importer } = createHarness({
      props: { previewRowLimit: 2 },
    });

    const textArea = getPreviewTextArea(documentObj);
    const importButton = documentObj.querySelector('#setgridfromtextbutton');

    expect(importButton.disabled).toBe(true);

    textArea.value = 'Name,Role\nAda,Engineer\nBob,Tester\nCy,Analyst';
    fireEvent.input(textArea, { target: { value: textArea.value } });

    expect(component.getState().previewTextDirty).toBe(true);
    expect(importButton.disabled).toBe(false);

    fireEvent.click(importButton);

    await waitFor(() => expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1));
    expect(getPreviewTextArea(documentObj).value).toBe('csv:rows:2');
    expect(documentObj.querySelector('#import-progress-status').textContent).toBe('Import complete.');
    expect(component.getState().previewTextDirty).toBe(false);
    expect(importButton.disabled).toBe(true);

    component.destroy();
    dom.window.close();
  });

  test('uses component-owned download and copy services', async () => {
    const clipboardService = { copyFromTextArea: jest.fn() };
    const downloadService = { downloadText: jest.fn() };
    const { component, documentObj, dom } = createHarness({
      services: {
        clipboardService,
        downloadService,
      },
    });

    fireEvent.click(documentObj.querySelector('#settextfromgridbutton'));
    fireEvent.click(getCopyTextButton(documentObj));

    expect(clipboardService.copyFromTextArea).toHaveBeenCalledWith(getPreviewTextArea(documentObj));
    expect(getCopyTextButtonLabel(documentObj).textContent).toBe('Copied');

    fireEvent.click(documentObj.querySelector('#filedownload'));

    await waitFor(() =>
      expect(downloadService.downloadText).toHaveBeenCalledWith('export.csv', 'full:csv', {
        exportEncodingSettings: {
          lineEnding: 'crlf',
          includeBom: false,
        },
      })
    );
    expect(documentObj.querySelector('#export-progress-status').textContent).toBe('Download started.');

    component.destroy();
    dom.window.close();
  });

  test('reads selected files through the file-read service and previews before importing', async () => {
    const fileReadService = {
      readText: jest.fn(async (file, callbacks = {}) => {
        callbacks.onProgress?.({ loaded: 5, total: 10, lengthComputable: true });
        return 'Name,Role\nAda,Engineer';
      }),
    };
    const { component, documentObj, dom, importer } = createHarness({
      props: { previewRowLimit: 1 },
      services: { fileReadService },
    });
    const fileInput = documentObj.querySelector('#csvinput');

    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [{ name: 'sample.csv' }],
    });
    fireEvent.change(fileInput);

    await waitFor(() => expect(fileReadService.readText).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1));
    expect(getPreviewTextArea(documentObj).value).toBe('csv:rows:1');
    expect(documentObj.querySelector('#import-progress-status').textContent).toBe('Import complete.');

    component.destroy();
    dom.window.close();
  });

  test('imports clipboard text through the toolbar import control and shows completion status', async () => {
    const clipboardService = {
      copyFromTextArea: jest.fn(),
      readText: jest.fn(async () => '\uFEFFName,Role\r\nAda,Engineer'),
      canReadText: jest.fn(() => true),
    };
    const { component, documentObj, dom, importer } = createHarness({
      props: { previewRowLimit: 1 },
      services: { clipboardService },
    });

    fireEvent.click(documentObj.querySelector('[data-role="clipboard-import-button"]'));

    await waitFor(() => expect(clipboardService.readText).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(importer.importText).toHaveBeenCalledWith('csv', 'Name,Role\nAda,Engineer'));
    await waitFor(() => expect(getPreviewTextArea(documentObj).value).toBe('csv:rows:1'));
    await waitFor(() =>
      expect(documentObj.querySelector('#import-progress-status').textContent).toBe('Import complete.')
    );

    component.destroy();
    dom.window.close();
  });

  test('uses the root owner window FileReader for the default file-read path instead of ambient globals', async () => {
    let readerInstance;

    class FakeFileReader {
      constructor() {
        this.listeners = {};
        readerInstance = this;
      }

      addEventListener(name, callback) {
        this.listeners[name] = callback;
      }

      readAsText() {}

      emit(name, event = {}) {
        this.listeners[name]?.(event);
      }
    }

    const originalFileReader = global.FileReader;
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const documentObj = dom.window.document;
    global.document = documentObj;
    global.window = dom.window;
    delete global.FileReader;
    dom.window.FileReader = FakeFileReader;

    const exporter = {
      canExport: jest.fn(() => true),
      getFileExtensionFor: jest.fn((type) => `.${type}`),
      getGridAsGenericDataTable: jest.fn((limit) => createTable(limit)),
      getDataTableAs: jest.fn((type, dataTable) => `${type}:rows:${dataTable.getRowCount()}`),
      getGridAs: jest.fn((type) => `full:${type}`),
      getOptionsForType: jest.fn(() => undefined),
    };
    const importer = {
      canImport: jest.fn(() => true),
      getFileExtensionFor: jest.fn((type) => `.${type}`),
      toGenericDataTable: jest.fn(() => createTable(4)),
      setGridFromGenericDataTable: jest.fn(() => Promise.resolve()),
      importText: jest.fn(() => Promise.resolve()),
    };
    const component = createImportExportWorkspaceComponent({
      root: documentObj.getElementById('root'),
      documentObj,
      props: { previewRowLimit: 1 },
      services: {
        importer,
        exporter,
        createFormatOptionsPanel: createFakeFormatOptionsPanel,
        yieldToUi: async () => {},
        scheduleTimeoutFn: jest.fn(),
        requestConfirm: jest.fn(async () => true),
      },
    });

    try {
      const fileInput = documentObj.querySelector('#csvinput');

      Object.defineProperty(fileInput, 'files', {
        configurable: true,
        value: [{ name: 'owner-window.csv' }],
      });
      fireEvent.change(fileInput);

      expect(readerInstance).toBeInstanceOf(FakeFileReader);
      readerInstance.emit('progress', { loaded: 5, total: 10, lengthComputable: true });
      readerInstance.emit('load', { target: { result: 'Name,Role\nAda,Engineer' } });

      await waitFor(() => expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1));
      expect(getPreviewTextArea(documentObj).value).toBe('csv:rows:1');
      expect(documentObj.querySelector('#import-progress-status').textContent).toBe('Import complete.');
    } finally {
      if (typeof originalFileReader === 'undefined') {
        delete global.FileReader;
      } else {
        global.FileReader = originalFileReader;
      }
      component.destroy();
      dom.window.close();
    }
  });

  test('imports edit-mode text with busy and error handling through the importer adapter', async () => {
    const importer = {
      canImport: jest.fn(() => true),
      getFileExtensionFor: jest.fn((type) => `.${type}`),
      toGenericDataTable: jest.fn(() => createTable(4)),
      setGridFromGenericDataTable: jest.fn(() => Promise.resolve()),
      importText: jest.fn(() => Promise.resolve()),
    };
    const { component, documentObj, dom } = createHarness({
      props: { mode: 'edit' },
      services: { importer },
    });

    const textArea = getPreviewTextArea(documentObj);
    const importButton = documentObj.querySelector('#setgridfromtextbutton');
    textArea.value = 'Name,Role\nAda,Engineer';
    fireEvent.input(textArea, { target: { value: textArea.value } });

    fireEvent.click(importButton);

    await waitFor(() => expect(importer.importText).toHaveBeenCalledWith('csv', textArea.value));
    expect(component.getState().importBusy).toBe(false);
    expect(documentObj.querySelector('#import-progress-status').textContent).toBe('Import complete.');

    importer.importText.mockRejectedValueOnce(new Error('boom'));
    fireEvent.click(importButton);

    await waitFor(() =>
      expect(documentObj.querySelector('#import-progress-status').textContent).toBe(
        'Import failed. Check file format/options.'
      )
    );
    expect(component.getState().importBusy).toBe(false);

    component.destroy();
    dom.window.close();
  });

  test('can mount from the root ownerDocument without a global document', () => {
    const isolatedDom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const originalDocument = global.document;
    const originalWindow = global.window;
    delete global.document;
    delete global.window;

    try {
      const component = createImportExportWorkspaceComponent({
        root: isolatedDom.window.document.getElementById('root'),
        services: {
          createFormatOptionsPanel: createFakeFormatOptionsPanel,
          yieldToUi: async () => {},
          scheduleTimeoutFn: jest.fn(),
          requestConfirm: jest.fn(async () => true),
        },
      });

      expect(isolatedDom.window.document.querySelector('#tabbedTextArea')).not.toBeNull();
      expect(isolatedDom.window.document.querySelector('[data-role="text-preview-editor-root"]')).not.toBeNull();
      component.destroy();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
      isolatedDom.window.close();
    }
  });

  test('treats missing importer and exporter adapters as unsupported at mount time', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const documentObj = dom.window.document;
    global.document = documentObj;
    global.window = dom.window;

    const component = createImportExportWorkspaceComponent({
      root: documentObj.getElementById('root'),
      documentObj,
      services: {
        createFormatOptionsPanel: createFakeFormatOptionsPanel,
        yieldToUi: async () => {},
        scheduleTimeoutFn: jest.fn(),
        requestConfirm: jest.fn(async () => true),
      },
    });

    expect(component.getState().supportsImport).toBe(false);
    expect(component.getState().supportsExport).toBe(false);
    expect(documentObj.querySelector('#setgridfromtextbutton').disabled).toBe(true);
    expect(documentObj.querySelector('#settextfromgridbutton').disabled).toBe(true);
    expect(documentObj.querySelector('#filedownload').disabled).toBe(true);

    component.destroy();
    dom.window.close();
  });
});
