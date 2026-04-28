const { defineConfig } = require('@playwright/test');

const port = process.env.PLAYWRIGHT_PORT || '4173';
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
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
    command: `npx http-server . -p ${port} -c-1 --silent`,
    url: `${baseURL}/app.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});