/**
 * /v1/generate/options/{format} endpoint tests
 * Tests GET (get options), POST (set options), POST default (reset options)
 */

import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl, SUPPORTED_FORMATS, TestHelpers } from '../api-test-setup.js';

test.describe('/v1/generate/options/{format} Endpoints', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test.describe('GET /v1/generate/options/{format}', () => {
    test('should return default options for supported formats', async ({ request }) => {
      for (const format of SUPPORTED_FORMATS) {
        const response = await request.get(apiUrl(`/v1/generate/options/${format}`));

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('format', format);
        expect(body).toHaveProperty('options');
        expect(typeof body.options).toBe('object');
        expect(body).toHaveProperty('tips');
        expect(typeof body.tips).toBe('object');
        expect(body).toHaveProperty('source');
        expect(['custom-default', 'built-in-default']).toContain(body.source);
      }
    });

    test('should return 400 for unsupported format', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/generate/options/invalid-format'));

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('format must be one of:');
    });

    test('should return JSON content type', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/generate/options/csv'));

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/application\/json/);
    });

    test('should reject unsupported HTTP methods', async ({ request }) => {
      const results = await TestHelpers.testUnsupportedMethods(
        request,
        apiUrl('/v1/generate/options/csv'),
        ['GET', 'POST', 'HEAD'] // GET, POST are explicit; HEAD is auto-supported by Express for GET routes
      );

      for (const result of results) {
        if (result.method !== 'OPTIONS') {
          expect(result.status).toBe(404); // Express.js returns 404 for undefined routes
        }
      }
    });
  });

  test.describe('POST /v1/generate/options/{format}', () => {
    test('should set custom default options for csv format', async ({ request }) => {
      const customOptions = {
        header: false,
        quotes: true,
        quoteChar: "'",
      };

      const response = await request.post(apiUrl('/v1/generate/options/csv'), {
        data: customOptions,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('format', 'csv');
      expect(body).toHaveProperty('options');
      expect(body).toHaveProperty('source', 'custom-default');

      // Verify the options were set
      expect(body.options.header).toBe(false);
      expect(body.options.quotes).toBe(true);
      expect(body.options.quoteChar).toBe("'");
    });

    test('should set custom tips along with options', async ({ request }) => {
      const payload = {
        header: true,
        tips: {
          header: 'Custom tip for header option',
        },
      };

      const response = await request.post(apiUrl('/v1/generate/options/csv'), {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('tips');
      expect(body.tips.header).toBe('Custom tip for header option');
    });

    test('should handle options for different formats', async ({ request }) => {
      // Test JSON format options
      const jsonOptions = {
        prettyPrint: true,
        makeNumbersNumeric: false,
      };

      const response = await request.post(apiUrl('/v1/generate/options/json'), {
        data: jsonOptions,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('format', 'json');
      expect(body).toHaveProperty('source', 'custom-default');
    });

    test('should return 400 for unsupported format', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/options/invalid-format'), {
        data: { someOption: 'value' },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('format must be one of:');
    });

    test('should return 400 for non-object request body', async ({ request }) => {
      const invalidPayloads = ['string-payload', 123, ['array', 'payload'], null];

      for (const payload of invalidPayloads) {
        const response = await request.post(apiUrl('/v1/generate/options/csv'), {
          data: JSON.stringify(payload), // Force JSON stringification
          headers: { 'Content-Type': 'application/json' }, // Ensure Express parses it
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        TestHelpers.assertErrorResponse(body, 400);
        expect(body.errors).toHaveLength(1);
      }
    });

    test('should return 400 for invalid tips object', async ({ request }) => {
      const payload = {
        header: true,
        tips: 'invalid-tips-should-be-object',
      };

      const response = await request.post(apiUrl('/v1/generate/options/csv'), {
        data: payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('tips must be a JSON object when provided');
    });
  });

  test.describe('POST /v1/generate/options/{format}/default', () => {
    test('should reset options to built-in defaults', async ({ request }) => {
      const format = 'csv';

      // First, set some custom options
      await request.post(apiUrl(`/v1/generate/options/${format}`), {
        data: { header: false, quotes: true },
      });

      // Now reset to defaults
      const response = await request.post(apiUrl(`/v1/generate/options/${format}/default`), {
        data: {},
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('format', format);
      expect(body).toHaveProperty('options');
      expect(body).toHaveProperty('source', 'built-in-default');
      expect(body).toHaveProperty('tips');
    });

    test('should reset options for all supported formats', async ({ request }) => {
      // Test a few key formats
      const testFormats = ['csv', 'json', 'markdown', 'sql'];

      for (const format of testFormats) {
        const response = await request.post(apiUrl(`/v1/generate/options/${format}/default`), {
          data: {},
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toHaveProperty('format', format);
        expect(body).toHaveProperty('source', 'built-in-default');
      }
    });

    test('should return 400 for unsupported format', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/options/invalid-format/default'), {
        data: {},
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('format must be one of:');
    });

    test('should reject unsupported HTTP methods', async ({ request }) => {
      const results = await TestHelpers.testUnsupportedMethods(request, apiUrl('/v1/generate/options/csv/default'), [
        'POST',
        'HEAD', // HEAD is auto-supported by Express for routes with handlers
      ]);

      for (const result of results) {
        if (result.method !== 'OPTIONS') {
          expect(result.status).toBe(404); // Express.js returns 404 for undefined routes
        }
      }
    });
  });

  test.describe('Options persistence workflow', () => {
    test('should persist custom options across requests', async ({ request }) => {
      const format = 'csv';
      const customOptions = {
        header: false,
        quotes: true,
        quoteChar: '|',
      };

      // Set custom options
      const setResponse = await request.post(apiUrl(`/v1/generate/options/${format}`), {
        data: customOptions,
      });
      expect(setResponse.status()).toBe(200);

      // Get options to verify persistence
      const getResponse = await request.get(apiUrl(`/v1/generate/options/${format}`));
      expect(getResponse.status()).toBe(200);

      const body = await getResponse.json();
      expect(body.source).toBe('custom-default');
      expect(body.options.header).toBe(false);
      expect(body.options.quotes).toBe(true);
      expect(body.options.quoteChar).toBe('|');
    });

    test('should maintain separate options for different formats', async ({ request }) => {
      // Set different options for CSV and JSON
      await request.post(apiUrl('/v1/generate/options/csv'), {
        data: { header: false },
      });
      await request.post(apiUrl('/v1/generate/options/json'), {
        data: { prettyPrint: false },
      });

      // Verify CSV options
      const csvResponse = await request.get(apiUrl('/v1/generate/options/csv'));
      const csvBody = await csvResponse.json();
      expect(csvBody.source).toBe('custom-default');

      // Verify JSON options
      const jsonResponse = await request.get(apiUrl('/v1/generate/options/json'));
      const jsonBody = await jsonResponse.json();
      expect(jsonBody.source).toBe('custom-default');

      // Verify they are independent
      expect(csvBody.options).not.toEqual(jsonBody.options);
    });
  });
});
