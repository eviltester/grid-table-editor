const DOMAIN_FAKER_PHONE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'phone.imei',
    delegate: {
      type: 'faker',
      target: 'phone.imei',
    },
    help: {
      summary: 'Generates IMEI number.',
      docsUrl: 'https://fakerjs.dev/api/phone',
      example: '44-358223-971834-1',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'phone.number',
    delegate: {
      type: 'faker',
      target: 'phone.number',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random phone number.',
      docsUrl: 'https://fakerjs.dev/api/phone',
      example: '298.756.9044',
      returnType: 'string',
      args: [
        {
          name: 'style',
          type: 'string',
          required: false,
          description:
            "Style of the generated phone number: 'human': (default) A human-input phone number, e.g. 555-770-7727 or 555.770.7727 x1234 'national': A phone number in a standardized national format, e.g. (555) 123-4567. 'international': A phone number in the E.123 international format, e.g. +15551234567",
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_PHONE_KEYWORD_DEFINITIONS };
