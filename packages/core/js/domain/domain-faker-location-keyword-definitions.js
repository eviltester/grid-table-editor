import {
  validateArrayValue,
  validateCountryCodeValue,
  validateNumberValue,
  validateObjectValue,
  validateStringValue,
  validateTimeZoneValue,
} from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_LOCATION_KEYWORD_DEFINITIONS = [
  {
    keyword: 'location.buildingNumber',
    delegate: {
      type: 'faker',
      target: 'location.buildingNumber',
    },
    help: {
      summary: 'Generates a random building number.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.buildingNumber',
          sampleReturnValue: '7031',
          description: 'Shows the default location.buildingNumber call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.cardinalDirection',
          sampleReturnValue: 'East',
          description: 'Shows the default location.cardinalDirection call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.city',
          sampleReturnValue: 'Edwinville',
          description: 'Shows the default location.city call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.continent',
          sampleReturnValue: 'Asia',
          description: 'Shows the default location.continent call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.country',
          sampleReturnValue: 'India',
          description: 'Shows the default location.country call.',
        },
      ],
      args: [],
    },
  },
  {
    keyword: 'location.countryCode',
    delegate: {
      type: 'faker',
      target: 'location.countryCode',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random ISO_3166-1 country code.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateCountryCodeValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.countryCode()',
          sampleReturnValue: 'IM',
          description: 'Shows location.countryCode when optional params are omitted.',
        },
        {
          functionCall: 'location.countryCode(variant="alpha-3")',
          sampleReturnValue: 'IMN',
          description: 'Shows location.countryCode using variant.',
        },
      ],
      args: [
        {
          name: 'variant',
          type: 'alpha-2|alpha-3|numeric',
          required: false,
          description:
            "The code to return. Can be either 'alpha-2' (two-letter code), 'alpha-3' (three-letter code) or 'numeric' (numeric code).",
          examples: ['alpha-3'],
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.county',
          sampleReturnValue: 'Cleveland',
          description: 'Shows the default location.county call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.direction()',
          sampleReturnValue: 'West',
          description: 'Shows location.direction when optional params are omitted.',
        },
        {
          functionCall: 'location.direction(abbreviated=true)',
          sampleReturnValue: 'W',
          description: 'Shows location.direction using abbreviated.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateObjectValue,
      returnType: 'object',
      usageExamples: [
        {
          functionCall: 'location.language',
          sampleReturnValue: {
            name: 'Punjabi',
            alpha2: 'pa',
            alpha3: 'pan',
          },
          description: 'Shows the default location.language call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateNumberValue,
      returnType: 'number',
      usageExamples: [
        {
          functionCall: 'location.latitude()',
          sampleReturnValue: -14.936,
          description: 'Shows location.latitude when optional params are omitted.',
        },
        {
          functionCall: 'location.latitude(max=10, min=1)',
          sampleReturnValue: 4.7532,
          description: 'Shows location.latitude using min.',
        },
        {
          functionCall: 'location.latitude(max=5)',
          sampleReturnValue: -50.3829,
          description: 'Shows location.latitude using max.',
        },
        {
          functionCall: 'location.latitude(precision=1)',
          sampleReturnValue: -14.9,
          description: 'Shows location.latitude using precision.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateNumberValue,
      returnType: 'number',
      usageExamples: [
        {
          functionCall: 'location.longitude()',
          sampleReturnValue: -29.8721,
          description: 'Shows location.longitude when optional params are omitted.',
        },
        {
          functionCall: 'location.longitude(max=10, min=1)',
          sampleReturnValue: 4.7532,
          description: 'Shows location.longitude using min.',
        },
        {
          functionCall: 'location.longitude(max=5)',
          sampleReturnValue: -102.8509,
          description: 'Shows location.longitude using max.',
        },
        {
          functionCall: 'location.longitude(precision=1)',
          sampleReturnValue: -29.9,
          description: 'Shows location.longitude using precision.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateArrayValue,
      returnType: 'array',
      usageExamples: [
        {
          functionCall: 'location.nearbyGPSCoordinate',
          sampleReturnValue: [-14.936, 79.3168],
          description: 'Shows the default location.nearbyGPSCoordinate call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.ordinalDirection',
          sampleReturnValue: 'Northwest',
          description: 'Shows the default location.ordinalDirection call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.secondaryAddress',
          sampleReturnValue: 'Apt. 703',
          description: 'Shows the default location.secondaryAddress call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.state()',
          sampleReturnValue: 'Massachusetts',
          description: 'Shows location.state when optional params are omitted.',
        },
        {
          functionCall: 'location.state(abbreviated=true)',
          sampleReturnValue: 'MA',
          description: 'Shows location.state using abbreviated.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.street',
          sampleReturnValue: 'Gutmann Creek',
          description: 'Shows the default location.street call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.streetAddress()',
          sampleReturnValue: '7031 Iris Mill',
          description: 'Shows location.streetAddress when optional params are omitted.',
        },
        {
          functionCall: 'location.streetAddress(useFullAddress=true)',
          sampleReturnValue: '7031 Iris Mill Apt. 728',
          description: 'Shows location.streetAddress using useFullAddress.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateTimeZoneValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.timeZone',
          sampleReturnValue: 'America/Santiago',
          description: 'Shows the default location.timeZone call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/location',
      fakerDocsUrl: 'https://fakerjs.dev/api/location',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'location.zipCode',
          sampleReturnValue: '70310',
          description: 'Shows the default location.zipCode call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_LOCATION_KEYWORD_DEFINITIONS };
