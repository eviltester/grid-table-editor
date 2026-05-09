import http from 'node:http';
import { app } from './index.js';
import { generateFromTextSpec } from '@anywaydata/core';

let server;
let port;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  port = server.address().port;
});

afterAll(async () => {
  if (!server) {
    return;
  }
  await new Promise((resolve) => server.close(resolve));
});

function url(path) {
  return `http://127.0.0.1:${port}${path}`;
}

const FRAMEWORKS = [
  'junit4',
  'junit5',
  'junit6',
  'testng',
  'pytest',
  'jest',
  'xunit',
  'rspec',
  'phpunit',
  'kotest',
  'test-more',
];

test('/v1/generate returns rows payload for valid JSON request', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json' }),
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.headers)).toBeTruthy();
  expect(Array.isArray(body.rows)).toBeTruthy();
  expect(Object.hasOwn(body, 'ok')).toBe(false);
});

test('/v1/generate returns 400 + JSON diagnostics for invalid spec', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: '', rowCount: 1, outputFormat: 'json' }),
  });

  expect(response.status).toBe(400);
  const body = await response.json();
  expect(Array.isArray(body.errors)).toBeTruthy();
  expect(typeof body.diagnostics).toBe('object');
});

test('/v1/generate returns JSON parse errors as JSON payload', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"textSpec":"line1\nline2","rowCount":1,"outputFormat":"csv"}',
  });

  expect(response.status).toBe(400);
  expect(response.headers.get('content-type') || '').toMatch(/application\/json/i);
  const body = await response.json();
  expect(Array.isArray(body.errors)).toBeTruthy();
});

test('/v1/generate supports responseFormat=rendered', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json', responseFormat: 'rendered' }),
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(typeof body.rendered).toBe('string');
  expect(Object.hasOwn(body, 'rows')).toBe(false);
});

test('/v1/generate supports responseFormat=raw', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', responseFormat: 'raw' }),
  });

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type') || '').toMatch(/text\/csv/i);
});

test('/v1/generate parity: REST rendered matches core for all unit-test frameworks', async () => {
  for (const outputFormat of FRAMEWORKS) {
    const options = {
      options: {
        includeSetup: true,
        prettyPrint: true,
        dataSourceStrategy: 'provider',
      },
    };
    const coreResult = generateFromTextSpec({
      textSpec: 'Name\nBob\nAge\n21',
      rowCount: 2,
      outputFormat,
      options,
      seed: 123,
    });
    expect(coreResult.ok).toBe(true);

    const response = await fetch(url('/v1/generate'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        textSpec: 'Name\nBob\nAge\n21',
        rowCount: 2,
        outputFormat,
        responseFormat: 'rendered',
        options,
        seed: 123,
      }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.rendered).toBe(coreResult.rendered);
  }
});

test('/v1/generate supports pairwise mode', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      textSpec: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark',
      rowCount: 99,
      outputFormat: 'json',
      pairwise: true,
    }),
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.headers).toEqual(['Browser', 'Theme']);
  expect(body.rows).toEqual([
    ['Chrome', 'Light'],
    ['Chrome', 'Dark'],
    ['Firefox', 'Light'],
    ['Firefox', 'Dark'],
    ['Safari', 'Light'],
    ['Safari', 'Dark'],
  ]);
});

test('/v1/generate supports pairwise for x-www-form-urlencoded payloads', async () => {
  const form = new URLSearchParams();
  form.set('textSpec', 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark');
  form.set('rowCount', '99');
  form.set('outputFormat', 'json');
  form.set('pairwise', 'true');

  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.headers).toEqual(['Browser', 'Theme']);
  expect(body.rows).toEqual([
    ['Chrome', 'Light'],
    ['Chrome', 'Dark'],
    ['Firefox', 'Light'],
    ['Firefox', 'Dark'],
    ['Safari', 'Light'],
    ['Safari', 'Dark'],
  ]);
});
