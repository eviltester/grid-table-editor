import { validateAirlineSeatValue } from '../../../command-help/command-help-validators.js';

const AIRCRAFT_TYPES = ['narrowbody', 'regional', 'widebody'];

const AIRCRAFT_TYPE_RETURN_TYPE = AIRCRAFT_TYPES.join('|');

const AIRLINE_SEAT_KEYWORD_DEFINITION = {
  keyword: 'airline.seat',
  delegate: {
    type: 'faker',
    target: 'airline.seat',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random seat.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAirlineSeatValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.seat',
        sampleReturnValue: '15E',
        description: 'Shows airline.seat in use.',
      },
      {
        functionCall: 'airline.seat(aircraftType="widebody")',
        sampleReturnValue: '26H',
        description: 'Shows airline.seat in use.',
      },
      {
        functionCall: 'airline.seat()',
        sampleReturnValue: '15E',
        description: 'Shows airline.seat when optional params are omitted.',
      },
    ],
    args: [
      {
        name: 'aircraftType',
        type: AIRCRAFT_TYPE_RETURN_TYPE,
        required: false,
        description: 'The aircraft type. Can be one of narrowbody, regional, widebody.',
        examples: ['widebody'],
      },
    ],
  },
};

export { AIRLINE_SEAT_KEYWORD_DEFINITION };
