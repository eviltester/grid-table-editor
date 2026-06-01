import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createFileReadService } from '../../../js/gui_components/app/import-export-adapters/file-read-service.js';
import { createFileImportBindingsAdapter } from '../../../js/gui_components/app/import-export-adapters/file-import-bindings-adapter.js';
import { createExportActionsAdapter } from '../../../js/gui_components/app/import-export-adapters/export-actions-adapter.js';

describe('import-export adapters', () => {
  describe('createFileReadService', () => {
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

    test('reads text and forwards progress updates', async () => {
      const onProgress = jest.fn();
      const service = createFileReadService({ FileReaderCtor: FakeFileReader });
      const promise = service.readText({ name: 'sample.csv' }, { onProgress });

      readerInstance.emit('progress', { loaded: 5, total: 10, lengthComputable: true });
      readerInstance.emit('load', { target: { result: 'a,b\n1,2' } });

      await expect(promise).resolves.toBe('a,b\n1,2');
      expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({ loaded: 5 }));
    });

    test('rejects with typed abort/error results', async () => {
      const service = createFileReadService({ FileReaderCtor: FakeFileReader });
      const abortPromise = service.readText({ name: 'abort.csv' });
      readerInstance.emit('abort', { reason: 'cancelled' });
      await expect(abortPromise).rejects.toEqual({
        type: 'abort',
        event: { reason: 'cancelled' },
      });

      const errorPromise = service.readText({ name: 'broken.csv' });
      readerInstance.emit('error', { reason: 'broken' });
      await expect(errorPromise).rejects.toEqual({
        type: 'error',
        event: { reason: 'broken' },
      });
    });
  });

  describe('createFileImportBindingsAdapter', () => {
    let dom;
    let documentObj;

    beforeEach(() => {
      dom = new JSDOM(`<!doctype html><html><body>
        <div id="root">
          <label id="dropzone"><input type="file" id="csvinput" /></label>
        </div>
      </body></html>`);
      documentObj = dom.window.document;
    });

    afterEach(() => {
      dom.window.close();
    });

    test('binds file input and drop-zone behavior through explicit callbacks', () => {
      const onFileSelected = jest.fn();
      const configureAsDropZone = jest.fn();
      const destroy = jest.fn();
      const adapter = createFileImportBindingsAdapter({
        root: documentObj.getElementById('root'),
        onFileSelected,
        createDragDropControl: (readFileFunction) => ({
          configureAsDropZone: (element) => {
            configureAsDropZone(element);
            readFileFunction({ name: 'drop.csv' });
          },
          destroy,
        }),
      });

      expect(configureAsDropZone).toHaveBeenCalledWith(documentObj.getElementById('dropzone'));
      expect(onFileSelected).toHaveBeenCalledWith({ name: 'drop.csv' });

      const fileInput = documentObj.getElementById('csvinput');
      Object.defineProperty(fileInput, 'files', {
        configurable: true,
        value: [{ name: 'pick.csv' }],
      });
      fileInput.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
      expect(onFileSelected).toHaveBeenCalledWith({ name: 'pick.csv' });

      Object.defineProperty(fileInput, 'value', {
        configurable: true,
        writable: true,
        value: 'stale',
      });
      fileInput.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
      expect(fileInput.value).toBe('');

      adapter.destroy();
      expect(destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createExportActionsAdapter', () => {
    let dom;
    let documentObj;

    beforeEach(() => {
      dom = new JSDOM(`<!doctype html><html><body>
        <ul><li class="active-type"><a data-type="csv" href="#">CSV</a></li></ul>
        <div id="root">
          <button id="filedownload"></button>
          <div id="export-progress-status"></div>
          <textarea id="markdownarea"></textarea>
          <button id="copyTextButton">Copy</button>
        </div>
      </body></html>`);
      documentObj = dom.window.document;
    });

    afterEach(() => {
      dom.window.close();
    });

    test('copies, renders text, and downloads through injected services', async () => {
      const clipboardService = { copyFromTextArea: jest.fn() };
      const downloadService = { downloadText: jest.fn() };
      const scheduleTimeoutFn = jest.fn();
      const exporter = {
        canExport: jest.fn(() => true),
        getFileExtensionFor: jest.fn(() => '.csv'),
        getGridAs: jest.fn(() => 'A,B\n1,2'),
      };

      const adapter = createExportActionsAdapter({
        root: documentObj.getElementById('root'),
        documentObj,
        exporter,
        clipboardService,
        downloadService,
        scheduleTimeoutFn,
      });
      adapter.bind();

      adapter.renderTextFromGrid();
      expect(documentObj.getElementById('markdownarea').value).toBe('A,B\n1,2');

      adapter.copyText();
      expect(clipboardService.copyFromTextArea).toHaveBeenCalledWith(documentObj.getElementById('markdownarea'));
      expect(documentObj.getElementById('copyTextButton').innerText).toBe('Copied');

      await adapter.fileDownload();
      expect(downloadService.downloadText).toHaveBeenCalledWith('export.csv', 'A,B\n1,2');
      expect(scheduleTimeoutFn).toHaveBeenCalled();
    });
  });
});
