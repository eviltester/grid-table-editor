import { validateAirlineIataCodeValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRLINE_IATA_CODE_KEYWORD_DEFINITION = {
  keyword: 'airline.airline.iataCode',
  delegate: {
    type: 'faker',
    target: 'airline.airline',
    resultPath: 'iataCode',
  },
  help: {
    summary: 'Generate an airline IATA code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAirlineIataCodeValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.airline.iataCode',
        sampleReturnValue: 'FZ',
        description: 'Shows the default airline.airline.iataCode call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRLINE_IATA_CODE_KEYWORD_DEFINITION };
