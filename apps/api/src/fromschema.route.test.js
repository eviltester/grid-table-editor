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

test('/v1/generate/fromschema defaults to rows response', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.headers));
  assert.ok(Array.isArray(body.rows));
});

test('/v1/generate/fromschema supports responseFormat=rendered', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&responseFormat=rendered&outputFormat=csv'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(typeof body.rendered, 'string');
});

test('/v1/generate/fromschema supports responseFormat=all', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&responseFormat=all'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body.rows));
  assert.equal(typeof body.rendered, 'string');
});

test('/v1/generate/fromschema supports responseFormat=raw', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&outputFormat=csv&responseFormat=raw'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain', accept: 'text/csv' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /text\/csv/i);
});

test('/v1/generate/fromschema rejects missing rowCount', async () => {
  const response = await fetch(url('/v1/generate/fromschema'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 400);
});

test('/v1/generate/fromschema rejects invalid responseFormat', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&responseFormat=nope'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 400);
});

test('/v1/generate/fromschema rejects invalid outputFormat', async () => {
  const response = await fetch(url('/v1/generate/fromschema?rowCount=1&outputFormat=badformat'), {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'iata\nairline.airline.iataCode',
  });

  assert.equal(response.status, 400);
});
