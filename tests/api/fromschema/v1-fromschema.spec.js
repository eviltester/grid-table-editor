/**
 * POST /v1/generate/fromschema endpoint tests
 * Tests the text/plain schema generation endpoint
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

test.describe('POST /v1/generate/fromschema', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test.describe('Valid requests', () => {
    test('should generate data from text/plain schema', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      TestHelpers.assertSuccessResponse(body, 'rows');
      expect(body.headers).toHaveLength(1);
      expect(body.headers[0]).toBe('Name');
      expect(body.rows).toHaveLength(1);
    });

    test('should support all output formats via query parameters', async ({ request }) => {
      for (const format of SUPPORTED_FORMATS) {
        const response = await request.post(apiUrl(`/v1/generate/fromschema?rowCount=1&outputFormat=${format}`), {
          data: TEST_DATA.simpleTextSpec,
          headers: {
            'content-type': 'text/plain',
          },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        TestHelpers.assertSuccessResponse(body, 'rows');
        expect(body.format).toBe(format);
      }
    });

    test('should support all response formats via query parameters', async ({ request }) => {
      for (const responseFormat of RESPONSE_FORMATS) {
        const response = await request.post(
          apiUrl(`/v1/generate/fromschema?rowCount=1&responseFormat=${responseFormat}`),
          {
            data: TEST_DATA.simpleTextSpec,
            headers: {
              'content-type': 'text/plain',
            },
          }
        );

        expect(response.status()).toBe(200);

        if (responseFormat === 'raw') {
          // Raw format returns text content directly
          const text = await response.text();
          expect(typeof text).toBe('string');
          expect(response.headers()['content-type']).toMatch(/text\/csv/); // Default format is CSV
        } else {
          const body = await response.json();
          TestHelpers.assertSuccessResponse(body, responseFormat);
        }
      }
    });

    test('should handle seed parameter for reproducible output', async ({ request }) => {
      const url = apiUrl(`/v1/generate/fromschema?rowCount=2&seed=${TEST_DATA.validSeed}`);

      // Generate data twice with same seed
      const response1 = await request.post(url, {
        data: TEST_DATA.validTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });
      const response2 = await request.post(url, {
        data: TEST_DATA.validTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response1.status()).toBe(200);
      expect(response2.status()).toBe(200);

      const body1 = await response1.json();
      const body2 = await response2.json();

      // Results should be identical with same seed
      expect(body1.rows).toEqual(body2.rows);
    });

    test('should handle complex text schema', async ({ request }) => {
      const complexSchema = `Name
firstName
Email  
email
Age
datatype.number({"min": 18, "max": 65})
City
address.cityName`;

      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=3'), {
        data: complexSchema,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      TestHelpers.assertSuccessResponse(body, 'rows');
      expect(body.headers).toHaveLength(4);
      expect(body.headers).toEqual(['Name', 'Email', 'Age', 'City']);
      expect(body.rows).toHaveLength(3);
    });
  });

  test.describe('Invalid requests', () => {
    test('should return 400 for missing rowCount parameter', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
    });

    test('should return 400 for invalid rowCount parameter', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=-1'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
    });

    test('should return 400 for invalid outputFormat parameter', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1&outputFormat=invalid'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('outputFormat must be one of:');
    });

    test('should return 400 for invalid responseFormat parameter', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1&responseFormat=invalid'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('responseFormat must be one of:');
    });

    test('should return 400 for invalid seed parameter', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1&seed=invalid'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('seed must be a finite number');
    });

    test('should return 400 for empty text schema', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1'), {
        data: '',
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
    });

    test('should return 400 for non-string request body', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1'), {
        data: { textSpec: TEST_DATA.simpleTextSpec }, // JSON instead of text/plain
        headers: {
          'content-type': 'application/json',
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      TestHelpers.assertErrorResponse(body, 400);
      expect(body.errors[0]).toContain('text/plain request body is required');
    });
  });

  test.describe('HTTP methods', () => {
    test('should reject unsupported HTTP methods', async ({ request }) => {
      const results = await TestHelpers.testUnsupportedMethods(request, apiUrl('/v1/generate/fromschema'), ['POST']);

      for (const result of results) {
        if (result.method !== 'OPTIONS') {
          expect(result.status).toBe(404); // Express.js returns 404 for undefined routes
        }
      }
    });
  });

  test.describe('Content types', () => {
    test('should require text/plain content type', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1'), {
        data: TEST_DATA.simpleTextSpec,
        headers: {
          'content-type': 'text/plain',
        },
      });

      expect(response.status()).toBe(200);
    });

    test('should handle missing content-type header', async ({ request }) => {
      const response = await request.post(apiUrl('/v1/generate/fromschema?rowCount=1'), {
        data: TEST_DATA.simpleTextSpec,
        // No explicit content-type header
      });

      // Should still work or provide clear error message
      if (response.status() !== 200) {
        const body = await response.json();
        TestHelpers.assertErrorResponse(body);
      }
    });
  });
});
