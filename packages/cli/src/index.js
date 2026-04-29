#!/usr/bin/env node
import fs from 'node:fs/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateFromTextSpec } from '@anywaydata/core';

const argv = yargs(hideBin(process.argv))
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
    describe: 'Output format e.g. csv,json,jsonl,xml,sql',
  })
  .option('o', { alias: 'outputfile', type: 'string', describe: 'Output file' })
  .option('t', {
    alias: 'testMode',
    type: 'boolean',
    default: false,
    describe: 'Generate one line and log diagnostics',
  })
  .option('unsafe-faker-expressions', {
    type: 'boolean',
    default: false,
    describe: 'Allow expression-style faker arguments (unsafe for untrusted input)',
  })
  .help('h')
  .alias('h', 'help').argv;

const filePath = argv.inputfile;
const textSpec = await fs.readFile(filePath, 'utf8');
const rowCount = argv.testMode ? 1 : argv.numberOfLines;
const result = generateFromTextSpec({
  textSpec,
  rowCount,
  outputFormat: argv.format,
  unsafeFakerExpressions: argv['unsafe-faker-expressions'] === true,
});

if (!result.ok) {
  console.error(result.errors.join('\n'));
  process.exit(1);
}

if (argv.testMode) {
  console.log(result.diagnostics.report);
}

if (argv.outputfile) {
  await fs.writeFile(argv.outputfile, result.rendered, 'utf8');
} else {
  console.log(result.rendered);
}
