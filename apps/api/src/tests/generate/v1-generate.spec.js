import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl } from '../api-test-setup.js';

test.describe('POST /v1/generate', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test('basic valid generation works', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate'), {
      data: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.headers).toEqual(['Name']);
    expect(body.rows).toHaveLength(1);
    expect(body.format).toBe('json');
  });

  test('invalid request returns 400 with errors payload', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate'), {
      data: { textSpec: '', rowCount: -1, outputFormat: 'invalid' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.diagnostics).not.toBeNull();
    expect(Array.isArray(body.diagnostics)).toBe(false);
    expect(typeof body.diagnostics).toBe('object');
  });
});
