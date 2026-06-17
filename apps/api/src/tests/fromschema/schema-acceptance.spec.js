import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { setupApiServer, teardownApiServer, apiUrl } from '../api-test-setup.js';

const require = createRequire(import.meta.url);
const {
  SCHEMA_ACCEPTANCE_SCENARIOS,
} = require('../../../../../tests/integration/support/schema-acceptance-fixtures.cjs');
const { normalizeApiBody } = require('../../../../../tests/integration/support/schema-acceptance-assertions.cjs');

test.describe('POST /v1/generate/fromschema schema acceptance', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await setupApiServer();
  });

  test.afterAll(async () => {
    await teardownApiServer();
  });

  for (const scenario of SCHEMA_ACCEPTANCE_SCENARIOS) {
    test(`${scenario.id} matches shared acceptance criteria`, async ({ request }) => {
      const response = await request.post(
        apiUrl(`/v1/generate/fromschema?rowCount=${scenario.rowCount}&outputFormat=${scenario.outputFormat}`),
        {
          data: scenario.schemaText,
          headers: { 'content-type': 'text/plain' },
        }
      );

      expect([200, 400]).toContain(response.status());
      const body = await response.json();
      const normalized = normalizeApiBody(body);
      scenario.assertAcceptance(expect, normalized);
    });
  }
});
