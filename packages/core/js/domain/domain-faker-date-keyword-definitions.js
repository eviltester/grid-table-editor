const DOMAIN_FAKER_DATE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'date.anytime',
    delegate: {
      type: 'faker',
      target: 'date.anytime',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date that can be either in the past or in the future.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2026-12-25T08:55:20.593Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
      ],
    },
  },
  {
    keyword: 'date.between',
    delegate: {
      type: 'faker',
      target: 'date.between',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date between the given boundaries.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '2026-01-15T12:34:56.000Z',
      returnType: 'date',
      args: [
        {
          name: 'from',
          type: 'number',
          required: false,
          description: 'Start boundary as a Unix timestamp in milliseconds since epoch.',
        },
        {
          name: 'to',
          type: 'number',
          required: false,
          description: 'End boundary as a Unix timestamp in milliseconds since epoch.',
        },
      ],
    },
  },
  {
    keyword: 'date.betweens',
    delegate: {
      type: 'faker',
      target: 'date.betweens',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '["2026-01-15T12:34:56.000Z","2026-02-01T09:00:00.000Z"]',
      returnType: 'array',
      args: [
        {
          name: 'count',
          type: 'number',
          required: false,
          description: 'The number of dates to generate.',
        },
        {
          name: 'from',
          type: 'number',
          required: false,
          description: 'Start boundary as a Unix timestamp in milliseconds since epoch.',
        },
        {
          name: 'to',
          type: 'number',
          required: false,
          description: 'End boundary as a Unix timestamp in milliseconds since epoch.',
        },
      ],
    },
  },
  {
    keyword: 'date.birthdate',
    delegate: {
      type: 'faker',
      target: 'date.birthdate',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"1966-09-18T08:47:31.333Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The maximum age/year to generate a birthdate for/in.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The minimum age/year to generate a birthdate for/in.',
        },
        {
          name: 'mode',
          type: 'string',
          required: false,
          description: "Either 'age' or 'year' to generate a birthdate based on the age or year range.",
        },
      ],
    },
  },
  {
    keyword: 'date.future',
    delegate: {
      type: 'faker',
      target: 'date.future',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the future.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2027-02-07T18:41:48.525Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
        {
          name: 'years',
          type: 'number',
          required: false,
          description: 'The range of years the date may be in the future.',
        },
      ],
    },
  },
  {
    keyword: 'date.month',
    delegate: {
      type: 'faker',
      target: 'date.month',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random name of a month.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: 'February',
      returnType: 'object',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description: 'Whether to return an abbreviation.',
        },
        {
          name: 'context',
          type: 'boolean',
          required: false,
          description:
            'Whether to return the name of a month in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences).',
        },
      ],
    },
  },
  {
    keyword: 'date.past',
    delegate: {
      type: 'faker',
      target: 'date.past',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the past.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2025-07-01T11:48:55.347Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
        {
          name: 'years',
          type: 'number',
          required: false,
          description: 'The range of years the date may be in the past.',
        },
      ],
    },
  },
  {
    keyword: 'date.recent',
    delegate: {
      type: 'faker',
      target: 'date.recent',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the recent past.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2026-04-27T23:46:16.707Z"',
      returnType: 'date',
      args: [
        {
          name: 'days',
          type: 'number',
          required: false,
          description: 'The range of days the date may be in the past.',
        },
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
      ],
    },
  },
  {
    keyword: 'date.soon',
    delegate: {
      type: 'faker',
      target: 'date.soon',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the near future.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2026-04-29T11:09:09.211Z"',
      returnType: 'date',
      args: [
        {
          name: 'days',
          type: 'number',
          required: false,
          description: 'The range of days the date may be in the future.',
        },
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
        },
      ],
    },
  },
  {
    keyword: 'date.timeZone',
    delegate: {
      type: 'faker',
      target: 'date.timeZone',
    },
    help: {
      summary: 'Returns a random IANA time zone relevant to this locale.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: 'Europe/Stockholm',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'date.weekday',
    delegate: {
      type: 'faker',
      target: 'date.weekday',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random day of the week.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: 'Tuesday',
      returnType: 'object',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description: 'Whether to return an abbreviation.',
        },
        {
          name: 'context',
          type: 'boolean',
          required: false,
          description:
            'Whether to return the day of the week in the context of a date. In the currently supported locale this has no visible effect. This option is mainly relevant for future multi-locale support (for example, locale-specific grammar/capitalization differences).',
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_DATE_KEYWORD_DEFINITIONS };
