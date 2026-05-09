import { parseCliOptions } from '../cli-options.js';

test('testMode forces rowCount to 1 and enables progress', () => {
  const opts = parseCliOptions([
    'node',
    'cli',
    'generate',
    '-i',
    'spec.txt',
    '-n',
    '200',
    '--testMode',
    '--format',
    'json',
  ]);

  expect(opts.rowCount).toBe(1);
  expect(opts.testMode).toBe(true);
  expect(opts.showProgress).toBe(true);
});

test('stream auto-enabled for large file outputs', () => {
  const opts = parseCliOptions([
    'node',
    'cli',
    'generate',
    '-i',
    'spec.txt',
    '-n',
    '6000',
    '-o',
    'out.csv',
    '--format',
    'csv',
  ]);
  expect(opts.shouldStream).toBe(true);
});

test('pairwise flag is parsed', () => {
  const opts = parseCliOptions(['node', 'cli', 'generate', '-i', 'spec.txt', '-n', '5', '--pairwise']);
  expect(opts.pairwise).toBe(true);
});

test('amend command options are parsed', () => {
  const opts = parseCliOptions([
    'node',
    'cli',
    'amend',
    '--schema-file',
    'schema.txt',
    '--data-file',
    'data.csv',
    '--input-format',
    'csv',
    '-n',
    '3',
    '-f',
    'json',
  ]);
  expect(opts.command).toBe('amend');
  expect(opts.inputFile).toBe('schema.txt');
  expect(opts.dataFile).toBe('data.csv');
  expect(opts.inputFormat).toBe('csv');
  expect(opts.rowCount).toBe(3);
  expect(opts.shouldStream).toBe(false);
});
