import { validateStringOrNumberValue } from '../../../command-help/command-help-validators.js';

function validateAutoIncrementSequenceArgs(_args = [], context = {}) {
  const argsByName = context?.argsByName || {};

  if (argsByName.step === 0) {
    return {
      ok: false,
      error: 'Invalid keyword arguments: argument "step" must be a non-zero integer',
    };
  }

  if (typeof argsByName.zeropadding !== 'undefined' && argsByName.zeropadding < 0) {
    return {
      ok: false,
      error: 'Invalid keyword arguments: argument "zeropadding" must be greater than or equal to 0',
    };
  }

  return { ok: true };
}

const AUTO_INCREMENT_SEQUENCE_KEYWORD_DEFINITION = {
  keyword: 'autoIncrement.sequence',
  delegate: {
    type: 'custom',
    target: 'autoIncrement.sequence',
  },
  help: {
    summary:
      'Generates an incrementing sequence. Values only advance when a generated row is accepted, so constraint-filtered rows do not consume sequence numbers.',
    docsUrl: 'https://anywaydata.com/docs/test-data/auto-increment-sequences',
    fakerDocsUrl: '',
    validator: validateStringOrNumberValue,
    argsValidator: validateAutoIncrementSequenceArgs,
    returnType: 'string|number',
    usageExamples: [
      {
        functionCall: 'autoIncrement.sequence()',
        sampleReturnValue: 1,
        description: 'Shows autoIncrement.sequence in use.',
      },
      {
        functionCall: 'autoIncrement.sequence(start=10, step=5)',
        sampleReturnValue: 10,
        description: 'Shows autoIncrement.sequence in use.',
      },
      {
        functionCall: 'autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)',
        sampleReturnValue: 'filename001.txt',
        description: 'Shows autoIncrement.sequence in use.',
      },
      {
        functionCall: 'autoIncrement.sequence(start=10)',
        sampleReturnValue: 10,
        description: 'Shows autoIncrement.sequence using start.',
      },
      {
        functionCall: 'autoIncrement.sequence(step=5)',
        sampleReturnValue: 1,
        description: 'Shows autoIncrement.sequence using step.',
      },
      {
        functionCall: 'autoIncrement.sequence(prefix="filename")',
        sampleReturnValue: 'filename1',
        description: 'Shows autoIncrement.sequence using prefix.',
      },
      {
        functionCall: 'autoIncrement.sequence(suffix=".txt")',
        sampleReturnValue: '1.txt',
        description: 'Shows autoIncrement.sequence using suffix.',
      },
      {
        functionCall: 'autoIncrement.sequence(zeropadding=3)',
        sampleReturnValue: '001',
        description: 'Shows autoIncrement.sequence using zeropadding.',
      },
    ],
    args: [
      {
        name: 'start',
        type: 'integer',
        required: false,
        description: 'Starting integer in the sequence. Defaults to 1.',
        examples: [10],
      },
      {
        name: 'step',
        type: 'integer',
        required: false,
        description: 'Non-zero amount added after each accepted row. Defaults to 1.',
        examples: [5],
      },
      {
        name: 'prefix',
        type: 'string',
        required: false,
        description: 'Optional text added before the numeric portion.',
        examples: ['filename'],
      },
      {
        name: 'suffix',
        type: 'string',
        required: false,
        description: 'Optional text added after the numeric portion.',
        examples: ['.txt'],
      },
      {
        name: 'zeropadding',
        type: 'integer',
        required: false,
        description:
          'Total digit width for the numeric portion. A value of 3 renders 1 as 001, while 100 stays 100. Defaults to 0.',
        examples: [3],
      },
    ],
  },
};

export { AUTO_INCREMENT_SEQUENCE_KEYWORD_DEFINITION };
