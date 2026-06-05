const { defineConfig } = require('@playwright/test');

const port = process.env.PLAYWRIGHT_PORT || '4173';
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: './apps/web/src/tests/browser',
  timeout: 30000,
  workers: process.env.CI ? 6 : 10,
  expect: {
    timeout: 15000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `pnpm exec vite --config ./apps/web/vite.config.mjs --host 127.0.0.1 --port ${port}`,
    url: `${baseURL}/app.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
