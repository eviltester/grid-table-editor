const DOMAIN_FAKER_DATATYPE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'datatype.boolean',
    delegate: {
      type: 'faker',
      target: 'datatype.boolean',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns the boolean value true or false.',
      docsUrl: 'https://fakerjs.dev/api/datatype',
      example: 'true',
      returnType: 'boolean',
      args: [
        {
          name: 'probability',
          type: 'number',
          required: false,
          description: 'Probability threshold for returning true (between 0 and 1).',
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_DATATYPE_KEYWORD_DEFINITIONS };
