import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRPLANE_KEYWORD_DEFINITION = {
  keyword: 'airline.airplane',
  delegate: {
    type: 'faker',
    target: 'airline.airplane',
  },
  help: {
    summary: 'Generate a value using faker airline.airplane.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'airline.airplane',
        sampleReturnValue: {
          name: 'Boeing 747-400D',
          iataTypeCode: '74J',
        },
        description: 'Shows the default airline.airplane call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRPLANE_KEYWORD_DEFINITION };
