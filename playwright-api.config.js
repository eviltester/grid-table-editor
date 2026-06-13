const { defineConfig } = require('@playwright/test');

/**
 * Playwright configuration for API testing
 * This configuration is optimized for REST API testing without browser UI
 */
module.exports = defineConfig({
  testDir: './apps/api/src/tests',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  workers: process.env.CI ? 6 : 1,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI 
    ? [['list'], ['json', { outputFile: 'test-results/api-results.json' }], ['html', { open: 'never', outputFolder: 'test-results/api-report' }]] 
    : [['list'], ['html', { open: 'never', outputFolder: 'test-results/api-report' }]],
  
  // API testing doesn't need browser contexts, only request contexts
  use: {
    // No baseURL needed as we start our own server
    // Request context will be used instead of browser context
    extraHTTPHeaders: {
      // Add any default headers if needed
      'Accept': 'application/json',
    },
    // API tests don't need these browser-specific settings
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },

  // Projects configuration for different test scenarios
  projects: [
    {
      name: 'api-tests',
      testDir: './apps/api/src/tests',
      use: {
        // Configuration specific to API testing
      },
    },
  ],

  // Output directories
  outputDir: 'test-results/api-output',
  
  // Global setup and teardown
  globalSetup: './apps/api/src/tests/global-setup.js',
  globalTeardown: './apps/api/src/tests/global-teardown.js',
});
