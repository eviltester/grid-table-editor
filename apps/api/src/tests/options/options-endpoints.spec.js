import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl } from '../api-test-setup.js';

test.describe('/v1/generate/options endpoints', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test('basic get/set/reset lifecycle works for csv', async ({ request }) => {
    const initial = await request.get(apiUrl('/v1/generate/options/csv'));
    expect(initial.status()).toBe(200);

    const set = await request.post(apiUrl('/v1/generate/options/csv'), {
      data: { options: { header: false }, tips: { header: 'Custom tip' } },
    });
    expect(set.status()).toBe(200);
    const setBody = await set.json();
    expect(setBody.source).toBe('custom-default');
    expect(setBody.options.header).toBe(false);
    expect(setBody.tips.header).toBe('Custom tip');

    const reset = await request.post(apiUrl('/v1/generate/options/csv/default'), { data: {} });
    expect(reset.status()).toBe(200);
    const resetBody = await reset.json();
    expect(resetBody.source).toBe('built-in-default');
  });

  test('invalid format returns 400', async ({ request }) => {
    const response = await request.get(apiUrl('/v1/generate/options/invalid-format'));
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.diagnostics).not.toBeNull();
    expect(typeof body.diagnostics).toBe('object');
    expect(Array.isArray(body.diagnostics)).toBe(false);
  });
});
