import { hasCommand, hasPerlModule, writeAndCheck } from './test-framework-convertor-syntax.shared.js';

describe('test framework convertor syntax - Perl', () => {
  const hasPerl = hasCommand('perl');
  const hasTest2V0 = hasPerl && hasPerlModule('Test2::V0');

  (hasPerl ? test : test.skip)('test-more output parses as Perl', () => {
    writeAndCheck({ framework: 'test-more', ext: 'pl', checkCmd: 'perl', checkArgsBuilder: (file) => ['-c', file] });
  });

  (hasTest2V0 ? test : test.skip)('test2-suite output parses as Perl', () => {
    writeAndCheck({ framework: 'test2-suite', ext: 'pl', checkCmd: 'perl', checkArgsBuilder: (file) => ['-c', file] });
  });
});
