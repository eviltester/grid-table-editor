const baseConfig = require('../../jest.config.cjs');

module.exports = {
  ...baseConfig,
  rootDir: '../..',
  testMatch: ['**/apps/mcp/src/*.test.js'],
};
