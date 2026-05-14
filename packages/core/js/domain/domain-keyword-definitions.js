const DOMAIN_KEYWORD_DEFINITIONS = [
  {
    keyword: 'airline.airplane.iataTypeCode',
    delegate: { type: 'faker', target: 'airline.airplane', resultPath: 'iataTypeCode' },
    help: {
      summary: 'Generate an airplane IATA type code.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'A320',
      args: [],
    },
  },
  {
    keyword: 'airline.airplane.name',
    delegate: { type: 'faker', target: 'airline.airplane', resultPath: 'name' },
    help: {
      summary: 'Generate an airplane model name.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'Boeing 737',
      args: [],
    },
  },
  {
    keyword: 'date.recent',
    delegate: { type: 'faker', target: 'date.recent' },
    help: {
      summary: 'Generate a recent date.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '2026-05-13T12:00:00.000Z',
      args: [],
    },
  },
  {
    keyword: 'internet.email',
    delegate: { type: 'faker', target: 'internet.email' },
    help: {
      summary: 'Generate an email address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'alex@example.com',
      args: [],
    },
  },
  {
    keyword: 'literal.value',
    delegate: { type: 'custom', target: 'literal.value' },
    help: {
      summary: 'Return the literal value provided by the caller.',
      docsUrl: 'https://anywaydata.com/docs/category/generating-data',
      example: 'Pending',
      args: [
        { name: 'value', type: 'string|number|boolean|null', required: true, description: 'Literal value to return.' },
      ],
    },
  },
  {
    keyword: 'number.int',
    delegate: { type: 'faker', target: 'number.int', argTransform: 'optionsFromHelpArgs' },
    help: {
      summary: 'Generate an integer number.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '42',
      args: [
        { name: 'min', type: 'number', required: false, description: 'Optional minimum integer.' },
        { name: 'max', type: 'number', required: false, description: 'Optional maximum integer.' },
      ],
    },
  },
  {
    keyword: 'person.firstName',
    delegate: { type: 'faker', target: 'person.firstName' },
    help: {
      summary: 'Generate a first name.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Alicia',
      args: [{ name: 'sex', type: 'string', required: false, description: 'Optional sex hint (e.g. male, female).' }],
    },
  },
  {
    keyword: 'string.alpha',
    delegate: { type: 'faker', target: 'string.alpha' },
    help: {
      summary: 'Generate alphabetic characters.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 'abcd',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Optional output length.',
        },
      ],
    },
  },
];

export { DOMAIN_KEYWORD_DEFINITIONS };
