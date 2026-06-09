import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { applyExportTextEncoding, resolveExportTextEncodingSettings } from '@anywaydata/core';

function waitForStreamEvent(stream, eventName, startOperation, { shouldResolveImmediately = () => false } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      stream.off(eventName, handleEvent);
      stream.off('error', handleError);
    };

    const settle = (callback, value) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      callback(value);
    };

    const handleEvent = () => settle(resolve);
    const handleError = (error) => settle(reject, error);

    stream.once(eventName, handleEvent);
    stream.once('error', handleError);

    try {
      const result = startOperation();
      if (shouldResolveImmediately(result)) {
        settle(resolve);
      }
    } catch (error) {
      settle(reject, error);
    }
  });
}

export function createNodePlatform() {
  return {
    name: 'node',
    getRuntimePlatform() {
      return process.platform;
    },
    async readText(path) {
      return fs.readFile(path, 'utf8');
    },
    async writeText(path, content, exportEncodingSettings = {}) {
      const encodedContent = applyExportTextEncoding(content, exportEncodingSettings, { platform: process.platform });
      await fs.writeFile(path, encodedContent, 'utf8');
    },
    createLineWriter(path, exportEncodingSettings = {}) {
      const resolvedEncodingSettings = resolveExportTextEncodingSettings(exportEncodingSettings, {
        platform: process.platform,
      });
      const lineSuffix = resolvedEncodingSettings.lineEnding === 'crlf' ? '\r\n' : '\n';
      const stream = createWriteStream(path, { encoding: 'utf8' });
      let streamError = null;
      let wroteBom = false;
      stream.on('error', (error) => {
        streamError = error;
      });
      return {
        async writeLine(line) {
          if (streamError) {
            throw streamError;
          }
          await waitForStreamEvent(
            stream,
            'drain',
            () => {
              const prefix = !wroteBom && resolvedEncodingSettings.includeBom ? '\uFEFF' : '';
              const ok = stream.write(`${prefix}${String(line ?? '')}${lineSuffix}`);
              wroteBom = true;
              return ok;
            },
            {
              shouldResolveImmediately(result) {
                return result !== false;
              },
            }
          );
        },
        async close() {
          if (streamError) {
            throw streamError;
          }
          await waitForStreamEvent(stream, 'finish', () => stream.end());
        },
      };
    },
    stdout(text) {
      process.stdout.write(text);
    },
    stderr(text) {
      process.stderr.write(text);
    },
  };
}
