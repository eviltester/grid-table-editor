import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl, RESPONSE_FORMATS, TestHelpers } from '../api-test-setup.js';

test.describe('POST /v1/generate/amend', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test('amends csv input data and returns full result set', async ({ request }) => {
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
  });

  test('supports json input format', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate/amend'), {
      data: {
        textSpec: 'Name\nBob',
        inputData: '[{"Name":"Alice"},{"Name":"Eve"}]',
        inputFormat: 'json',
        outputFormat: 'json',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.rows).toEqual([['Bob'], ['Bob']]);
  });

  test('supports all response formats', async ({ request }) => {
    for (const responseFormat of RESPONSE_FORMATS) {
      const response = await request.post(apiUrl('/v1/generate/amend'), {
        data: {
          textSpec: 'Name\nBob',
          inputData: '"Name"\n"Alice"',
          inputFormat: 'csv',
          outputFormat: 'json',
          responseFormat,
        },
      });
      expect(response.status()).toBe(200);
      if (responseFormat === 'raw') {
        const text = await response.text();
        expect(typeof text).toBe('string');
      } else {
        const body = await response.json();
        TestHelpers.assertSuccessResponse(body, responseFormat);
      }
    }
  });

  test('ignores stream flag and reports warning', async ({ request }) => {
    const response = await request.post(apiUrl('/v1/generate/amend'), {
      data: {
        textSpec: 'Name\nBob',
        inputData: '"Name"\n"Alice"',
        inputFormat: 'csv',
        outputFormat: 'json',
        stream: true,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.diagnostics?.warnings?.join(' ')).toContain('stream is ignored');
  });

  test('returns 400 for validation failures', async ({ request }) => {
    const invalidPayloads = [
      { textSpec: 'Name\nBob' },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'csv', rowCount: -1 },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'csv', rowCount: 3 },
      { textSpec: 'Name\nBob', inputData: '"Name"\n"Alice"', inputFormat: 'bad' },
      { textSpec: 'Name\nBob', inputData: '{', inputFormat: 'json' },
    ];

    for (const payload of invalidPayloads) {
      const response = await request.post(apiUrl('/v1/generate/amend'), { data: payload });
      expect(response.status()).toBe(400);
      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
    }
  });
});
