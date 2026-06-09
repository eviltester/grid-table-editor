const baseConfig = require('../../jest.config.cjs');

module.exports = {
  ...baseConfig,
  testEnvironment: 'node',
  rootDir: '../..',
  testMatch: ['**/apps/cli/src/tests/**/*.test.js'],
};
