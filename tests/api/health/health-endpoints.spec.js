/**
 * Health and Documentation endpoint tests
 * Tests: /v1/health, /v1/openapi.json, /v1/docs
 */

import { test, expect } from '@playwright/test';
import { setupApiServer, teardownApiServer, apiUrl, TestHelpers } from '../api-test-setup.js';

test.describe('Health and Documentation Endpoints', () => {
  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  test.describe('GET /v1/health', () => {
    test('should return 200 with health status', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/health'));

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('ok', true);
      expect(body).toHaveProperty('service', 'anywaydata-api');
    });

    test('should return JSON content type', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/health'));

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/application\/json/);
    });

    test('should reject unsupported HTTP methods', async ({ request }) => {
      const results = await TestHelpers.testUnsupportedMethods(
        request,
        apiUrl('/v1/health'),
        ['GET', 'HEAD'] // HEAD is automatically supported by Express.js for GET routes
      );

      // Check that non-GET/HEAD methods return appropriate status codes
      for (const result of results) {
        if (result.method !== 'OPTIONS') {
          // OPTIONS might be supported for CORS
          expect(result.status).toBe(404); // Express.js returns 404 for undefined routes
        }
      }
    });
  });

  test.describe('GET /v1/openapi.json', () => {
    test('should return 200 with OpenAPI specification', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/openapi.json'));

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('openapi', '3.0.3');
      expect(body).toHaveProperty('info');
      expect(body.info).toHaveProperty('title', 'AnyWayData REST API');
      expect(body.info).toHaveProperty('version', '0.1.0');
      expect(body).toHaveProperty('paths');
    });

    test('should include all expected API paths', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/openapi.json'));
      const body = await response.json();

      const expectedPaths = [
        '/v1/health',
        '/v1/generate',
        '/v1/generate/fromschema',
        '/v1/generate/options/{format}',
        '/v1/generate/options/{format}/default',
      ];

      for (const path of expectedPaths) {
        expect(body.paths).toHaveProperty(path);
      }
    });

    test('should return JSON content type', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/openapi.json'));

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/application\/json/);
    });

    test('should reject unsupported HTTP methods', async ({ request }) => {
      const results = await TestHelpers.testUnsupportedMethods(
        request,
        apiUrl('/v1/openapi.json'),
        ['GET', 'HEAD'] // HEAD is automatically supported by Express.js for GET routes
      );

      for (const result of results) {
        if (result.method !== 'OPTIONS') {
          expect(result.status).toBe(404); // Express.js returns 404 for undefined routes
        }
      }
    });
  });

  test.describe('GET /v1/docs (Swagger UI)', () => {
    test('should return 200 with HTML content', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/docs'));

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/text\/html/);
    });

    test('should contain Swagger UI elements', async ({ request }) => {
      const response = await request.get(apiUrl('/v1/docs'));
      const html = await response.text();

      expect(html).toContain('swagger-ui');
    });
  });
});
