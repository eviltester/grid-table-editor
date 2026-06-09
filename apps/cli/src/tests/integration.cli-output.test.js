import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFilePath);
const repoRoot = path.resolve(thisDir, '../../../../');
const cliEntry = path.join(repoRoot, 'apps', 'cli', 'src', 'node-entry.js');
const utf8BomBytes = [0xef, 0xbb, 0xbf];

function runCli(args) {
  return spawnSync('node', [cliEntry, 'generate', ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

async function withTempOutputPath(name, run) {
  const outputPath = path.join(os.tmpdir(), `anywaydata-cli-${name}-${Date.now()}.csv`);
  try {
    await run(outputPath);
  } finally {
    try {
      await fs.unlink(outputPath);
    } catch {
      // Ignore missing file cleanup races.
    }
  }
}

function hasUtf8Bom(buffer) {
  return utf8BomBytes.every((byte, index) => buffer[index] === byte);
}

test('integration: writes generated content to stdout when no output file is provided', () => {
  const inputPath = path.join(repoRoot, 'apps', 'cli', 'examples', 'company-literal.txt');
  const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv']);

  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(result.stdout).toContain('"Company"');
  expect(result.stdout).toContain('AnyWayData');
});

test('integration: writes generated content to file and keeps stdout progress-only in test mode', async () => {
  const inputPath = path.join(repoRoot, 'apps', 'cli', 'examples', 'company-literal.txt');
  const outputPath = path.join(os.tmpdir(), `anywaydata-cli-test-${Date.now()}.csv`);
  try {
    const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath, '--testMode']);

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('> Processing Input File');
    expect(result.stdout).toContain('> Writing output to');
    expect(result.stdout).not.toMatch(/^"Company"(?:,|$)/m);
    expect(result.stdout).not.toMatch(/^"AnyWayData"(?:,|$)/m);

    const written = await fs.readFile(outputPath, 'utf8');
    expect(written).toContain('"Company"');
    expect(written).toContain('AnyWayData');
  } finally {
    try {
      await fs.unlink(outputPath);
    } catch {
      // Ignore missing file cleanup races.
    }
  }
});

test('integration: writes a UTF-8 BOM when --bom is true', async () => {
  const inputPath = path.join(repoRoot, 'apps', 'cli', 'examples', 'company-literal.txt');
  await withTempOutputPath('bom-only', async (outputPath) => {
    const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath, '--bom']);

    expect(result.status).toBe(0);
    const writtenBuffer = await fs.readFile(outputPath);
    expect(hasUtf8Bom(writtenBuffer)).toBe(true);
  });
});

test('integration: does not write a UTF-8 BOM by default', async () => {
  const inputPath = path.join(repoRoot, 'apps', 'cli', 'examples', 'company-literal.txt');
  await withTempOutputPath('default-no-bom', async (outputPath) => {
    const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath]);

    expect(result.status).toBe(0);
    const writtenBuffer = await fs.readFile(outputPath);
    expect(hasUtf8Bom(writtenBuffer)).toBe(false);
  });
});

test('integration: writes CRLF line endings only when requested', async () => {
  const inputPath = path.join(repoRoot, 'apps', 'cli', 'examples', 'company-literal.txt');
  await withTempOutputPath('crlf-only', async (outputPath) => {
    const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath, '--line-endings', 'crlf']);

    expect(result.status).toBe(0);
    const written = await fs.readFile(outputPath, 'utf8');
    expect(written).toContain('\r\n');
    expect(written.replace(/\r\n/g, '')).not.toContain('\n');
  });
});

test('integration: writes LF line endings only when requested', async () => {
  const inputPath = path.join(repoRoot, 'apps', 'cli', 'examples', 'company-literal.txt');
  await withTempOutputPath('lf-only', async (outputPath) => {
    const result = runCli(['-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath, '--line-endings', 'lf']);

    expect(result.status).toBe(0);
    const written = await fs.readFile(outputPath, 'utf8');
    expect(written).toContain('\n');
    expect(written).not.toContain('\r\n');
  });
});
