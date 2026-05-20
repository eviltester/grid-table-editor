const DOMAIN_FAKER_AIRLINE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'airline.aircraftType',
    delegate: {
      type: 'faker',
      target: 'airline.aircraftType',
    },
    help: {
      summary: 'Returns a random aircraft type.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'regional',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '{"name":"American Airlines","iataCode":"AA"}',
      returnType: 'object',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'AA',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'Acme Air',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '{"name":"Airbus A320","iataTypeCode":"A320"}',
      returnType: 'object',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'A320',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'Boeing 737',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '{"name":"Heathrow Airport","iataCode":"LHR"}',
      returnType: 'object',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'LHR',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'London Heathrow Airport',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '1',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'TCSJCN',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '17F',
      examples: ['airline.seat', 'airline.seat(aircraftType="widebody")'],
      returnType: 'string',
      args: [
        {
          name: 'aircraftType',
          type: 'string',
          required: false,
          description: 'The aircraft type. Can be one of narrowbody, regional, widebody.',
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_AIRLINE_KEYWORD_DEFINITIONS };
