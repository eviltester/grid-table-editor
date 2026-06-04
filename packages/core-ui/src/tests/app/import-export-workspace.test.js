import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { jest } from '@jest/globals';
import { fireEvent, waitFor } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
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

  test('mounts real controls, normalizes preview row count, and renders format previews without legacy controls', () => {
    const { component, documentObj, dom, exporter } = createHarness({
      props: { previewRowLimit: 0 },
    });

    expect(documentObj.querySelector('#tabbedTextArea')).not.toBeNull();
    expect(documentObj.querySelector('#settextfromgridbutton')).not.toBeNull();
    expect(documentObj.querySelector('#previewRowsCount')).not.toBeNull();
    expect(documentObj.querySelector('#previewRowsCount').getAttribute('aria-label')).toBe('Preview row count');
    expect(component.getState().previewRowLimit).toBe(1);
    fireEvent.click(documentObj.querySelector('#settextfromgridbutton'));

    expect(exporter.getGridAsGenericDataTable).toHaveBeenCalledWith(1);
    expect(documentObj.querySelector('#markdownarea').value).toBe('csv:rows:1');

    fireEvent.click(documentObj.querySelector('.type-select-action[data-type="json"]'));

    expect(component.getState().selectedFormat).toBe('json');
    expect(documentObj.querySelector('#markdownarea').value).toBe('json:rows:1');
    expect(documentObj.querySelector('#filedownload').textContent).toContain('.json');

    const previewRowCount = documentObj.querySelector('#previewRowsCount');
    previewRowCount.value = '7';
    fireEvent.input(previewRowCount, { target: { value: '7' } });

    expect(component.getState().previewRowLimit).toBe(7);

    component.update({ previewRowLimit: 100 });

    expect(component.getState().previewRowLimit).toBe(50);
    expect(documentObj.querySelector('#previewRowsCount').value).toBe('50');

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
    expect(documentObj.querySelector('#markdownarea').value).toBe('json:rows:1');

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
    expect(documentObj.querySelector('#markdownarea').value).toBe('json:rows:1');

    component.destroy();
    dom.window.close();
  });

  test('tracks preview text dirty state and imports preview-limited text through injected services', async () => {
    const { component, documentObj, dom, importer } = createHarness({
      props: { previewRowLimit: 2 },
    });

    const textArea = documentObj.querySelector('#markdownarea');
    const importButton = documentObj.querySelector('#setgridfromtextbutton');

    expect(importButton.disabled).toBe(true);

    textArea.value = 'Name,Role\nAda,Engineer\nBob,Tester\nCy,Analyst';
    fireEvent.input(textArea, { target: { value: textArea.value } });

    expect(component.getState().previewTextDirty).toBe(true);
    expect(importButton.disabled).toBe(false);

    fireEvent.click(importButton);

    await waitFor(() => expect(importer.setGridFromGenericDataTable).toHaveBeenCalledTimes(1));
    expect(documentObj.querySelector('#markdownarea').value).toBe('csv:rows:2');
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
    fireEvent.click(documentObj.querySelector('#copyTextButton'));

    expect(clipboardService.copyFromTextArea).toHaveBeenCalledWith(documentObj.querySelector('#markdownarea'));
    expect(documentObj.querySelector('#copyTextButton').textContent).toBe('Copied');

    fireEvent.click(documentObj.querySelector('#filedownload'));

    await waitFor(() => expect(downloadService.downloadText).toHaveBeenCalledWith('export.csv', 'full:csv'));
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
    expect(documentObj.querySelector('#markdownarea').value).toBe('csv:rows:1');
    expect(documentObj.querySelector('#import-progress-status').textContent).toBe('Import complete.');

    component.destroy();
    dom.window.close();
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

    const textArea = documentObj.querySelector('#markdownarea');
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
