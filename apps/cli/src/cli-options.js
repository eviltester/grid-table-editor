import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SUPPORTED_FORMATS } from '@anywaydata/core';

export function parseCliOptions(argvInput = process.argv) {
  const parsed = yargs(hideBin(argvInput))
    .usage('Usage: anywaydata <generate|amend> [options]')
    .command('generate', 'Generate test data from an input spec')
    .command('amend', 'Amend existing input data from a schema')
    .option('i', { alias: 'inputfile', type: 'string', describe: 'Text file with a data spec' })
    .option('schema-file', { type: 'string', describe: 'Schema file path for amend command' })
    .option('data-file', { type: 'string', describe: 'Input data file path for amend command' })
    .option('input-format', { type: 'string', describe: 'Input data format for amend command (e.g. csv, json)' })
    .option('n', {
      alias: 'numberOfLines',
      type: 'number',
      describe: 'Number of rows to generate (generate) or rows to amend from top of input (amend)',
    })
    .option('f', {
      alias: 'format',
      type: 'string',
      default: 'csv',
      describe: `Output format e.g. ${SUPPORTED_FORMATS.join(',')}`,
    })
    .option('o', { alias: 'outputfile', type: 'string', describe: 'Output file' })
    .option('t', {
      alias: 'testMode',
      type: 'boolean',
      default: false,
      describe: 'Generate one line, report diagnostics and include example output',
    })
    .option('show-progress', {
      type: 'boolean',
      default: undefined,
      describe: 'Show progress logs even when writing to file',
    })
    .option('stream', {
      type: 'boolean',
      default: false,
      describe: 'Use streaming generation path when available (exporting CSV, JSONL, DSV, JSON or XML)',
    })
    .option('stream-threshold', {
      type: 'number',
      default: 5000,
      describe: 'Auto-enable stream mode when rows >= threshold and output file is provided',
    })
    .option('unsafe-faker-expressions', {
      type: 'boolean',
      default: false,
      describe: 'Allow expression-style faker arguments (unsafe for untrusted input)',
    })
    .option('pairwise', {
      type: 'boolean',
      default: false,
      describe: 'Generate pairwise combinations for ENUM fields (requires at least 2 ENUM rules)',
    })
    .help('h')
    .alias('h', 'help')
    .parseSync();

  const command = parsed._[0] === 'amend' ? 'amend' : 'generate';
  const rowCount = command === 'generate' ? (parsed.testMode ? 1 : parsed.numberOfLines) : parsed.numberOfLines;
  const streamThreshold = Number.isFinite(parsed.streamThreshold) ? Math.max(0, parsed.streamThreshold) : 5000;
  const shouldStream =
    command === 'generate' && (parsed.stream === true || (!!parsed.outputfile && rowCount >= streamThreshold));
  const showProgress =
    parsed.showProgress !== undefined ? parsed.showProgress === true : parsed.testMode || !parsed.outputfile;

  const inputFile = command === 'amend' ? parsed['schema-file'] || parsed.inputfile : parsed.inputfile;

  return {
    command,
    inputFile,
    dataFile: parsed['data-file'],
    inputFormat: parsed['input-format'] ? String(parsed['input-format']).toLowerCase() : undefined,
    outputFile: parsed.outputfile,
    format: String(parsed.format || 'csv').toLowerCase(),
    rowCount,
    testMode: parsed.testMode === true,
    showProgress,
    shouldStream,
    unsafeFakerExpressions: parsed['unsafe-faker-expressions'] === true,
    pairwise: parsed.pairwise === true,
  };
}
