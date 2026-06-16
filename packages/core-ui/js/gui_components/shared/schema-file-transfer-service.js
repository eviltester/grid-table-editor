import { getDefaultDocumentObj, getDefaultWindowObj } from './dom/default-objects.js';
import { Download } from './download.js';
import { createTextFileReadService } from './text-file-read-service.js';

const DEFAULT_SCHEMA_FILENAME = 'schema.txt';

function normalizeSchemaFileText(text) {
  const rawText = typeof text === 'string' ? text : String(text ?? '');
  return rawText.replace(/^\uFEFF/u, '').replace(/\r\n?/gu, '\n');
}

function toSchemaFileReadError(error) {
  const type = error?.type === 'abort' || error?.name === 'AbortError' ? 'aborted' : 'failed';
  const wrappedError = new Error(`Reading the schema file ${type}.`, { cause: error });

  if (wrappedError.cause === undefined) {
    wrappedError.cause = error;
  }

  return wrappedError;
}

function createSchemaFileTransferService({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  fileReadService = createTextFileReadService({ documentObj, windowObj }),
  DownloadCtor = Download,
  URLObj,
  BlobCtor,
  defaultFilename = DEFAULT_SCHEMA_FILENAME,
} = {}) {
  return {
    async readSchemaTextFile(file, callbacks = {}) {
      try {
        const text = await fileReadService.readText(file, callbacks);
        return normalizeSchemaFileText(text);
      } catch (error) {
        throw toSchemaFileReadError(error);
      }
    },

    downloadSchemaText(schemaText, { filename = defaultFilename, mimeType = 'text/plain;charset=utf-8' } = {}) {
      return new DownloadCtor(filename, {
        documentObj,
        windowObj,
        URLObj,
        BlobCtor,
      }).downloadFile(String(schemaText ?? ''), { mimeType });
    },
  };
}

export { DEFAULT_SCHEMA_FILENAME, createSchemaFileTransferService, normalizeSchemaFileText, toSchemaFileReadError };
