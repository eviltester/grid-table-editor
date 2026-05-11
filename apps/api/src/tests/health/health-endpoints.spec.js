import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl } from '../api-test-setup.js';

test.describe('Health and docs endpoints', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test('GET /v1/health returns service status', async ({ request }) => {
    const response = await request.get(apiUrl('/v1/health'));
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/application\/json/i);
    await expect(response.json()).resolves.toEqual({ ok: true, service: 'anywaydata-api' });
  });

  test('GET /v1/openapi.json returns document with expected path entries', async ({ request }) => {
    const response = await request.get(apiUrl('/v1/openapi.json'));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.openapi).toBe('3.0.3');
    expect(body.paths['/v1/generate']).toBeTruthy();
    expect(body.paths['/v1/generate/amend']).toBeTruthy();
  });

  test('GET /v1/docs serves Swagger UI html', async ({ request }) => {
    const response = await request.get(apiUrl('/v1/docs'));
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/text\/html/i);
    const html = await response.text();
    expect(html).toContain('swagger-ui');
  });
});
