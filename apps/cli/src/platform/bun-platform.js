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
      let buffer = '';
      return {
        async writeLine(line) {
          buffer += `${line}\n`;
        },
        async close() {
          await bunRef.write(path, buffer);
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
