const DOMAIN_FAKER_NUMBER_KEYWORD_DEFINITIONS = [
  {
    keyword: 'number.bigInt',
    delegate: {
      type: 'faker',
      target: 'number.bigInt',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a BigInt number.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '347465151663036',
      returnType: 'integer',
      args: [
        {
          name: 'value',
          type: 'bigint|number|string|boolean',
          required: false,
          description:
            'Base value used for generation. Supports bigint, number, string, or boolean inputs. For range constraints use min, max, and multipleOf.',
        },
      ],
    },
  },
  {
    keyword: 'number.binary',
    delegate: {
      type: 'faker',
      target: 'number.binary',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a binary string.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '0',
      returnType: 'string',
      args: [
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Upper bound for generated number.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Lower bound for generated number.',
        },
      ],
    },
  },
  {
    keyword: 'number.float',
    delegate: {
      type: 'faker',
      target: 'number.float',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '0.5433707701438405',
      returnType: 'number',
      args: [
        {
          name: 'fractionDigits',
          type: 'number',
          required: false,
          description:
            'The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Upper bound for generated number, exclusive, unless multipleOf or fractionDigits are passed.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Lower bound for generated number, inclusive.',
        },
        {
          name: 'multipleOf',
          type: 'number',
          required: false,
          description:
            'The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed.',
        },
      ],
    },
  },
  {
    keyword: 'number.hex',
    delegate: {
      type: 'faker',
      target: 'number.hex',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a lowercase hexadecimal number.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: 'd',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
      ],
    },
  },
  {
    keyword: 'number.int',
    delegate: {
      type: 'faker',
      target: 'number.int',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a single random integer between zero and the given max value or the given range.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '5190574431878510',
      returnType: 'integer',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Optional minimum integer.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Optional maximum integer.',
        },
        {
          name: 'multipleOf',
          type: 'number',
          required: false,
          description: 'Generated number will be a multiple of the given integer.',
        },
      ],
    },
  },
  {
    keyword: 'number.octal',
    delegate: {
      type: 'faker',
      target: 'number.octal',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an octal string.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '6',
      returnType: 'string',
      args: [
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Upper bound for generated number.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Lower bound for generated number.',
        },
      ],
    },
  },
  {
    keyword: 'number.romanNumeral',
    delegate: {
      type: 'faker',
      target: 'number.romanNumeral',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a roman numeral in String format.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: 'XXXV',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum bound used when generating a value.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum bound used when generating a value.',
        },
      ],
    },
  },
];

export { DOMAIN_FAKER_NUMBER_KEYWORD_DEFINITIONS };
