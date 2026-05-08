export function createBunPlatform() {
  const bunRef = globalThis.Bun;
  return {
    name: 'bun',
    async readText(path) {
      const file = bunRef.file(path);
      return file.text();
    },
    async writeText(path, content) {
      await bunRef.write(path, content);
    },
    createLineWriter(path) {
      const writer = bunRef.file(path).writer();
      let writerError = null;
      let closed = false;
      return {
        async writeLine(line) {
          if (closed) {
            throw new Error('Cannot write to closed Bun line writer');
          }
          if (writerError) {
            throw writerError;
          }
          try {
            writer.write(`${line}\n`);
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
