import { hasCommand, writeAndCheck } from './test-framework-convertor-syntax.shared.js';

describe('test framework convertor syntax - JavaScript', () => {
  const hasNode = hasCommand('node');

  (hasNode ? test : test.skip)('jest output parses as JavaScript', () => {
    writeAndCheck({ framework: 'jest', ext: 'js', checkCmd: 'node', checkArgsBuilder: (file) => ['--check', file] });
  });

  (hasNode ? test : test.skip)('vitest output parses as JavaScript', () => {
    writeAndCheck({ framework: 'vitest', ext: 'js', checkCmd: 'node', checkArgsBuilder: (file) => ['--check', file] });
  });

  (hasNode ? test : test.skip)('mocha output parses as JavaScript', () => {
    writeAndCheck({ framework: 'mocha', ext: 'js', checkCmd: 'node', checkArgsBuilder: (file) => ['--check', file] });
  });
});
