import http from 'node:http';
import { app } from './index.js';

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

test('/v1/generate/fromschema defaults to rows response', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.headers)).toBeTruthy();
  expect(Array.isArray(body.rows)).toBeTruthy();
});

test('/v1/generate/fromschema supports responseFormat=rendered', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&responseFormat=rendered&outputFormat=csv'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(typeof body.rendered).toBe('string');
});

test('/v1/generate/fromschema supports responseFormat=all', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&responseFormat=all'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.rows)).toBeTruthy();
  expect(typeof body.rendered).toBe('string');
});

test('/v1/generate/fromschema supports responseFormat=raw', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&outputFormat=csv&responseFormat=raw'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain', accept: 'text/csv' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type') || '').toMatch(/text\/csv/i);
});

test('/v1/generate/fromschema rejects missing rowCount', async () => {
  const response = await fetch(url('/v1/generate/fromschema'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(400);
});

test('/v1/generate/fromschema rejects invalid responseFormat', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&responseFormat=nope'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(400);
});

test('/v1/generate/fromschema rejects invalid outputFormat', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&outputFormat=badformat'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(400);
});

test('/v1/generate/fromschema accepts seed from query string and produces deterministic faker output', async () => {
  const path = '/v1/generate/fromschema?rowCount=1&seed=12345';
  const headers = { 'content-type': 'text/plain' };
  const body = 'firstName\nperson.firstName';

  const responseA = await fetch(url(path), { method: 'POST', headers, body });
  const responseB = await fetch(url(path), { method: 'POST', headers, body });

  expect(responseA.status).toBe(200);
  expect(responseB.status).toBe(200);

  const payloadA = await responseA.json();
  const payloadB = await responseB.json();
  expect(payloadA.rows).toEqual(payloadB.rows);
});

test('/v1/generate/fromschema rejects invalid seed query value', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&seed=not-a-number'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  expect(response.status).toBe(400);
  const payload = await response.json();
  expect(payload.errors?.[0] || '').toMatch(/seed must be a finite number/i);
});

test('/v1/generate/fromschema applies unit-test defaults for includeSetup', async () => {
  try {
    const setDefaults = await fetch(url('/v1/generate/options/jest'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ options: { includeSetup: true } }),
    });
    expect(setDefaults.status).toBe(200);

    const response = await fetch(url('/v1/generate/fromschema?rowCount=1&outputFormat=jest&responseFormat=rendered'), {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'Name\nBob',
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.rendered).toMatch(/beforeEach/);
    expect(body.rendered).toMatch(/expect\(/);
  } finally {
    const resetDefaults = await fetch(url('/v1/generate/options/jest/default'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(resetDefaults.status).toBe(200);
  }
});

test('/v1/generate/fromschema supports pairwise query flag', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=50&pairwise=true&outputFormat=json'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark',
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

test('/v1/generate/fromschema accepts comments and blank lines in schema text', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=2&outputFormat=json'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: '# skip me\n\nPriority\nenum(high,medium,low)\n\n# and me\nStatus\nenum(active,inactive,pending)',
  });

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.headers).toEqual(['Priority', 'Status']);
  expect(body.rows).toHaveLength(2);
});
