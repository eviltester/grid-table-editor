import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConcreteService } from './api-service.test-helpers.js';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFilePath);
const repoRoot = path.resolve(thisDir, '../../../');
const fixturesDir = path.join(repoRoot, 'test-fixtures', 'amend-cross-format');

async function readFixture(fileName) {
  return fs.readFile(path.join(fixturesDir, fileName), 'utf8');
}

describe('api-service handleAmendRequest', () => {
  test('returns rows payload with diagnostics by default', () => {
    const { service } = createConcreteService();
    const result = service.handleAmendRequest({
      body: {
        textSpec: 'Name\nBob',
        inputData: 'Name\nA',
        inputFormat: 'csv',
        outputFormat: 'csv',
      },
    });

    expect(result.statusCode).toBe(200);
    expect(Array.isArray(result.body.headers)).toBe(true);
    expect(Array.isArray(result.body.rows)).toBe(true);
    expect(typeof result.body.diagnostics).toBe('object');
  });

  test('supports json input format', () => {
    const { service } = createConcreteService();
    const result = service.handleAmendRequest({
      body: {
        textSpec: 'Name\nBob',
        inputData: '[{"Name":"Alice"},{"Name":"Eve"}]',
        inputFormat: 'json',
        outputFormat: 'json',
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.rows).toEqual([['Bob'], ['Bob']]);
  });

  test('supports all response formats', () => {
    const { service } = createConcreteService();
    const modes = ['rows', 'rendered', 'all', 'raw'];

    for (const responseFormat of modes) {
      const result = service.handleAmendRequest({
        body: {
          textSpec: 'Name\nBob',
          inputData: '"Name"\n"Alice"',
          inputFormat: 'csv',
          outputFormat: 'json',
          responseFormat,
        },
      });
      expect(result.statusCode).toBe(200);
      if (responseFormat === 'raw') {
        expect(typeof result.raw).toBe('string');
      } else {
        expect(result.body).toBeTruthy();
      }
    }
  });

  test('stream flag is ignored and warning is returned', () => {
    const { service } = createConcreteService();
    const result = service.handleAmendRequest({
      body: {
        textSpec: 'Name\nBob',
        inputData: '"Name"\n"Alice"',
        inputFormat: 'csv',
        outputFormat: 'json',
        stream: true,
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.diagnostics?.warnings?.join(' ')).toContain('stream is ignored');
  });

  test('rejects invalid response format', () => {
    const { service } = createConcreteService();
    const result = service.handleAmendRequest({
      body: {
        textSpec: 'Name\nBob',
        inputData: 'Name\nA',
        inputFormat: 'csv',
        outputFormat: 'csv',
        responseFormat: 'nope',
      },
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.errors[0]).toMatch(/responseFormat/);
  });

  test('rejects validation failure combinations', () => {
    const { service } = createConcreteService();
    const payloads = [
      { textSpec: 'Name\nBob' },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'csv', rowCount: -1 },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'csv', rowCount: '1.5' },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'csv', rowCount: '2abc' },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'csv', rowCount: 3 },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'bad' },
      { textSpec: 'Name\nBob', inputData: '{', inputFormat: 'json' },
    ];

    for (const body of payloads) {
      const result = service.handleAmendRequest({ body });
      expect(result.statusCode).toBe(400);
      expect(Array.isArray(result.body.errors)).toBe(true);
    }
  });

  test('csv input amends and renders exact fixture dsv output', async () => {
    const { service } = createConcreteService();
    const [textSpec, inputData, expectedRendered] = await Promise.all([
      readFixture('schema.txt'),
      readFixture('input.csv'),
      readFixture('expected-output.dsv'),
    ]);

    const result = service.handleAmendRequest({
      body: {
        textSpec,
        inputData,
        inputFormat: 'csv',
        rowCount: 2,
        outputFormat: 'dsv',
        responseFormat: 'all',
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.rendered.trimEnd()).toBe(expectedRendered.trimEnd());
    expect(result.body.headers).toEqual(['Name', 'Age', 'Status']);
  });

  test('dsv input amends and renders exact fixture csv output', async () => {
    const { service } = createConcreteService();
    const [textSpec, inputData, expectedRendered] = await Promise.all([
      readFixture('schema.txt'),
      readFixture('input.dsv'),
      readFixture('expected-output.csv'),
    ]);

    const result = service.handleAmendRequest({
      body: {
        textSpec,
        inputData,
        inputFormat: 'dsv',
        rowCount: 2,
        outputFormat: 'csv',
        responseFormat: 'all',
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.rendered.trimEnd()).toBe(expectedRendered.trimEnd());
    expect(result.body.headers).toEqual(['Name', 'Age', 'Status']);
  });
});
