import { validateFlightNumberValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_FLIGHT_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'airline.flightNumber',
  delegate: {
    type: 'faker',
    target: 'airline.flightNumber',
  },
  help: {
    summary:
      'Returns a random flight number. Flight numbers are always 1 to 4 digits long and may include leading zeros.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateFlightNumberValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.flightNumber',
        sampleReturnValue: '70',
        description: 'Shows the default airline.flightNumber call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_FLIGHT_NUMBER_KEYWORD_DEFINITION };
