const baseConfig = require('./playwright.config.js');

module.exports = {
  ...baseConfig,
  workers: 1,
  fullyParallel: false,
  testMatch: [
    '**/abstraction-smoke-tests/**/*.spec.js',
    '**/playwright-smoke-tests/**/*.spec.js',
  ],
};
