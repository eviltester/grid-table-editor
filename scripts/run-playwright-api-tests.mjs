import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const cacheDir = path.join(repoRoot, 'test-results', 'playwright-api-transform-cache');

await rm(cacheDir, { recursive: true, force: true });
await mkdir(cacheDir, { recursive: true });

const child = spawn(
  process.execPath,
  ['./node_modules/@playwright/test/cli.js', 'test', '--config=playwright-api.config.js'],
  {
    cwd: repoRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      PWTEST_CACHE_DIR: cacheDir,
    },
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
