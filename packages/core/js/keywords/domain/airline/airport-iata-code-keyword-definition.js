import { validateAirportIataCodeValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRPORT_IATA_CODE_KEYWORD_DEFINITION = {
  keyword: 'airline.airport.iataCode',
  delegate: {
    type: 'faker',
    target: 'airline.airport',
    resultPath: 'iataCode',
  },
  help: {
    summary: 'Generate an airport IATA code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAirportIataCodeValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.airport.iataCode',
        sampleReturnValue: 'HRG',
        description: 'Shows the default airline.airport.iataCode call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRPORT_IATA_CODE_KEYWORD_DEFINITION };
