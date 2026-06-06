import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createFileReadService } from '../../../js/gui_components/app/import-export-adapters/file-read-service.js';
import { createFileImportBindingsAdapter } from '../../../js/gui_components/app/import-export-adapters/file-import-bindings-adapter.js';

describe('import-export adapters', () => {
  test('file-import bindings adapter resolves through its direct module', () => {
    expect(typeof createFileImportBindingsAdapter).toBe('function');
  });

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

    test('prefers injected owner-window FileReader over ambient globals', async () => {
      const isolatedDom = new JSDOM(`<!doctype html><html><body></body></html>`);
      const ownerWindowObj = {
        FileReader: FakeFileReader,
      };
      const originalFileReader = global.FileReader;
      global.FileReader = jest.fn();

      try {
        const service = createFileReadService({
          documentObj: isolatedDom.window.document,
          windowObj: ownerWindowObj,
        });
        const promise = service.readText({ name: 'owner-window.csv' });

        expect(readerInstance).toBeInstanceOf(FakeFileReader);
        expect(global.FileReader).not.toHaveBeenCalled();

        readerInstance.emit('load', { target: { result: 'name\nAda' } });
        await expect(promise).resolves.toBe('name\nAda');
      } finally {
        if (typeof originalFileReader === 'undefined') {
          delete global.FileReader;
        } else {
          global.FileReader = originalFileReader;
        }
        isolatedDom.window.close();
      }
    });
  });

  describe('createFileImportBindingsAdapter', () => {
    let dom;
    let documentObj;

    beforeEach(() => {
      dom = new JSDOM(`<!doctype html><html><body>
        <div id="root">
          <label id="dropzone" data-role="drop-zone"><input type="file" id="csvinput" data-role="file-input" /></label>
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
        createDragDropAdapterFn: (onFileDrop) => ({
          configureAsDropZone: (element) => {
            configureAsDropZone(element);
            onFileDrop({ name: 'drop.csv' });
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
});
