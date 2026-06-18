import {
  validateArrayValue,
  validateDateValue,
  validateStringValue,
  validateTimeZoneValue,
} from '../command-help/command-help-validators.js';

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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.anytime()',
          sampleReturnValue: '2026-04-19T02:08:51.881Z',
          description: 'Shows date.anytime when optional params are omitted.',
        },
        {
          functionCall: 'date.anytime(refDate=1577836800000)',
          sampleReturnValue: '2019-11-01T10:13:31.881Z',
          description: 'Shows date.anytime using refDate.',
        },
      ],
      args: [
        {
          name: 'refDate',
          type: 'integer',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
          examples: [1577836800000],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.between(from=1577836800000, to=1609372800000)',
          sampleReturnValue: '2020-06-01T05:06:45.940Z',
          description: 'Shows date.between using explicit from and to timestamps.',
        },
        {
          functionCall: 'date.between(from=1609459200000, to=1640995200000)',
          sampleReturnValue: '2021-06-02T05:06:45.940Z',
          description: 'Shows date.between with a different bounded range.',
        },
      ],
      args: [
        {
          name: 'from',
          type: 'integer',
          required: true,
          description: 'Start boundary as a Unix timestamp in milliseconds since epoch.',
          examples: [1577836800000],
        },
        {
          name: 'to',
          type: 'integer',
          required: true,
          description: 'End boundary as a Unix timestamp in milliseconds since epoch.',
          examples: [1609372800000],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateArrayValue,
      returnType: 'array',
      usageExamples: [
        {
          functionCall: 'date.betweens(count=2, from=1577836800000, to=1609372800000)',
          sampleReturnValue: ['2020-06-01T05:06:45.940Z', '2020-09-19T22:02:33.225Z'],
          description: 'Shows date.betweens returning two sorted dates within a range.',
        },
        {
          functionCall: 'date.betweens(count=3, from=1609459200000, to=1640995200000)',
          sampleReturnValue: ['2021-01-01T01:00:06.924Z', '2021-06-02T05:06:45.940Z', '2021-09-20T22:02:33.225Z'],
          description: 'Shows date.betweens using a larger count within a bounded range.',
        },
        {
          functionCall: 'date.betweens(count=4, from=1640995200000, to=1672531200000)',
          sampleReturnValue: [
            '2022-01-01T01:00:06.924Z',
            '2022-04-21T08:26:00.010Z',
            '2022-06-02T05:06:45.940Z',
            '2022-09-20T22:02:33.225Z',
          ],
          description: 'Shows date.betweens with count, from, and to all supplied explicitly.',
        },
      ],
      args: [
        {
          name: 'count',
          type: 'integer',
          required: false,
          description: 'The number of dates to generate.',
          examples: [2],
        },
        {
          name: 'from',
          type: 'integer',
          required: true,
          description: 'Start boundary as a Unix timestamp in milliseconds since epoch.',
          examples: [1577836800000],
        },
        {
          name: 'to',
          type: 'integer',
          required: true,
          description: 'End boundary as a Unix timestamp in milliseconds since epoch.',
          examples: [1609372800000],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.birthdate(refDate=20000, max=69, min=16, mode="age")',
          sampleReturnValue: '1922-07-10T12:11:49.191Z',
          description: 'Shows date.birthdate in use.',
        },
        {
          functionCall: 'date.birthdate()',
          sampleReturnValue: '1971-09-27T08:09:14.757Z',
          description: 'Shows date.birthdate when optional params are omitted.',
        },
        {
          functionCall: 'date.birthdate(refDate=1577836800000)',
          sampleReturnValue: '1965-04-10T16:13:54.757Z',
          description: 'Shows date.birthdate using refDate.',
        },
        {
          functionCall: 'date.birthdate(max=65)',
          sampleReturnValue: '1980-06-25T11:25:42.848Z',
          description: 'Shows date.birthdate using max.',
        },
        {
          functionCall: 'date.birthdate(max=10, min=1)',
          sampleReturnValue: '2019-08-20T15:04:00.805Z',
          description: 'Shows date.birthdate using min.',
        },
        {
          functionCall: 'date.birthdate(mode="age")',
          sampleReturnValue: '1971-09-27T08:09:14.757Z',
          description: 'Shows date.birthdate using mode.',
        },
      ],
      args: [
        {
          name: 'refDate',
          type: 'integer',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
          examples: [1577836800000],
        },
        {
          name: 'max',
          type: 'integer',
          required: false,
          description: 'The maximum age/year to generate a birthdate for/in.',
          examples: [65],
        },
        {
          name: 'min',
          type: 'integer',
          required: false,
          description: 'The minimum age/year to generate a birthdate for/in.',
          examples: [18],
        },
        {
          name: 'mode',
          type: 'age|year',
          required: false,
          description: "Either 'age' or 'year' to generate a birthdate based on the age or year range.",
          examples: ['age'],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.future()',
          sampleReturnValue: '2026-11-17T21:02:06.523Z',
          description: 'Shows date.future when optional params are omitted.',
        },
        {
          functionCall: 'date.future(refDate=1577836800000)',
          sampleReturnValue: '2020-06-01T05:06:46.523Z',
          description: 'Shows date.future using refDate.',
        },
        {
          functionCall: 'date.future(years=2)',
          sampleReturnValue: '2027-04-19T02:08:52.463Z',
          description: 'Shows date.future using years.',
        },
      ],
      args: [
        {
          name: 'refDate',
          type: 'integer',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
          examples: [1577836800000],
        },
        {
          name: 'years',
          type: 'integer',
          required: false,
          description: 'The range of years the date may be in the future.',
          examples: [2],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'date.month()',
          sampleReturnValue: 'July',
          description: 'Shows date.month when optional params are omitted.',
        },
        {
          functionCall: 'date.month(abbreviated=true)',
          sampleReturnValue: 'Jul',
          description: 'Shows date.month using abbreviated.',
        },
        {
          functionCall: 'date.month(context=true)',
          sampleReturnValue: 'July',
          description: 'Shows date.month using context.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.past()',
          sampleReturnValue: '2025-11-17T21:02:05.523Z',
          description: 'Shows date.past when optional params are omitted.',
        },
        {
          functionCall: 'date.past(refDate=1577836800000)',
          sampleReturnValue: '2019-06-02T05:06:45.523Z',
          description: 'Shows date.past using refDate.',
        },
        {
          functionCall: 'date.past(years=2)',
          sampleReturnValue: '2025-04-19T02:08:51.463Z',
          description: 'Shows date.past using years.',
        },
      ],
      args: [
        {
          name: 'refDate',
          type: 'integer',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
          examples: [1577836800000],
        },
        {
          name: 'years',
          type: 'integer',
          required: false,
          description: 'The range of years the date may be in the past.',
          examples: [2],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.recent()',
          sampleReturnValue: '2026-06-18T01:55:50.284Z',
          description: 'Shows date.recent when optional params are omitted.',
        },
        {
          functionCall: 'date.recent(days=7)',
          sampleReturnValue: '2026-06-14T13:58:54.491Z',
          description: 'Shows date.recent using days.',
        },
        {
          functionCall: 'date.recent(refDate=1577836800000)',
          sampleReturnValue: '2019-12-31T10:00:30.284Z',
          description: 'Shows date.recent using refDate.',
        },
      ],
      args: [
        {
          name: 'days',
          type: 'integer',
          required: false,
          description: 'The range of days the date may be in the past.',
          examples: [7],
        },
        {
          name: 'refDate',
          type: 'integer',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
          examples: [1577836800000],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateDateValue,
      returnType: 'date',
      usageExamples: [
        {
          functionCall: 'date.soon()',
          sampleReturnValue: '2026-06-19T01:55:51.284Z',
          description: 'Shows date.soon when optional params are omitted.',
        },
        {
          functionCall: 'date.soon(days=7)',
          sampleReturnValue: '2026-06-21T13:58:55.491Z',
          description: 'Shows date.soon using days.',
        },
        {
          functionCall: 'date.soon(refDate=1577836800000)',
          sampleReturnValue: '2020-01-01T10:00:31.284Z',
          description: 'Shows date.soon using refDate.',
        },
      ],
      args: [
        {
          name: 'days',
          type: 'integer',
          required: false,
          description: 'The range of days the date may be in the future.',
          examples: [7],
        },
        {
          name: 'refDate',
          type: 'integer',
          required: false,
          description: 'Reference date as a Unix timestamp in milliseconds since epoch used as the generation anchor.',
          examples: [1577836800000],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateTimeZoneValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'date.timeZone',
          sampleReturnValue: 'America/Santiago',
          description: 'Shows the default date.timeZone call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/date',
      fakerDocsUrl: 'https://fakerjs.dev/api/date',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'date.weekday()',
          sampleReturnValue: 'Saturday',
          description: 'Shows date.weekday when optional params are omitted.',
        },
        {
          functionCall: 'date.weekday(abbreviated=true)',
          sampleReturnValue: 'Sat',
          description: 'Shows date.weekday using abbreviated.',
        },
        {
          functionCall: 'date.weekday(context=true)',
          sampleReturnValue: 'Saturday',
          description: 'Shows date.weekday using context.',
        },
      ],
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
