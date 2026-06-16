import { getDefaultDocumentObj, getDefaultWindowObj, resolveWindowObj } from './dom/default-objects.js';

function createTextFileReadService({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  FileReaderCtor,
} = {}) {
  const resolvedWindowObj = resolveWindowObj(windowObj, documentObj);
  const ResolvedFileReaderCtor = FileReaderCtor || resolvedWindowObj?.FileReader || globalThis.FileReader || null;

  return {
    readText(file, callbacks = {}) {
      if (!file) {
        return Promise.resolve(null);
      }

      if (!ResolvedFileReaderCtor) {
        const error = new Error('FileReader is not available');
        callbacks?.onError?.(error);
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        const reader = new ResolvedFileReaderCtor();

        reader.addEventListener('progress', (event) => {
          callbacks?.onProgress?.(event);
        });

        reader.addEventListener('load', (event) => {
          const text = event?.target?.result ?? '';
          callbacks?.onLoad?.(text, event);
          resolve(text);
        });

        reader.addEventListener('error', (event) => {
          callbacks?.onError?.(event);
          reject({ type: 'error', event });
        });

        reader.addEventListener('abort', (event) => {
          callbacks?.onAbort?.(event);
          reject({ type: 'abort', event });
        });

        reader.readAsText(file);
      });
    },
  };
}

export { createTextFileReadService };
