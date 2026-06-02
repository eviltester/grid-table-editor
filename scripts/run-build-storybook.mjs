import { rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const OUTPUT_DIR = path.resolve('storybook-static');
const MAX_DELETE_ATTEMPTS = 8;
const RETRY_DELAY_MS = 500;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableDeleteError(error) {
  return ['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(error?.code);
}

async function removeOutputDirWithRetry() {
  for (let attempt = 1; attempt <= MAX_DELETE_ATTEMPTS; attempt += 1) {
    try {
      await rm(OUTPUT_DIR, { recursive: true, force: true });
      return;
    } catch (error) {
      if (!isRetryableDeleteError(error) || attempt === MAX_DELETE_ATTEMPTS) {
        throw error;
      }
      await delay(RETRY_DELAY_MS * attempt);
    }
  }
}

async function main() {
  await removeOutputDirWithRetry();

  const child = spawn('storybook', ['build', ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
