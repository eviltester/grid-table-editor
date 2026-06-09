import { EventEmitter } from 'node:events';
import { describe, expect, jest, test } from '@jest/globals';

class FakeWriteStream extends EventEmitter {
  constructor({ onWrite, onEnd } = {}) {
    super();
    this.onWrite = onWrite ?? (() => true);
    this.onEnd = onEnd ?? (() => {});
  }

  write(chunk) {
    return this.onWrite(chunk);
  }

  end() {
    this.onEnd();
  }
}

async function loadNodePlatformWithStream(fakeStream) {
  jest.resetModules();
  jest.unstable_mockModule('node:fs', () => ({
    createWriteStream: jest.fn(() => fakeStream),
  }));

  const module = await import('../platform/node-platform.js');
  return module.createNodePlatform();
}

describe('node platform line writer', () => {
  test('rejects writeLine when a stream error occurs while waiting for drain', async () => {
    const expectedError = new Error('disk full');
    const fakeStream = new FakeWriteStream({
      onWrite() {
        setTimeout(() => {
          fakeStream.emit('error', expectedError);
        }, 0);
        return false;
      },
    });

    const platform = await loadNodePlatformWithStream(fakeStream);
    const writer = platform.createLineWriter('output.csv');

    await expect(writer.writeLine('row-1')).rejects.toThrow(expectedError.message);
  });

  test('rejects close when a stream error occurs before finish', async () => {
    const expectedError = new Error('flush failed');
    const fakeStream = new FakeWriteStream({
      onEnd() {
        setTimeout(() => {
          fakeStream.emit('error', expectedError);
        }, 0);
      },
    });

    const platform = await loadNodePlatformWithStream(fakeStream);
    const writer = platform.createLineWriter('output.csv');

    await expect(writer.close()).rejects.toThrow(expectedError.message);
  });
});
