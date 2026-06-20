import { createStringEnumValidator } from '../../../command-help/command-help-validators.js';

const AIRCRAFT_TYPES = ['narrowbody', 'regional', 'widebody'];

const AIRCRAFT_TYPE_RETURN_TYPE = AIRCRAFT_TYPES.join('|');

const validateAircraftTypeValue = createStringEnumValidator(AIRCRAFT_TYPES);

const AIRLINE_AIRCRAFT_TYPE_KEYWORD_DEFINITION = {
  keyword: 'airline.aircraftType',
  delegate: {
    type: 'faker',
    target: 'airline.aircraftType',
  },
  help: {
    summary: 'Returns a random aircraft type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAircraftTypeValue,
    returnType: AIRCRAFT_TYPE_RETURN_TYPE,
    usageExamples: [
      {
        functionCall: 'airline.aircraftType',
        sampleReturnValue: 'regional',
        description: 'Shows the default airline.aircraftType call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRCRAFT_TYPE_KEYWORD_DEFINITION };
