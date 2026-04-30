import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from './index.js';

let server;
let port;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  port = server.address().port;
});

test.after(async () => {
  if (!server) {
    return;
  }
  await new Promise((resolve) => server.close(resolve));
});

function url(path) {
  return `http://127.0.0.1:${port}${path}`;
}

test('/v1/generate returns rows payload for valid JSON request', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json' }),
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.headers));
  assert.ok(Array.isArray(body.rows));
  assert.equal(Object.hasOwn(body, 'ok'), false);
});

test('/v1/generate returns 400 + JSON diagnostics for invalid spec', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: '', rowCount: 1, outputFormat: 'json' }),
  });

  assert.equal(response.status, 400);
  const body = await response.json();
  assert.ok(Array.isArray(body.errors));
  assert.equal(typeof body.diagnostics, 'object');
});

test('/v1/generate returns JSON parse errors as JSON payload', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"textSpec":"line1\nline2","rowCount":1,"outputFormat":"csv"}',
  });

  assert.equal(response.status, 400);
  assert.match(response.headers.get('content-type') || '', /application\/json/i);
  const body = await response.json();
  assert.ok(Array.isArray(body.errors));
});

test('/v1/generate supports responseFormat=rendered', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json', responseFormat: 'rendered' }),
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(typeof body.rendered, 'string');
  assert.equal(Object.hasOwn(body, 'rows'), false);
});

test('/v1/generate supports responseFormat=raw', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', responseFormat: 'raw' }),
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /text\/csv/i);
});
