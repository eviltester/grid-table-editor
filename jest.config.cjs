module.exports = {
  verbose: true,
  transform: {},
  testMatch: [
    '**/packages/core/src/tests/**/*.test.js',
    '**/packages/core-ui/src/tests/**/*.test.js',
    '**/tests/integration/**/*.test.js',
    '**/apps/web/src/tests/jest/**/*.test.js',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/tests/browser/', '/apps/web/src/tests/browser/'],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  collectCoverageFrom: ['packages/**/*.js', '!packages/core/js/libs/**'],
  moduleNameMapper: {
    '^@anywaydata/core$': '<rootDir>/packages/core/src/index.js',
    '^@anywaydata/core/(.*)$': '<rootDir>/packages/core/js/$1',
    '^@anywaydata/core/data_formats/(.*)$': '<rootDir>/packages/core/js/data_formats/$1',
    'https://unpkg.com/papaparse@5.5.2/papaparse.min.js': 'papaparse',
    '/libs/randexp.min.js': 'randexp',
  },
};
