import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { ExportControls } from '../../../js/gui_components/app/exportControls.js';
import { Download } from '../../../js/gui_components/shared/download.js';

async function flushAsyncWork() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ExportControls', () => {
  let dom;
  let exporter;
  let controls;

  beforeEach(() => {
    jest.useRealTimers();
    dom = new JSDOM(`<!doctype html><html><body>
      <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
      <button id="filedownload">Download</button>
      <button id="copyTextButton">Copy</button>
      <textarea id="markdownarea">existing</textarea>
      <div id="export-progress-status" class="import-progress-status" style="display:none;"></div>
    </body></html>`);

    global.window = dom.window;
    global.document = dom.window.document;
    global.requestAnimationFrame = (callback) => callback();

    exporter = {
      canExport: jest.fn(() => true),
      getFileExtensionFor: jest.fn(() => '.csv'),
      getGridAs: jest.fn(() => 'row1,row2'),
    };

    controls = new ExportControls(exporter);
    controls.addHooksToPage(document);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    dom.window.close();
  });

  test('fileDownload renders text and downloads using extension for active type', async () => {
    const downloadSpy = jest.spyOn(Download.prototype, 'downloadFile').mockImplementation(() => {});
    const button = document.getElementById('filedownload');
    const statusElem = document.getElementById('export-progress-status');

    const inFlightDownload = controls.fileDownload();
    expect(button.disabled).toBe(true);
    expect(statusElem.style.display).toBe('inline-block');

    await inFlightDownload;
    await flushAsyncWork();

    expect(exporter.getGridAs).toHaveBeenCalledWith('csv');
    expect(exporter.getFileExtensionFor).toHaveBeenCalledWith('csv');
    expect(downloadSpy).toHaveBeenCalledWith('row1,row2');
    expect(statusElem.textContent).toContain('Download started.');
    expect(button.disabled).toBe(false);
  });

  test('fileDownload exits when type is not exportable', async () => {
    exporter.canExport.mockReturnValue(false);
    const downloadSpy = jest.spyOn(Download.prototype, 'downloadFile').mockImplementation(() => {});
    const statusSpy = jest.spyOn(controls, '_setExportProgressStatus');
    const button = document.getElementById('filedownload');
    const statusElem = document.getElementById('export-progress-status');

    await controls.fileDownload();
    await flushAsyncWork();

    expect(exporter.getGridAs).not.toHaveBeenCalled();
    expect(downloadSpy).not.toHaveBeenCalled();
    expect(statusSpy).toHaveBeenCalledWith('Export not available for this format.', false);
    expect(statusElem.style.display).toBe('inline-block');
    expect(button.disabled).toBe(false);
  });

  test('fileDownload uses async exporter path when available', async () => {
    exporter.getGridAsAsync = jest.fn(async (_type, progressCallback) => {
      progressCallback('Formatting CSV... 100%');
      return 'async,row';
    });
    const downloadSpy = jest.spyOn(Download.prototype, 'downloadFile').mockImplementation(() => {});

    await controls.fileDownload();

    expect(exporter.getGridAsAsync).toHaveBeenCalledWith('csv', expect.any(Function));
    expect(downloadSpy).toHaveBeenCalledWith('async,row');
  });

  test('import busy state keeps download button disabled', () => {
    const button = document.getElementById('filedownload');

    controls.setImportBusyState(true);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');

    controls.setImportBusyState(false);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('false');
  });

  test('copyText selects textarea and updates button label', () => {
    const textarea = document.getElementById('markdownarea');
    const selectSpy = jest.spyOn(textarea, 'select').mockImplementation(() => {});
    const rangeSpy = jest.spyOn(textarea, 'setSelectionRange').mockImplementation(() => {});
    document.execCommand = jest.fn(() => true);

    controls.copyText();

    expect(selectSpy).toHaveBeenCalled();
    expect(rangeSpy).toHaveBeenCalledWith(0, 99999);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(document.getElementById('copyTextButton').innerText).toBe('Copied');
  });
});
