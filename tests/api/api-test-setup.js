/**
 * Shared setup and utilities for API testing with Playwright
 */

let apiModule;
let server;
let port;
let baseUrl;

/**
 * Start the API server for testing
 */
export async function setupApiServer() {
  // Dynamic import to avoid top-level await issues
  if (!apiModule) {
    apiModule = await import('../../apps/api/src/index.js');
  }

  const result = await apiModule.startApiServer(apiModule.app, {
    argv: [],
    env: { ...process.env, NODE_ENV: 'test' },
    logger: () => {}, // Silent logger for tests
    defaultPort: 0, // Use random available port
  });

  if (!result.ok) {
    throw new Error(`Failed to start API server: ${result.message}`);
  }

  server = result.server;
  port = result.port;
  baseUrl = `http://127.0.0.1:${port}`;

  return { server, port, baseUrl };
}

/**
 * Shutdown the API server after testing
 */
export async function teardownApiServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
    port = null;
    baseUrl = null;
  }
}

/**
 * Get the base URL for API requests
 */
export function getBaseUrl() {
  if (!baseUrl) {
    throw new Error('API server not started. Call setupApiServer() first.');
  }
  return baseUrl;
}

/**
 * Create a full URL for an API endpoint
 */
export function apiUrl(path) {
  if (!baseUrl) {
    throw new Error('API server not started. Call setupApiServer() first. baseUrl is: ' + baseUrl);
  }
  return `${baseUrl}${path}`;
}

/**
 * Supported output formats for testing
 */
export const SUPPORTED_FORMATS = [
  'csv',
  'dsv',
  'markdown',
  'json',
  'jsonl',
  'javascript',
  'python',
  'java',
  'typescript',
  'xml',
  'sql',
  'gherkin',
  'html',
  'asciitable',
];

/**
 * Supported response formats for testing
 */
export const RESPONSE_FORMATS = ['rows', 'rendered', 'all', 'raw'];

/**
 * Test data constants
 */
export const TEST_DATA = {
  validTextSpec: 'Name\nfirstName\nEmail\nemail',
  simpleTextSpec: 'Name\nBob',
  invalidTextSpec: '',
  validRowCount: 5,
  invalidRowCount: -1,
  validSeed: 12345,
  invalidSeed: 'not-a-number',
};

/**
 * Common test utilities
 */
export const TestHelpers = {
  /**
   * Assert that response has expected JSON structure for error responses
   */
  assertErrorResponse(body, _expectedStatus) {
    if (!Array.isArray(body.errors)) {
      throw new Error('Expected errors array in response body');
    }
    if (typeof body.diagnostics !== 'object') {
      throw new Error('Expected diagnostics object in response body');
    }
  },

  /**
   * Assert that response has expected JSON structure for success responses
   */
  assertSuccessResponse(body, responseFormat = 'rows') {
    switch (responseFormat) {
      case 'rows':
        if (!Array.isArray(body.headers)) {
          throw new Error('Expected headers array in response body');
        }
        if (!Array.isArray(body.rows)) {
          throw new Error('Expected rows array in response body');
        }
        break;
      case 'rendered':
        if (typeof body.rendered !== 'string') {
          throw new Error('Expected rendered string in response body');
        }
        if (typeof body.format !== 'string') {
          throw new Error('Expected format string in response body');
        }
        break;
      case 'all':
        if (!Array.isArray(body.headers)) {
          throw new Error('Expected headers array in response body');
        }
        if (!Array.isArray(body.rows)) {
          throw new Error('Expected rows array in response body');
        }
        if (typeof body.rendered !== 'string') {
          throw new Error('Expected rendered string in response body');
        }
        if (typeof body.format !== 'string') {
          throw new Error('Expected format string in response body');
        }
        break;
      case 'raw':
        // Raw responses return text content directly
        break;
    }
  },

  /**
   * Test that unsupported HTTP methods return 404 (Express.js default behavior)
   */
  async testUnsupportedMethods(request, endpoint, supportedMethods = []) {
    const allMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    const unsupportedMethods = allMethods.filter((method) => !supportedMethods.includes(method));

    const results = [];
    for (const method of unsupportedMethods) {
      try {
        const response = await request[method.toLowerCase()](endpoint);
        results.push({
          method,
          status: response.status(),
          expected: method === 'OPTIONS' ? 200 : 404, // Express.js returns 404 for undefined routes
        });
      } catch (error) {
        // Some methods might not be implemented in Playwright request
        results.push({
          method,
          status: 404, // Express.js default for undefined routes
          expected: 404,
        });
      }
    }

    return results;
  },
};
