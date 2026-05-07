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

test('/v1/openapi.json is available', async () => {
  const response = await fetch(url('/v1/openapi.json'));
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body?.openapi).toBeTruthy();
  expect(body?.paths?.['/v1/generate']).toBeTruthy();
  expect(body?.paths?.['/v1/generate/options/{format}']).toBeTruthy();
});

test('/v1/docs serves Swagger UI', async () => {
  const response = await fetch(url('/v1/docs'));
  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html.toLowerCase()).toMatch(/swagger/);
});
