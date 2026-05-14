import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { ImportExportControls } from '../../../js/gui_components/import-export-controls.js';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { GridExtension as GridExtensionTabulator } from '../../../js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

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

function createSharedTabulatorTableStub() {
  return {
    on: jest.fn(),
  };
}

describe('ImportExportControls preview/edit mode', () => {
  let dom;
  let controls;
  let importExportRoot;
  let requestConfirm;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
            <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
            <label id="autoPreviewLabel"><input type="checkbox" id="autoPreviewCheckbox"/>Auto Preview</label>
            <textarea id="markdownarea"></textarea>
            <div id="importExportRoot"></div>
        </body></html>`);
    global.window = dom.window;
    global.document = dom.window.document;
    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);

    requestConfirm = jest.fn(async () => true);
    controls = new ImportExportControls({ requestConfirm });
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
    expect(document.getElementById('import-export-error').textContent).toBe('Grid to Text only available in Edit mode');
    expect(controls.importer.importText).not.toHaveBeenCalled();
  });

  test('renders only first 10 rows when previewing from grid', () => {
    controls.renderTextFromGrid();
    expect(controls.exporter.getDataTableAs).toHaveBeenCalled();
    const previewTable = controls.exporter.getDataTableAs.mock.calls[0][1];
    expect(previewTable.getRowCount()).toBe(10);
    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('rows:10');
  });

  test('toggle to edit with confirm false clears textarea for manual editing', async () => {
    requestConfirm.mockResolvedValue(false);
    await controls.toggleTextEditMode();
    expect(controls.isPreviewTextMode()).toBe(false);
    expect(controls.exportControls.setTextFromString).toHaveBeenCalledWith('');
  });

  test('Set Grid From Text button is disabled in preview mode and enabled in edit mode', async () => {
    const button = document.querySelector('#setgridfromtextbutton');
    expect(button.disabled).toBe(true);

    await controls.toggleTextEditMode();
    expect(button.disabled).toBe(false);

    await controls.toggleTextEditMode();
    expect(button.disabled).toBe(true);
  });

  test('Set Grid From Text button enables in preview mode when text area is edited', () => {
    const button = document.querySelector('#setgridfromtextbutton');
    const textArea = document.getElementById('markdownarea');

    expect(button.disabled).toBe(true);
    textArea.value = 'a,b\n1,2';
    textArea.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(button.disabled).toBe(false);
  });

  test('Auto Preview defaults unchecked and is enabled in preview mode', () => {
    controls._syncGridFromTextButtonState();
    const autoPreviewCheckbox = document.getElementById('autoPreviewCheckbox');
    expect(autoPreviewCheckbox.checked).toBe(false);
    expect(autoPreviewCheckbox.disabled).toBe(false);
  });

  test('Auto Preview checkbox is disabled in edit mode', async () => {
    await controls.toggleTextEditMode();
    const autoPreviewCheckbox = document.getElementById('autoPreviewCheckbox');
    expect(autoPreviewCheckbox.disabled).toBe(true);
  });

  test('grid change auto-renders preview when Auto Preview is enabled in preview mode', () => {
    const autoPreviewCheckbox = document.getElementById('autoPreviewCheckbox');
    autoPreviewCheckbox.checked = true;
    autoPreviewCheckbox.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    const renderSpy = jest.spyOn(controls, 'renderTextFromGrid').mockImplementation(() => {});
    controls._maybeAutoPreviewFromGridChange();
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  test('enabling Auto Preview immediately refreshes preview text from grid', () => {
    const autoPreviewCheckbox = document.getElementById('autoPreviewCheckbox');
    const renderSpy = jest.spyOn(controls, 'renderTextFromGrid').mockImplementation(() => {});

    autoPreviewCheckbox.checked = true;
    autoPreviewCheckbox.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  test('grid change does not auto-render when Auto Preview is disabled', () => {
    const renderSpy = jest.spyOn(controls, 'renderTextFromGrid').mockImplementation(() => {});
    controls._maybeAutoPreviewFromGridChange();
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test('grid change does not auto-render in edit mode even when Auto Preview is enabled', async () => {
    const autoPreviewCheckbox = document.getElementById('autoPreviewCheckbox');
    autoPreviewCheckbox.checked = true;
    autoPreviewCheckbox.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    await controls.toggleTextEditMode();
    const renderSpy = jest.spyOn(controls, 'renderTextFromGrid').mockImplementation(() => {});
    controls._maybeAutoPreviewFromGridChange();
    expect(renderSpy).not.toHaveBeenCalled();
  });

  test('setGridChangeSource subscribes and auto-renders on callbacks', () => {
    const callbacks = [];
    const source = {
      onGridChanged: jest.fn((cb) => {
        callbacks.push(cb);
      }),
    };
    const autoPreviewCheckbox = document.getElementById('autoPreviewCheckbox');
    autoPreviewCheckbox.checked = true;
    autoPreviewCheckbox.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    const renderSpy = jest.spyOn(controls, 'renderTextFromGrid').mockImplementation(() => {});

    controls.setGridChangeSource(source);
    expect(source.onGridChanged).toHaveBeenCalledTimes(1);

    callbacks[0]();
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  test('setGridChangeSource unsubscribes previous listener before re-subscribing', () => {
    const firstUnsubscribe = jest.fn();
    const secondUnsubscribe = jest.fn();
    const firstSource = { onGridChanged: jest.fn(() => firstUnsubscribe) };
    const secondSource = { onGridChanged: jest.fn(() => secondUnsubscribe) };

    controls.setGridChangeSource(firstSource);
    expect(firstSource.onGridChanged).toHaveBeenCalledTimes(1);
    expect(firstUnsubscribe).not.toHaveBeenCalled();

    controls.setGridChangeSource(secondSource);
    expect(firstUnsubscribe).toHaveBeenCalledTimes(1);
    expect(secondSource.onGridChanged).toHaveBeenCalledTimes(1);
    expect(secondUnsubscribe).not.toHaveBeenCalled();
  });

  test('tabulator grid-change callbacks are shared across wrapper instances for same table', () => {
    const tabulatorTable = createSharedTabulatorTableStub();
    const firstWrapper = new GridExtensionTabulator(tabulatorTable);
    const secondWrapper = new GridExtensionTabulator(tabulatorTable);

    const spyA = jest.fn();
    const spyB = jest.fn();
    firstWrapper.onGridChanged(spyA);
    secondWrapper.onGridChanged(spyB);

    secondWrapper._notifyGridChanged();
    expect(spyA).toHaveBeenCalledTimes(1);
    expect(spyB).toHaveBeenCalledTimes(1);
  });

  test('Set Grid From Text input listener binds when textarea is added after controls', () => {
    const lateDom = new JSDOM(`<!doctype html><html><body>
            <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
            <div id="importExportRoot"></div>
        </body></html>`);
    global.window = lateDom.window;
    global.document = lateDom.window.document;

    const lateControls = new ImportExportControls();
    lateControls.addHTMLtoGui(document.getElementById('importExportRoot'));

    const textArea = document.createElement('textarea');
    textArea.id = 'markdownarea';
    document.body.appendChild(textArea);

    lateControls._syncGridFromTextButtonState();
    const button = document.querySelector('#setgridfromtextbutton');
    expect(button.disabled).toBe(true);

    textArea.value = 'a,b\n1,2';
    textArea.dispatchEvent(new lateDom.window.Event('input', { bubbles: true }));
    expect(button.disabled).toBe(false);

    lateDom.window.close();
  });

  test('recreating import-export HTML clears prior timed error display instance', () => {
    const clearSpy = jest.fn();
    controls.errorDisplay = { clear: clearSpy };

    controls.addHTMLtoGui(importExportRoot);

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(controls.errorDisplay).toBeDefined();
  });

  test('Set Grid From Text button disables again after preview mode import', async () => {
    const button = document.querySelector('#setgridfromtextbutton');
    const textArea = document.getElementById('markdownarea');

    textArea.value = 'a,b\n1,2';
    textArea.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(button.disabled).toBe(false);

    await controls.importTextArea();

    expect(controls.importer.setGridFromGenericDataTable).toHaveBeenCalled();
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

  test('Set Grid From Text imports when in edit mode', async () => {
    document.getElementById('markdownarea').value = 'a,b\n1,2';

    await controls.toggleTextEditMode();
    controls.importTextArea();

    expect(controls.importer.importText).toHaveBeenCalledWith('csv', 'a,b\n1,2');
  });

  test('toggle to edit with confirm true renders text from grid', async () => {
    requestConfirm.mockResolvedValue(true);
    await controls.toggleTextEditMode();

    expect(controls.isPreviewTextMode()).toBe(false);
    expect(controls.exportControls.renderTextFromGrid).toHaveBeenCalledTimes(1);
  });

  test('_previewThenImportToGrid throws when conversion fails', async () => {
    controls.importer.toGenericDataTable.mockReturnValue(null);

    await expect(controls._previewThenImportToGrid('csv', 'bad text')).rejects.toThrow(
      'Unable to parse input into data table.'
    );
  });

  test('_setActiveTypeIfPresent updates active unit-test subtab before fallback match', () => {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <ul id="conversionSubtasks">
        <li class="subtask-select" data-type="jest" data-types="jest,vitest,mocha">
          <a class="subtask-select-action" data-type="jest">JavaScript</a>
        </li>
        <li class="subtask-select active-type" data-type="jest" data-types="jest,vitest,mocha">
          <a class="subtask-select-action" data-type="jest">TypeScript</a>
        </li>
      </ul>
      `
    );

    controls._setActiveTypeIfPresent('vitest');

    const active = document.querySelector('.subtask-select.active-type');
    const inactive = document.querySelectorAll('.subtask-select')[0];
    expect(active.getAttribute('data-type')).toBe('vitest');
    expect(active.querySelector('.subtask-select-action').getAttribute('data-type')).toBe('vitest');
    expect(inactive.getAttribute('data-type')).toBe('jest');
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
            <label id="autoPreviewLabel"><input type="checkbox" id="autoPreviewCheckbox"/>Auto Preview</label>
            <textarea id="markdownarea"></textarea>
            <div id="markdown"></div>
            <div class="edit-area"></div>
            <div class="options-parent"></div>
            <div class="options-preview-splitter"></div>
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

    controls.applyCurrentTypeOptions({ header: false });

    expect(controls.importer.setOptionsForType).toHaveBeenCalledWith('csv', {
      outputFormat: 'csv',
      options: { header: false },
    });
    expect(controls.exporter.setOptionsForType).toHaveBeenCalledWith('csv', {
      outputFormat: 'csv',
      options: { header: false },
    });
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
        button.onclick = () => callbackFunc({ header: false });
      }),
      getOptionsFromGui: jest.fn(() => ({ header: false })),
    };

    controls.setOptionsViewForFormatType();

    const applyButton = document.querySelector('div.options-parent .apply-options');
    const delimiterInput = document.getElementById('test-delimiter');
    expect(applyButton.disabled).toBe(true);

    delimiterInput.value = '|';
    delimiterInput.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    expect(applyButton.disabled).toBe(false);

    applyButton.click();
    expect(controls.importer.setOptionsForType).toHaveBeenCalledWith('csv', {
      outputFormat: 'csv',
      options: { header: false },
    });
    expect(controls.exporter.setOptionsForType).toHaveBeenCalledWith('csv', {
      outputFormat: 'csv',
      options: { header: false },
    });
    expect(applyButton.disabled).toBe(true);
  });

  test('shows splitter when options panel is active and hides for unsupported format', () => {
    const splitter = document.querySelector('div.options-preview-splitter');
    const editArea = document.querySelector('div.edit-area');
    const textAreaContainer = document.getElementById('markdown');

    controls.setOptionsViewForFormatType();

    expect(splitter.style.display).toBe('block');
    expect(editArea.style.display).toBe('flex');
    expect(textAreaContainer.style.flex).toBe('1 1 auto');

    document.querySelector('li.active-type a').setAttribute('data-type', 'unknown');
    controls.setOptionsViewForFormatType();

    expect(splitter.style.display).toBe('none');
  });

  test('splitter drag resizes options panel width and clamps to min/max', () => {
    controls.setOptionsViewForFormatType();
    const splitter = document.querySelector('div.options-preview-splitter');
    const optionsParent = document.querySelector('div.options-parent');
    const editArea = document.querySelector('div.edit-area');

    editArea.getBoundingClientRect = () => ({ width: 1000 });

    splitter.dispatchEvent(
      new dom.window.MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 300, pointerId: 1 })
    );
    document.dispatchEvent(new dom.window.MouseEvent('pointermove', { bubbles: true, clientX: 380, pointerId: 1 }));
    expect(Number.parseFloat(optionsParent.style.width)).toBeGreaterThan(272);
    expect(document.body.classList.contains('is-resizing-split')).toBe(true);

    document.dispatchEvent(new dom.window.MouseEvent('pointermove', { bubbles: true, clientX: -500, pointerId: 1 }));
    expect(Number.parseFloat(optionsParent.style.width)).toBe(controls.minOptionsPanelWidthPx);

    document.dispatchEvent(new dom.window.MouseEvent('pointermove', { bubbles: true, clientX: 9999, pointerId: 1 }));
    expect(Number.parseFloat(optionsParent.style.width)).toBe(controls.maxOptionsPanelWidthPx);

    document.dispatchEvent(new dom.window.MouseEvent('pointerup', { bubbles: true, pointerId: 1 }));
    expect(document.body.classList.contains('is-resizing-split')).toBe(false);
  });
});
