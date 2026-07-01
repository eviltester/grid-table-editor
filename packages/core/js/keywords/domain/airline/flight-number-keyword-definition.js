import { validateFlightNumberValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_FLIGHT_NUMBER_KEYWORD_DEFINITION = {
  keyword: 'airline.flightNumber',
  delegate: {
    type: 'faker',
    target: 'airline.flightNumber',
    argTransform: 'optionsFromHelpArgs',
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
        functionCall: 'airline.flightNumber()',
        sampleReturnValue: '70',
        description: 'Shows the default airline.flightNumber call.',
      },
      {
        functionCall: 'airline.flightNumber(length=4, addLeadingZeros=true)',
        sampleReturnValue: '4703',
        description: 'Shows airline.flightNumber using length and leading-zero options.',
      },
      {
        functionCall: 'airline.flightNumber(length=4)',
        sampleReturnValue: '4703',
        description: 'Shows airline.flightNumber using a fixed length.',
      },
      {
        functionCall: 'airline.flightNumber(addLeadingZeros=true)',
        sampleReturnValue: '0070',
        description: 'Shows airline.flightNumber padding shorter values with leading zeros.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Desired flight-number length.',
        examples: [4],
      },
      {
        name: 'addLeadingZeros',
        type: 'boolean',
        required: false,
        description: 'Whether shorter flight numbers should be padded with leading zeros.',
        examples: [true],
      },
    ],
  },
};

export { AIRLINE_FLIGHT_NUMBER_KEYWORD_DEFINITION };
