import { hasCommand, writeAndCheck } from './test-framework-convertor-syntax.shared.js';

describe('test framework convertor syntax - Python', () => {
  const hasPython = hasCommand('python');

  (hasPython ? test : test.skip)('pytest output parses as Python', () => {
    writeAndCheck({
      framework: 'pytest',
      ext: 'py',
      checkCmd: 'python',
      checkArgsBuilder: (file) => ['-m', 'py_compile', file],
    });
  });

  (hasPython ? test : test.skip)('unittest output parses as Python', () => {
    writeAndCheck({
      framework: 'unittest',
      ext: 'py',
      checkCmd: 'python',
      checkArgsBuilder: (file) => ['-m', 'py_compile', file],
    });
  });
});
