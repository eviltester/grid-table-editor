import {
  createStringEnumValidator,
  validateAircraftIataTypeCodeValue,
  validateAirlineIataCodeValue,
  validateAirlineRecordLocatorValue,
  validateAirlineSeatValue,
  validateAirportIataCodeValue,
  validateFlightNumberValue,
  validateObjectValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

const AIRCRAFT_TYPES = ['narrowbody', 'regional', 'widebody'];
const AIRCRAFT_TYPE_RETURN_TYPE = AIRCRAFT_TYPES.join('|');
const validateAircraftTypeValue = createStringEnumValidator(AIRCRAFT_TYPES);

const DOMAIN_FAKER_AIRLINE_KEYWORD_DEFINITIONS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
    keyword: 'airline.airline.name',
    delegate: {
      type: 'faker',
      target: 'airline.airline',
      resultPath: 'name',
    },
    help: {
      summary: 'Generate an airline name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
      fakerDocsUrl: 'https://fakerjs.dev/api/airline',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'airline.airline.name',
          sampleReturnValue: 'Flydubai',
          description: 'Shows the default airline.airline.name call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'airline.airplane',
    delegate: {
      type: 'faker',
      target: 'airline.airplane',
    },
    help: {
      summary: 'Generate a value using faker airline.airplane.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
      fakerDocsUrl: 'https://fakerjs.dev/api/airline',
      validator: validateObjectValue,
      returnType: 'object',
      usageExamples: [
        {
          functionCall: 'airline.airplane',
          sampleReturnValue: {
            name: 'Boeing 747-400D',
            iataTypeCode: '74J',
          },
          description: 'Shows the default airline.airplane call.',
        },
      ],
      args: [],
    },
  },
  {
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
  },
  {
    keyword: 'airline.airplane.name',
    delegate: {
      type: 'faker',
      target: 'airline.airplane',
      resultPath: 'name',
    },
    help: {
      summary: 'Generate an airplane model name.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
      fakerDocsUrl: 'https://fakerjs.dev/api/airline',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'airline.airplane.name',
          sampleReturnValue: 'Boeing 747-400D',
          description: 'Shows the default airline.airplane.name call.',
        },
      ],
      args: [],
    },
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    keyword: 'airline.recordLocator',
    delegate: {
      type: 'faker',
      target: 'airline.recordLocator',
    },
    help: {
      summary: 'Generates a random record locator. Record locators are 6-character alphanumeric booking references.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/airline',
      fakerDocsUrl: 'https://fakerjs.dev/api/airline',
      validator: validateAirlineRecordLocatorValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'airline.recordLocator',
          sampleReturnValue: 'KTAGDC',
          description: 'Shows the default airline.recordLocator call.',
        },
      ],
      args: [],
    },
  },
  {
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
  },
];

export { DOMAIN_FAKER_AIRLINE_KEYWORD_DEFINITIONS };
