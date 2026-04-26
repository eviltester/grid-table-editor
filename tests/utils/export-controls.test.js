import { JSDOM } from 'jsdom';
import { ExportControls } from '../../js/gui_components/exportControls.js';
import { Download } from '../../js/gui_components/download.js';

describe('ExportControls', () => {
  let dom;
  let exporter;
  let controls;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body>
      <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
      <button id="filedownload">Download</button>
      <button id="copyTextButton">Copy</button>
      <textarea id="markdownarea">existing</textarea>
    </body></html>`);

    global.window = dom.window;
    global.document = dom.window.document;

    exporter = {
      canExport: jest.fn(() => true),
      getFileExtensionFor: jest.fn(() => '.csv'),
      getGridAs: jest.fn(() => 'row1,row2'),
    };

    controls = new ExportControls(exporter);
    controls.addHooksToPage(document);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    dom.window.close();
  });

  test('fileDownload renders text and downloads using extension for active type', () => {
    const downloadSpy = jest.spyOn(Download.prototype, 'downloadFile').mockImplementation(() => {});

    controls.fileDownload();

    expect(exporter.getGridAs).toHaveBeenCalledWith('csv');
    expect(exporter.getFileExtensionFor).toHaveBeenCalledWith('csv');
    expect(downloadSpy).toHaveBeenCalledWith('row1,row2');
  });

  test('fileDownload exits when type is not exportable', () => {
    exporter.canExport.mockReturnValue(false);
    const downloadSpy = jest.spyOn(Download.prototype, 'downloadFile').mockImplementation(() => {});

    controls.fileDownload();

    expect(exporter.getGridAs).not.toHaveBeenCalled();
    expect(downloadSpy).not.toHaveBeenCalled();
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
