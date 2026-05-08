module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
};
