module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testRegex: 'src[/\\\\]tests[/\\\\].*\\.test\\.js$',
};
