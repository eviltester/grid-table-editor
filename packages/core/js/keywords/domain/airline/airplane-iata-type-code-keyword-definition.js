import { validateAircraftIataTypeCodeValue } from '../../../command-help/command-help-validators.js';

const AIRLINE_AIRPLANE_IATA_TYPE_CODE_KEYWORD_DEFINITION = {
  keyword: 'airline.airplane.iataTypeCode',
  delegate: {
    type: 'faker',
    target: 'airline.airplane',
    resultPath: 'iataTypeCode',
  },
  help: {
    summary: 'Generate an airplane IATA type code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
    fakerDocsUrl: 'https://fakerjs.dev/api/airline',
    validator: validateAircraftIataTypeCodeValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'airline.airplane.iataTypeCode',
        sampleReturnValue: '74J',
        description: 'Shows the default airline.airplane.iataTypeCode call.',
      },
    ],
    args: [],
  },
};

export { AIRLINE_AIRPLANE_IATA_TYPE_CODE_KEYWORD_DEFINITION };
