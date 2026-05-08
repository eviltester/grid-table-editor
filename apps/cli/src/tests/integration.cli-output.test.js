import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '../..');
const cliEntry = path.join(repoRoot, 'apps', 'cli', 'src', 'node-entry.js');

function runCli(args) {
  return spawnSync('node', [cliEntry, 'generate', ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

test('integration: writes generated content to stdout when no output file is provided', () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv']);

  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(result.stdout).toContain('"Company"');
  expect(result.stdout).toContain('AnyWayData');
});

test('integration: writes generated content to file and keeps stdout progress-only in test mode', async () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const outputPath = path.join(os.tmpdir(), `anywaydata-cli-test-${Date.now()}.csv`);

  const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath, '--testMode']);

  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(result.stdout).toContain('> Processing Input File');
  expect(result.stdout).toContain('> Writing output to');
  expect(result.stdout).not.toContain('"Company","AnyWayData"');

  const written = await fs.readFile(outputPath, 'utf8');
  expect(written).toContain('"Company"');
  expect(written).toContain('AnyWayData');
});
