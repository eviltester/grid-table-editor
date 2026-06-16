import {
  createSchemaFileTransferService,
  normalizeSchemaFileText,
} from '../../../js/gui_components/shared/schema-file-transfer-service.js';
import { jest } from '@jest/globals';

describe('schema-file-transfer-service', () => {
  test('normalizes schema text line endings and byte order mark', async () => {
    const fileReadService = {
      readText: jest.fn(async () => '\uFEFFName\r\nliteral(Ada)\rStatus\r\nliteral(active)'),
    };
    const service = createSchemaFileTransferService({ fileReadService });

    await expect(service.readSchemaTextFile({ name: 'schema.txt' })).resolves.toBe(
      'Name\nliteral(Ada)\nStatus\nliteral(active)'
    );
    expect(fileReadService.readText).toHaveBeenCalledWith({ name: 'schema.txt' }, {});
    expect(normalizeSchemaFileText('\uFEFFOne\r\nTwo\rThree')).toBe('One\nTwo\nThree');
  });

  test('wraps non-error file read failures in a user-facing error', async () => {
    const fileReadError = { type: 'error', event: { target: { error: { message: 'boom' } } } };
    const fileReadService = {
      readText: jest.fn(async () => {
        throw fileReadError;
      }),
    };
    const service = createSchemaFileTransferService({ fileReadService });

    await expect(service.readSchemaTextFile({ name: 'schema.txt' })).rejects.toMatchObject({
      message: 'Reading the schema file failed.',
      cause: fileReadError,
    });
  });

  test('wraps error instances in the normalized failed schema read contract', async () => {
    const fileReadError = new Error('boom');
    const fileReadService = {
      readText: jest.fn(async () => {
        throw fileReadError;
      }),
    };
    const service = createSchemaFileTransferService({ fileReadService });

    await expect(service.readSchemaTextFile({ name: 'schema.txt' })).rejects.toMatchObject({
      message: 'Reading the schema file failed.',
      cause: fileReadError,
    });
  });

  test('wraps aborted file reads in a clear abort error', async () => {
    const fileReadAbort = { type: 'abort', event: {} };
    const fileReadService = {
      readText: jest.fn(async () => {
        throw fileReadAbort;
      }),
    };
    const service = createSchemaFileTransferService({ fileReadService });

    await expect(service.readSchemaTextFile({ name: 'schema.txt' })).rejects.toMatchObject({
      message: 'Reading the schema file aborted.',
      cause: fileReadAbort,
    });
  });
});
