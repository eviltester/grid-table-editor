import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl } from '../api-test-setup.js';

test.describe('POST /v1/generate/fromschema', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test('basic text/plain generation works', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=2&outputFormat=json'), {
      data: 'Name\nBob',
      headers: { 'content-type': 'text/plain' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.headers).toEqual(['Name']);
    expect(body.rows).toHaveLength(2);
  });

  test('invalid fromschema request returns 400', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate/fromschema'), {
      data: 'Name\nBob',
      headers: { 'content-type': 'text/plain' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.diagnostics).not.toBeNull();
    expect(Array.isArray(body.diagnostics)).toBe(false);
    expect(typeof body.diagnostics).toBe('object');
  });
});
