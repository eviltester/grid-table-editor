import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFilePath);
const repoRoot = path.resolve(thisDir, '../../../../');
const cliEntry = path.join(repoRoot, 'apps', 'cli', 'src', 'node-entry.js');
const tempPaths = new Set();

function runCli(args) {
  return spawnSync('node', [cliEntry, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function tempFile(name) {
  const tempPath = path.join(
    os.tmpdir(),
    `anywaydata-${name}-${Date.now()}-${Math.random().toString(16).slice(2)}.txt`
  );
  tempPaths.add(tempPath);
  return tempPath;
}

afterAll(async () => {
  await Promise.all(
    [...tempPaths].map(async (tempPath) => {
      try {
        await fs.unlink(tempPath);
      } catch (_error) {
        // Ignore missing files or cleanup race conditions.
      }
    })
  );
});

test('param -h shows help', () => {
  const result = runCli(['-h']);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('Usage: anywaydata generate');
});

test('param -i is required', () => {
  const result = runCli(['generate', '-n', '1']);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Missing required argument');
});

test('params -i and -n drive row count', () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const result = runCli(['generate', '-i', inputPath, '-n', '3', '-f', 'csv', '--show-progress', 'false']);
  expect(result.status).toBe(0);

  const lines = result.stdout.trim().split(/\r?\n/);
  expect(lines.length).toBe(4);
  expect(lines[0]).toContain('"Company"');
});

test('param -f controls output format (jsonl)', () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const result = runCli(['generate', '-i', inputPath, '-n', '2', '-f', 'jsonl', '--show-progress', 'false']);
  expect(result.status).toBe(0);

  const lines = result.stdout.trim().split(/\r?\n/);
  expect(lines.length).toBe(2);
  for (const line of lines) {
    expect(() => JSON.parse(line)).not.toThrow();
  }
});

test('param -o writes output file', async () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const outputPath = tempFile('out');
  const result = runCli(['generate', '-i', inputPath, '-n', '2', '-f', 'csv', '-o', outputPath]);
  expect(result.status).toBe(0);

  const written = await fs.readFile(outputPath, 'utf8');
  expect(written).toContain('"Company"');
  expect(written).toContain('AnyWayData');
});

test('param -t forces single row and enables test-mode diagnostics', () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const result = runCli(['generate', '-i', inputPath, '-n', '8', '-f', 'csv', '-t']);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('> Operating in Test Mode - generating 1 entry');

  const csvLines = result.stdout.split(/\r?\n/).filter((line) => line.startsWith('"') && line.includes('Company'));
  expect(csvLines.length).toBeGreaterThan(0);
});

test('param --show-progress false suppresses progress logs', () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const result = runCli(['generate', '-i', inputPath, '-n', '1', '-f', 'csv', '--show-progress', 'false']);
  expect(result.status).toBe(0);
  expect(result.stdout).not.toContain('> Processing Input File');
  expect(result.stdout).toContain('"Company"');
});

test('params --stream and --show-progress true use streaming path for csv/jsonl', async () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const outputPath = tempFile('stream');
  const result = runCli([
    'generate',
    '-i',
    inputPath,
    '-n',
    '2',
    '-f',
    'csv',
    '-o',
    outputPath,
    '--stream',
    '--show-progress',
    'true',
  ]);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('using stream mode');

  const written = await fs.readFile(outputPath, 'utf8');
  expect(written).toContain('"Company"');
});

test('param --stream-threshold auto-enables stream mode when threshold reached', () => {
  const inputPath = path.join(repoRoot, 'cli', 'examples', 'company-literal.txt');
  const outputPath = tempFile('threshold');
  const result = runCli([
    'generate',
    '-i',
    inputPath,
    '-n',
    '1',
    '-f',
    'csv',
    '-o',
    outputPath,
    '--stream-threshold',
    '1',
    '--show-progress',
    'true',
  ]);
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('using stream mode');
});

test('param --unsafe-faker-expressions is accepted', async () => {
  const specPath = tempFile('unsafe-flag');
  await fs.writeFile(specPath, 'Company\nAnyWayData', 'utf8');

  const withoutFlag = runCli(['generate', '-i', specPath, '-n', '1', '-f', 'csv', '--show-progress', 'false']);
  expect(withoutFlag.status).toBe(0);
  expect(withoutFlag.stdout).toContain('"Company"');

  const withFlag = runCli([
    'generate',
    '-i',
    specPath,
    '-n',
    '1',
    '-f',
    'csv',
    '--unsafe-faker-expressions',
    'true',
    '--show-progress',
    'false',
  ]);
  expect(withFlag.status).toBe(0);
  expect(withFlag.stdout).toContain('"Company"');
});
