import { validateDateValue } from '../../../command-help/command-help-validators.js';
import { createOrderedArgsValidator } from '../../../domain/domain-keyword-arg-validators.js';

const validateDateBetweenBounds = createOrderedArgsValidator({ lowerName: 'from', upperName: 'to' });

const DATE_BETWEEN_KEYWORD_DEFINITION = {
  keyword: 'date.between',
  delegate: {
    type: 'faker',
    target: 'date.between',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random date between the given boundaries.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
    fakerDocsUrl: 'https://fakerjs.dev/api/date',
    validator: validateDateValue,
    argsValidator: validateDateBetweenBounds,
    returnType: 'date',
    usageExamples: [
      {
        functionCall: 'date.between(from=1577836800000, to=1609372800000)',
        sampleReturnValue: '2020-06-01T05:06:45.940Z',
        description: 'Shows date.between using explicit from and to timestamps.',
      },
      {
        functionCall: 'date.between(from=1609459200000, to=1640995200000)',
        sampleReturnValue: '2021-06-02T05:06:45.940Z',
        description: 'Shows date.between with a different bounded range.',
      },
    ],
    args: [
      {
        name: 'from',
        type: 'integer',
        required: true,
        description: 'Start boundary as a Unix timestamp in milliseconds since epoch.',
        examples: [1577836800000],
      },
      {
        name: 'to',
        type: 'integer',
        required: true,
        description: 'End boundary as a Unix timestamp in milliseconds since epoch.',
        examples: [1609372800000],
      },
    ],
  },
};

export { DATE_BETWEEN_KEYWORD_DEFINITION };
