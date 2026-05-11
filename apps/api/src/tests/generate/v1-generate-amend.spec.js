import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl } from '../api-test-setup.js';

test.describe('POST /v1/generate/amend', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test('basic amend flow works', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate/amend'), {
      data: {
        textSpec: 'Name\nBob',
        inputData: '"Name"\n"Alice"\n"Eve"',
        inputFormat: 'csv',
        rowCount: 1,
        outputFormat: 'json',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.rows).toEqual([['Bob'], ['Eve']]);
    expect(body.diagnostics).not.toBeNull();
    expect(Array.isArray(body.diagnostics)).toBe(false);
    expect(typeof body.diagnostics).toBe('object');
  });

  test('invalid amend request returns 400', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate/amend'), {
      data: { textSpec: 'Name\nBob', inputData: '', inputFormat: 'csv' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.diagnostics).not.toBeNull();
    expect(Array.isArray(body.diagnostics)).toBe(false);
    expect(typeof body.diagnostics).toBe('object');
  });
});
