const DOMAIN_FAKER_LOCATION_KEYWORD_DEFINITIONS = [
  {
    keyword: 'location.buildingNumber',
    delegate: {
      type: 'faker',
      target: 'location.buildingNumber',
    },
    help: {
      summary: 'Generates a random building number.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '5075',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.cardinalDirection',
    delegate: {
      type: 'faker',
      target: 'location.cardinalDirection',
    },
    help: {
      summary: 'Returns a random cardinal direction (north, east, south, west).',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'East',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.city',
    delegate: {
      type: 'faker',
      target: 'location.city',
    },
    help: {
      summary: 'Generates a random localized city name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Stellachester',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.continent',
    delegate: {
      type: 'faker',
      target: 'location.continent',
    },
    help: {
      summary: 'Returns a random continent name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Asia',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.country',
    delegate: {
      type: 'faker',
      target: 'location.country',
    },
    help: {
      summary: 'Returns a random country name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Svalbard & Jan Mayen Islands',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.countryCode',
    delegate: {
      type: 'faker',
      target: 'location.countryCode',
    },
    help: {
      summary: 'Returns a random ISO_3166-1 country code.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'MG',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.county',
    delegate: {
      type: 'faker',
      target: 'location.county',
    },
    help: {
      summary:
        "Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.",
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Northamptonshire',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.direction',
    delegate: {
      type: 'faker',
      target: 'location.direction',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random direction (cardinal and ordinal; northwest, east, etc).',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'North',
      returnType: 'string',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description:
            'If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name.',
        },
      ],
    },
  },
  {
    keyword: 'location.language',
    delegate: {
      type: 'faker',
      target: 'location.language',
    },
    help: {
      summary: 'Returns a random spoken language.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '{"name":"Icelandic","alpha2":"is","alpha3":"isl"}',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'location.latitude',
    delegate: {
      type: 'faker',
      target: 'location.latitude',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random latitude.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '51.5448',
      returnType: 'number',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the latitude to generate.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the latitude to generate.',
        },
        {
          name: 'precision',
          type: 'number',
          required: false,
          description: 'The number of decimal points of precision for the latitude.',
        },
      ],
    },
  },
  {
    keyword: 'location.longitude',
    delegate: {
      type: 'faker',
      target: 'location.longitude',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random longitude.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '92.3892',
      returnType: 'number',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the longitude to generate.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the longitude to generate.',
        },
        {
          name: 'precision',
          type: 'number',
          required: false,
          description: 'The number of decimal points of precision for the longitude.',
        },
      ],
    },
  },
  {
    keyword: 'location.nearbyGPSCoordinate',
    delegate: {
      type: 'faker',
      target: 'location.nearbyGPSCoordinate',
    },
    help: {
      summary: 'Generates a random GPS coordinate within the specified radius from the given coordinate.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '[58.313,9.9746]',
      returnType: 'array',
      args: [],
    },
  },
  {
    keyword: 'location.ordinalDirection',
    delegate: {
      type: 'faker',
      target: 'location.ordinalDirection',
    },
    help: {
      summary: 'Returns a random ordinal direction (northwest, southeast, etc).',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Northeast',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.secondaryAddress',
    delegate: {
      type: 'faker',
      target: 'location.secondaryAddress',
    },
    help: {
      summary: 'Generates a random localized secondary address. This refers to a specific location at a given address',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Suite 634',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.state',
    delegate: {
      type: 'faker',
      target: 'location.state',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        "Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.",
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Hawaii',
      returnType: 'string',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description:
            'If true this will return abbreviated first-level administrative entity names. Otherwise this will return the long name.',
        },
      ],
    },
  },
  {
    keyword: 'location.street',
    delegate: {
      type: 'faker',
      target: 'location.street',
    },
    help: {
      summary: 'Generates a random localized street name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Viva Harbor',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.streetAddress',
    delegate: {
      type: 'faker',
      target: 'location.streetAddress',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random localized street address.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '12056 Vandervort Common',
      returnType: 'string',
      args: [
        {
          name: 'useFullAddress',
          type: 'boolean',
          required: false,
          description: 'Whether to expand to a full address including secondary address information.',
        },
      ],
    },
  },
  {
    keyword: 'location.timeZone',
    delegate: {
      type: 'faker',
      target: 'location.timeZone',
    },
    help: {
      summary: 'Returns a random IANA time zone name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Australia/Perth',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.zipCode',
    delegate: {
      type: 'faker',
      target: 'location.zipCode',
    },
    help: {
      summary: 'Generates data using faker location zip code.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '36791',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_LOCATION_KEYWORD_DEFINITIONS };
