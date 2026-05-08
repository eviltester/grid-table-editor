import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';

export function createNodePlatform() {
  return {
    name: 'node',
    async readText(path) {
      return fs.readFile(path, 'utf8');
    },
    async writeText(path, content) {
      await fs.writeFile(path, content, 'utf8');
    },
    createLineWriter(path) {
      const stream = createWriteStream(path, { encoding: 'utf8' });
      let streamError = null;
      stream.on('error', (error) => {
        streamError = error;
      });
      return {
        async writeLine(line) {
          if (streamError) {
            throw streamError;
          }
          await new Promise((resolve, reject) => {
            const ok = stream.write(`${line}\n`);
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
