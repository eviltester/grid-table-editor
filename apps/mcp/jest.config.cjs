const baseConfig = require('../../jest.config.cjs');

module.exports = {
  ...baseConfig,
  testEnvironment: 'node',
  rootDir: '../..',
  testMatch: ['**/apps/mcp/src/*.test.js'],
};
