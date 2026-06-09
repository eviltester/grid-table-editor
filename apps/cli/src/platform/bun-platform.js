import { applyExportTextEncoding, resolveExportTextEncodingSettings } from '@anywaydata/core';

export function createBunPlatform() {
  const bunRef = globalThis.Bun;
  return {
    name: 'bun',
    getRuntimePlatform() {
      return process.platform;
    },
    async readText(path) {
      const file = bunRef.file(path);
      return file.text();
    },
    async writeText(path, content, exportEncodingSettings = {}) {
      await bunRef.write(
        path,
        applyExportTextEncoding(content, exportEncodingSettings, { platform: process.platform })
      );
    },
    createLineWriter(path, exportEncodingSettings = {}) {
      const resolvedEncodingSettings = resolveExportTextEncodingSettings(exportEncodingSettings, {
        platform: process.platform,
      });
      const lineSuffix = resolvedEncodingSettings.lineEnding === 'crlf' ? '\r\n' : '\n';
      const writer = bunRef.file(path).writer();
      let writerError = null;
      let closed = false;
      let wroteBom = false;
      return {
        async writeLine(line) {
          if (closed) {
            throw new Error('Cannot write to closed Bun line writer');
          }
          if (writerError) {
            throw writerError;
          }
          try {
            const prefix = !wroteBom && resolvedEncodingSettings.includeBom ? '\uFEFF' : '';
            writer.write(`${prefix}${String(line ?? '')}${lineSuffix}`);
            wroteBom = true;
          } catch (error) {
            writerError = error;
            throw error;
          }
        },
        async close() {
          if (closed) {
            return;
          }
          closed = true;
          if (writerError) {
            throw writerError;
          }
          try {
            await Promise.resolve(writer.flush?.());
            await Promise.resolve(writer.end?.());
          } catch (error) {
            writerError = error;
            throw error;
          }
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
