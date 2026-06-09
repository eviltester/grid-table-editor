import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { applyExportTextEncoding, resolveExportTextEncodingSettings } from '@anywaydata/core';

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
          await new Promise((resolve, reject) => {
            const prefix = !wroteBom && resolvedEncodingSettings.includeBom ? '\uFEFF' : '';
            const ok = stream.write(`${prefix}${String(line ?? '')}${lineSuffix}`);
            wroteBom = true;
            if (ok) {
              resolve();
              return;
            }
            stream.once('drain', () => {
              if (streamError) {
                reject(streamError);
                return;
              }
              resolve();
            });
          });
        },
        async close() {
          if (streamError) {
            throw streamError;
          }
          await new Promise((resolve, reject) => {
            stream.end(() => resolve());
            if (streamError) {
              reject(streamError);
            }
          });
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
