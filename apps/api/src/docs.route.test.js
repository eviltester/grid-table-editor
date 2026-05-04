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

test('/v1/openapi.json is available', async () => {
  const response = await fetch(url('/v1/openapi.json'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(body?.openapi);
  assert.ok(body?.paths?.['/v1/generate']);
  assert.ok(body?.paths?.['/v1/generate/options/{format}']);
});

test('/v1/docs serves Swagger UI', async () => {
  const response = await fetch(url('/v1/docs'));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html.toLowerCase(), /swagger/);
});
