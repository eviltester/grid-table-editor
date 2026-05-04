/**
 * POST /v1/generate endpoint tests
 * Tests the main data generation endpoint with JSON request body
 */

import { test, expect } from '@playwright/test';
import {
  setupApiServer,
  teardownApiServer,
  apiUrl,
  SUPPORTED_FORMATS,
  RESPONSE_FORMATS,
  TEST_DATA,
  TestHelpers,
} from '../api-test-setup.js';

test.describe('POST /v1/generate', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test.describe('Valid requests', () => {
    test('should generate data with minimal valid payload', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.simpleTextSpec,
        rowCount: 1,
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      TestHelpers.assertSuccessResponse(body, 'rows');
      expect(body.headers).toHaveLength(1);
      expect(body.headers[0]).toBe('Name');
      expect(body.rows).toHaveLength(1);
    });

    test('should support all output formats', async ({ request }) => {
      for (const format of SUPPORTED_FORMATS) {
        const payload = {
          textSpec: TEST_DATA.simpleTextSpec,
          rowCount: 1,
          outputFormat: format,
        };

        const response = await request.post(apiUrl('/v1/generate'), {
          data: payload,
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        TestHelpers.assertSuccessResponse(body, 'rows');
        expect(body.format).toBe(format);
      }
    });

    test('should support all response formats', async ({ request }) => {
      for (const responseFormat of RESPONSE_FORMATS) {
        const payload = {
          textSpec: TEST_DATA.simpleTextSpec,
          rowCount: 1,
          outputFormat: 'json',
          responseFormat: responseFormat,
        };

        const response = await request.post(apiUrl('/v1/generate'), {
          data: payload,
        });

        expect(response.status()).toBe(200);

        if (responseFormat === 'raw') {
          // Raw format returns text content directly
          const text = await response.text();
          expect(typeof text).toBe('string');
          expect(response.headers()['content-type']).toMatch(/application\/json/);
        } else {
          const body = await response.json();
          TestHelpers.assertSuccessResponse(body, responseFormat);
        }
      }
    });

    test('should handle seed parameter for reproducible output', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.validTextSpec,
        rowCount: 2,
        seed: TEST_DATA.validSeed,
      };

      // Generate data twice with same seed
      const response1 = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });
      const response2 = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response1.status()).toBe(200);
      expect(response2.status()).toBe(200);

      const body1 = await response1.json();
      const body2 = await response2.json();

      // Results should be identical with same seed
      expect(body1.rows).toEqual(body2.rows);
    });

    test('should handle custom options for supported format', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.simpleTextSpec,
        rowCount: 1,
        outputFormat: 'csv',
        options: {
          header: false,
          quotes: true,
        },
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      TestHelpers.assertSuccessResponse(body, 'rows');
    });

    test('should handle large row counts', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.simpleTextSpec,
        rowCount: 100,
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      TestHelpers.assertSuccessResponse(body, 'rows');
      expect(body.rows).toHaveLength(100);
    });
  });

  test.describe('Invalid requests', () => {
    test('should return 400 for missing required fields', async ({ request }) => {
      const invalidPayloads = [
        {}, // Missing everything
        { textSpec: TEST_DATA.validTextSpec }, // Missing rowCount
        { rowCount: 5 }, // Missing textSpec
      ];

      for (const payload of invalidPayloads) {
        const response = await request.post(apiUrl('/v1/generate'), {
          data: payload,
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        TestHelpers.assertErrorResponse(body, 400);
      }
    });

    test('should return 400 for invalid text spec', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.invalidTextSpec,
        rowCount: 5,
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
    });

    test('should return 400 for invalid row count', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.validTextSpec,
        rowCount: TEST_DATA.invalidRowCount,
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
    });

    test('should return 400 for unsupported output format', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.validTextSpec,
        rowCount: 5,
        outputFormat: 'invalid-format',
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('outputFormat must be one of:');
    });

    test('should return 400 for invalid response format', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.validTextSpec,
        rowCount: 5,
        responseFormat: 'invalid-response-format',
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('responseFormat must be one of:');
    });

    test('should return 400 for invalid seed', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.validTextSpec,
        rowCount: 5,
        seed: TEST_DATA.invalidSeed,
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('seed must be a finite number');
    });

    test('should return 400 for malformed JSON', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate'), {
        data: '{"textSpec":"test","rowCount":1', // Invalid JSON
        headers: {
          'content-type': 'application/json',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('Malformed JSON');
    });
  });

  test.describe('HTTP methods', () => {
    test('should reject unsupported HTTP methods', async ({ request }) => {
      const results = await TestHelpers.testUnsupportedMethods(request, apiUrl('/v1/generate'), ['POST']);

      for (const result of results) {
        if (result.method !== 'OPTIONS') {
          expect(result.status).toBe(404); // Express.js returns 404 for undefined routes
        }
      }
    });
  });

  test.describe('Content types', () => {
    test('should support application/json content type', async ({ request }) => {
      const payload = {
        textSpec: TEST_DATA.simpleTextSpec,
        rowCount: 1,
      };

      const response = await request.post(apiUrl('/v1/generate'), {
        data: payload,
        headers: {
          'content-type': 'application/json',
        },
      });

      expect(response.status()).toBe(200);
    });

    test('should support application/x-www-form-urlencoded content type', async ({ request }) => {
      const formData = new URLSearchParams();
      formData.append('textSpec', TEST_DATA.simpleTextSpec);
      formData.append('rowCount', '1');

      const response = await request.post(apiUrl('/v1/generate'), {
        data: formData.toString(),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      expect(response.status()).toBe(200);
    });
  });
});
