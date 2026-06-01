function createFileReadService({ FileReaderCtor = typeof FileReader !== 'undefined' ? FileReader : null } = {}) {
  return {
    readText(file, callbacks = {}) {
      if (!file) {
        return Promise.resolve(null);
      }

      if (!FileReaderCtor) {
        const error = new Error('FileReader is not available');
        callbacks.onError?.(error);
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReaderCtor();

        reader.addEventListener('progress', (event) => {
          callbacks.onProgress?.(event);
        });

        reader.addEventListener('load', (event) => {
          const text = event?.target?.result ?? '';
          callbacks.onLoad?.(text, event);
          resolve(text);
        });

        reader.addEventListener('error', (event) => {
          callbacks.onError?.(event);
          reject({ type: 'error', event });
        });

        reader.addEventListener('abort', (event) => {
          callbacks.onAbort?.(event);
          reject({ type: 'abort', event });
        });

        reader.readAsText(file);
      });
    },
  };
}

export { createFileReadService };
