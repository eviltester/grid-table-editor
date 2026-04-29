import { JSDOM } from 'jsdom';
import { ImportExportControls } from '../../js/gui_components/import-export-controls.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';

function makeDataTable(rowCount) {
  const table = new GenericDataTable();
  table.setHeaders(['A', 'B']);
  for (let index = 0; index < rowCount; index++) {
    table.appendDataRow([`a${index}`, `b${index}`]);
  }
  return table;
}

async function flushAsyncWork() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ImportExportControls preview/edit mode', () => {
  let dom;
  let controls;
  let importExportRoot;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
            <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
            <textarea id="markdownarea"></textarea>
            <div id="importExportRoot"></div>
        </body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);

    controls = new ImportExportControls();
    importExportRoot = document.getElementById('importExportRoot');
    controls.addHTMLtoGui(importExportRoot);
    controls.exportControls = {
      setTextFromString: jest.fn(),
      renderTextFromGrid: jest.fn(),
      setImportBusyState: jest.fn(),
    };
    controls.exporter = {
      getGridAsGenericDataTable: jest.fn((maxRows) => {
        if (typeof maxRows === 'number') {
          return makeDataTable(maxRows);
        }
        return makeDataTable(12);
      }),
      getDataTableAs: jest.fn((_type, dataTable) => `rows:${dataTable.getRowCount()}`),
      getOptionsForType: jest.fn(() => ({})),
      setOptionsForType: jest.fn(),
    };
    controls.importer = {
      importText: jest.fn(),
      toGenericDataTable: jest.fn(() => makeDataTable(25)),
      setGridFromGenericDataTable: jest.fn(),
      setOptionsForType: jest.fn(),
    };
    controls.optionsPanels = {
      csv: {
        getOptionsFromGui: () => ({}),
      },
    };
  });

  afterEach(() => {
    dom.window.close();
  });

  test('blocks Set Grid From Text in preview mode', () => {
    controls.importTextArea();
    expect(global.alert).toHaveBeenCalledWith('Grid to Text only availalable in Edit mode');
    expect(controls.importer.importText).not.toHaveBeenCalled();
  });

  test('renders only first 10 rows when previewing from grid', () => {
    controls.renderTextFromGrid();
    expect(controls.exporter.getDataTableAs).toHaveBeenCalled();
    const previewTable = controls.exporter.getDataTableAs.mock.calls[0][1];
    expect(previewTable.getRowCount()).toBe(10);
    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('rows:10');
  });

  test('toggle to edit with no-confirm clears textarea for manual editing', () => {
    global.confirm = jest.fn(() => false);
    controls.toggleTextEditMode();
    expect(controls.isPreviewTextMode()).toBe(false);
    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('');
  });

  test('Set Grid From Text button is disabled in preview mode and enabled in edit mode', () => {
    const button = document.querySelector('#setgridfromtextbutton');
    expect(button.disabled).toBe(true);

    controls.toggleTextEditMode();
    expect(button.disabled).toBe(false);

    controls.toggleTextEditMode();
    expect(button.disabled).toBe(true);
  });

  test('preview mode import renders preview and still loads full data into grid', async () => {
    const fullTable = makeDataTable(25);
    controls.importer.toGenericDataTable.mockReturnValue(fullTable);

    await controls._previewThenImportToGrid('csv', 'sample-text');

    const previewTable = controls.exporter.getDataTableAs.mock.calls[0][1];
    expect(previewTable.getRowCount()).toBe(10);
    expect(controls.importer.setGridFromGenericDataTable).toHaveBeenCalledWith(fullTable);
    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('rows:10');
  });

  test('Set Grid From Text imports when in edit mode', () => {
    document.getElementById('markdownarea').value = 'a,b\n1,2';

    controls.toggleTextEditMode();
    controls.importTextArea();

    expect(controls.importer.importText).toHaveBeenCalledWith('csv', 'a,b\n1,2');
  });

  test('toggle to edit with confirm true renders text from grid', () => {
    global.confirm = jest.fn(() => true);

    controls.toggleTextEditMode();

    expect(controls.isPreviewTextMode()).toBe(false);
    expect(controls.exportControls.renderTextFromGrid).toHaveBeenCalledTimes(1);
  });

  test('_previewThenImportToGrid throws when conversion fails', async () => {
    controls.importer.toGenericDataTable.mockReturnValue(null);

    await expect(controls._previewThenImportToGrid('csv', 'bad text')).rejects.toThrow(
      'Unable to parse input into data table.'
    );
  });
});

describe('ImportExportControls file reading and visibility', () => {
  let dom;
  let controls;
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

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
            <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
            <textarea id="markdownarea"></textarea>
            <div id="markdown"></div>
            <div class="edit-area"></div>
            <div class="options-parent"></div>
            <div id="importExportRoot"></div>
            <button id="copyTextButton">Copy</button>
        </body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
    global.FileReader = FakeFileReader;
    global.requestAnimationFrame = (callback) => callback();
    window.updateHelpHints = jest.fn();

    controls = new ImportExportControls();
    controls.addHTMLtoGui(document.getElementById('importExportRoot'));
    controls.exportControls = {
      setTextFromString: jest.fn(),
      renderTextFromGrid: jest.fn(),
      setImportBusyState: jest.fn(),
    };
    controls.exporter = {
      canExport: jest.fn(() => true),
      getGridAsGenericDataTable: jest.fn((maxRows) => makeDataTable(maxRows || 12)),
      getDataTableAs: jest.fn((_type, dataTable) => `rows:${dataTable.getRowCount()}`),
      getOptionsForType: jest.fn(() => ({ delimiter: ',' })),
      setOptionsForType: jest.fn(),
      getFileExtensionFor: jest.fn(() => '.csv'),
    };
    controls.importer = {
      canImport: jest.fn(() => true),
      importText: jest.fn(),
      toGenericDataTable: jest.fn(() => makeDataTable(12)),
      setGridFromGenericDataTable: jest.fn(),
      setOptionsForType: jest.fn(),
      getFileExtensionFor: jest.fn(() => '.csv'),
    };
    controls.optionsPanels = {
      csv: {
        getOptionsFromGui: jest.fn(() => ({})),
        addToGui: jest.fn(),
        setFromOptions: jest.fn(),
        setApplyCallback: jest.fn(),
      },
    };
  });

  afterEach(() => {
    dom.window.close();
  });

  test('readFile with no file clears progress status', () => {
    const status = document.getElementById('import-progress-status');
    status.textContent = 'Busy';
    status.style.display = 'inline-block';

    controls.readFile(null);

    expect(status.textContent).toBe('');
    expect(status.style.display).toBe('none');
    expect(controls.exportControls.setImportBusyState).toHaveBeenCalledWith(false);
  });

  test('readFile in preview mode updates progress and previews imported data', async () => {
    controls._yieldToUi = jest.fn(() => Promise.resolve());
    const setTextButton = document.getElementById('settextfromgridbutton');

    controls.readFile({ name: 'sample.csv' });
    expect(setTextButton.disabled).toBe(true);
    expect(controls.exportControls.setImportBusyState).toHaveBeenCalledWith(true);
    readerInstance.emit('progress', { lengthComputable: true, loaded: 5, total: 10 });
    expect(document.getElementById('import-progress-status').textContent).toContain('50%');

    readerInstance.emit('load', { target: { result: 'a,b\n1,2' } });
    await flushAsyncWork();

    expect(controls.importer.toGenericDataTable).toHaveBeenCalledWith('csv', 'a,b\n1,2');
    expect(controls.importer.setGridFromGenericDataTable).toHaveBeenCalled();
    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('rows:10');
    expect(setTextButton.disabled).toBe(false);
    expect(controls.exportControls.setImportBusyState).toHaveBeenLastCalledWith(false);
  });

  test('readFile in edit mode loads text area and imports full data', async () => {
    controls._yieldToUi = jest.fn(() => Promise.resolve());
    controls.textEditMode = 'edit';
    const setTextButton = document.getElementById('settextfromgridbutton');

    controls.readFile({ name: 'full.csv' });
    expect(setTextButton.disabled).toBe(true);
    readerInstance.emit('load', { target: { result: 'a,b\n1,2' } });
    await flushAsyncWork();

    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('a,b\n1,2');
    expect(controls.importer.importText).toHaveBeenCalledWith('csv', 'a,b\n1,2');
    expect(setTextButton.disabled).toBe(false);
    expect(controls.exportControls.setImportBusyState).toHaveBeenLastCalledWith(false);
  });

  test('readFile handles non-computable progress and failure statuses', () => {
    controls.readFile({ name: 'broken.csv' });

    readerInstance.emit('progress', { lengthComputable: false });
    expect(document.getElementById('import-progress-status').textContent).toContain('Loading broken.csv...');

    readerInstance.emit('error');
    expect(document.getElementById('import-progress-status').textContent).toBe('File read failed.');
    expect(controls.exportControls.setImportBusyState).toHaveBeenLastCalledWith(false);

    readerInstance.emit('abort');
    expect(document.getElementById('import-progress-status').textContent).toBe('File read cancelled.');
    expect(controls.exportControls.setImportBusyState).toHaveBeenLastCalledWith(false);
  });

  test('setFileFormatType hides unsupported import and export controls', () => {
    controls.importer.canImport.mockReturnValue(false);
    controls.exporter.canExport.mockReturnValue(false);

    controls.setFileFormatType();

    expect(document.getElementById('setgridfromtextbutton').style.visibility).toBe('hidden');
    expect(document.getElementById('dropzone').style.visibility).toBe('hidden');
    expect(document.getElementById('filedownload').style.visibility).toBe('hidden');
    expect(document.querySelector('.fileFormat').innerText).toBe('.csv');
  });

  test('applyCurrentTypeOptions updates importer/exporter and rerenders text', () => {
    controls.renderTextFromGrid = jest.fn();

    controls.applyCurrentTypeOptions({ delimiter: '|' });

    expect(controls.importer.setOptionsForType).toHaveBeenCalledWith('csv', { delimiter: '|' });
    expect(controls.exporter.setOptionsForType).toHaveBeenCalledWith('csv', { delimiter: '|' });
    expect(controls.renderTextFromGrid).toHaveBeenCalledTimes(1);
  });

  test('options apply button is enabled only when options are dirty', () => {
    controls.optionsPanels.csv = {
      addToGui: jest.fn(() => {
        document.querySelector('div.options-parent').innerHTML = `
          <div class="csv-options">
            <label>Delimiter <input type="text" id="test-delimiter" value=","></label>
            <div class="apply"><button class="apply-options">Apply</button></div>
          </div>
        `;
      }),
      setFromOptions: jest.fn(),
      setApplyCallback: jest.fn((callbackFunc) => {
        const button = document.querySelector('div.options-parent .apply-options');
        button.onclick = () => callbackFunc({ delimiter: '|' });
      }),
      getOptionsFromGui: jest.fn(() => ({ delimiter: '|' })),
    };

    controls.setOptionsViewForFormatType();

    const applyButton = document.querySelector('div.options-parent .apply-options');
    const delimiterInput = document.getElementById('test-delimiter');
    expect(applyButton.disabled).toBe(true);

    delimiterInput.value = '|';
    delimiterInput.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(applyButton.disabled).toBe(false);

    applyButton.click();
    expect(controls.importer.setOptionsForType).toHaveBeenCalledWith('csv', { delimiter: '|' });
    expect(controls.exporter.setOptionsForType).toHaveBeenCalledWith('csv', { delimiter: '|' });
    expect(applyButton.disabled).toBe(true);
  });
});
