import { hasCommand, writeAndCheck } from './test-framework-convertor-syntax.shared.js';

describe('test framework convertor syntax - PHP', () => {
  const hasPhp = hasCommand('php');

  (hasPhp ? test : test.skip)('phpunit output parses as PHP', () => {
    writeAndCheck({ framework: 'phpunit', ext: 'php', checkCmd: 'php', checkArgsBuilder: (file) => ['-l', file] });
  });

  (hasPhp ? test : test.skip)('pest output parses as PHP', () => {
    writeAndCheck({ framework: 'pest', ext: 'php', checkCmd: 'php', checkArgsBuilder: (file) => ['-l', file] });
  });
});
