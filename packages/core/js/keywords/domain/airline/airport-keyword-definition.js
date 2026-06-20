import { validateObjectValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRPORT_KEYWORD_DEFINITION = {
  keyword: 'airline.airport',
  delegate: {
    type: 'faker',
    target: 'airline.airport',
  },
  help: {
    summary: 'Generate a value using faker airline.airport.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateObjectValue,
    returnType: 'object',
    usageExamples: [
      {
        functionCall: 'airline.airport',
        sampleReturnValue: {
          name: 'Hurgada International Airport',
          iataCode: 'HRG',
        },
        description: 'Shows the default airline.airport call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRPORT_KEYWORD_DEFINITION };
