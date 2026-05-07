import { hasCommand, writeAndCheck } from './test-framework-convertor-syntax.shared.js';

describe('test framework convertor syntax - Ruby', () => {
  const hasRuby = hasCommand('ruby');

  (hasRuby ? test : test.skip)('rspec output parses as Ruby', () => {
    writeAndCheck({ framework: 'rspec', ext: 'rb', checkCmd: 'ruby', checkArgsBuilder: (file) => ['-c', file] });
  });

  (hasRuby ? test : test.skip)('minitest output parses as Ruby', () => {
    writeAndCheck({ framework: 'minitest', ext: 'rb', checkCmd: 'ruby', checkArgsBuilder: (file) => ['-c', file] });
  });
});
