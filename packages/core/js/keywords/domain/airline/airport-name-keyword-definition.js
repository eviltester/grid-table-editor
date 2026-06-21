import { validateStringValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRPORT_NAME_KEYWORD_DEFINITION = {
  keyword: 'airline.airport.name',
  delegate: {
    type: 'faker',
    target: 'airline.airport',
    resultPath: 'name',
  },
  help: {
    summary: 'Generate an airport name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.airport.name',
        sampleReturnValue: 'Hurgada International Airport',
        description: 'Shows the default airline.airport.name call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRPORT_NAME_KEYWORD_DEFINITION };
