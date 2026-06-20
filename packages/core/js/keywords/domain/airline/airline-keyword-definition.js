import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRLINE_KEYWORD_DEFINITION = {
  keyword: 'airline.airline',
  delegate: {
    type: 'faker',
    target: 'airline.airline',
  },
  help: {
    summary: 'Generate a value using faker airline.airline.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'airline.airline',
        sampleReturnValue: {
          name: 'Flydubai',
          iataCode: 'FZ',
        },
        description: 'Shows the default airline.airline call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRLINE_KEYWORD_DEFINITION };
