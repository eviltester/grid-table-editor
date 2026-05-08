import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SUPPORTED_FORMATS } from '@anywaydata/core';

export function parseCliOptions(argvInput = process.argv) {
  const parsed = yargs(hideBin(argvInput))
    .usage('Usage: anywaydata generate -i input.txt -n 10 -f csv [-o output.txt]')
    .command('generate', 'Generate test data from an input spec')
    .option('i', { alias: 'inputfile', type: 'string', demandOption: true, describe: 'Text file with a data spec' })
    .option('n', {
      alias: 'numberOfLines',
      type: 'number',
      demandOption: true,
      default: 1,
      describe: 'Number of lines to generate',
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
      describe: 'Use streaming generation path when available',
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
    .help('h')
    .alias('h', 'help')
    .parseSync();

  const rowCount = parsed.testMode ? 1 : parsed.numberOfLines;
  const streamThreshold = Number.isFinite(parsed.streamThreshold) ? Math.max(0, parsed.streamThreshold) : 5000;
  const shouldStream = parsed.stream === true || (!!parsed.outputfile && rowCount >= streamThreshold);
  const showProgress =
    parsed.showProgress !== undefined ? parsed.showProgress === true : parsed.testMode || !parsed.outputfile;

  return {
    inputFile: parsed.inputfile,
    outputFile: parsed.outputfile,
    format: String(parsed.format || 'csv').toLowerCase(),
    rowCount,
    testMode: parsed.testMode === true,
    showProgress,
    shouldStream,
    unsafeFakerExpressions: parsed['unsafe-faker-expressions'] === true,
  };
}
