import {
  validateIntegerValue,
  validateNumberValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateIntegerValue,
      returnType: 'integer',
      usageExamples: [
        {
          functionCall: 'number.bigInt()',
          sampleReturnValue: 703101335462806n,
          description: 'Shows number.bigInt with all optional params omitted.',
        },
        {
          functionCall: 'number.bigInt(value=true)',
          sampleReturnValue: 703101335462806n,
          description: 'Shows number.bigInt using a boolean base value.',
        },
      ],
      args: [
        {
          name: 'value',
          type: 'bigint|number|string|boolean',
          required: false,
          description:
            'Base value used for generation. Supports bigint, number, string, or boolean inputs. For range constraints use min, max, and multipleOf.',
          examples: [true],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'number.binary()',
          sampleReturnValue: '0',
          description: 'Shows number.binary when optional params are omitted.',
        },
        {
          functionCall: 'number.binary(max=5)',
          sampleReturnValue: '10',
          description: 'Shows number.binary using max.',
        },
        {
          functionCall: 'number.binary(max=10, min=1)',
          sampleReturnValue: '101',
          description: 'Shows number.binary using min.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateNumberValue,
      returnType: 'number',
      usageExamples: [
        {
          functionCall: 'number.float()',
          sampleReturnValue: 0.417022004702574,
          description: 'Shows number.float with all optional params omitted.',
        },
        {
          functionCall: 'number.float(fractionDigits=2)',
          sampleReturnValue: 0.42,
          description: 'Shows number.float rounding using only fractionDigits.',
        },
        {
          functionCall: 'number.float(multipleOf=0.5)',
          sampleReturnValue: 0.5,
          description: 'Shows number.float constrained using only multipleOf.',
        },
        {
          functionCall: 'number.float(min=1, max=10)',
          sampleReturnValue: 4.753198042323167,
          description: 'Shows number.float with an explicit numeric range.',
        },
        {
          functionCall: 'number.float(min=1, max=10, fractionDigits=2)',
          sampleReturnValue: 4.75,
          description: 'Shows number.float rounding with fractionDigits.',
        },
        {
          functionCall: 'number.float(min=1, max=10, multipleOf=0.5)',
          sampleReturnValue: 4.5,
          description: 'Shows number.float constrained to a multiple.',
        },
        {
          functionCall: 'number.float(max=10)',
          sampleReturnValue: 4.17022004702574,
          description: 'Shows number.float using only an upper bound.',
        },
      ],
      args: [
        {
          name: 'fractionDigits',
          type: 'integer',
          required: false,
          description:
            'The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed.',
          examples: [2],
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
          examples: [1],
        },
        {
          name: 'multipleOf',
          type: 'number',
          required: false,
          description:
            'The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed.',
          examples: [0.5],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'number.hex()',
          sampleReturnValue: '6',
          description: 'Shows number.hex when optional params are omitted.',
        },
        {
          functionCall: 'number.hex(max=10, min=1)',
          sampleReturnValue: '5',
          description: 'Shows number.hex using min.',
        },
        {
          functionCall: 'number.hex(max=5)',
          sampleReturnValue: '2',
          description: 'Shows number.hex using max.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateIntegerValue,
      returnType: 'integer',
      usageExamples: [
        {
          functionCall: 'number.int()',
          sampleReturnValue: 3756200289967619,
          description: 'Shows number.int when optional params are omitted.',
        },
        {
          functionCall: 'number.int(max=10, min=1)',
          sampleReturnValue: 5,
          description: 'Shows number.int using min.',
        },
        {
          functionCall: 'number.int(max=5)',
          sampleReturnValue: 2,
          description: 'Shows number.int using max.',
        },
        {
          functionCall: 'number.int(multipleOf=1)',
          sampleReturnValue: 3756200289967619,
          description: 'Shows number.int using multipleOf.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'number.octal()',
          sampleReturnValue: '3',
          description: 'Shows number.octal when optional params are omitted.',
        },
        {
          functionCall: 'number.octal(max=5)',
          sampleReturnValue: '2',
          description: 'Shows number.octal using max.',
        },
        {
          functionCall: 'number.octal(max=10, min=1)',
          sampleReturnValue: '5',
          description: 'Shows number.octal using min.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
      fakerDocsUrl: 'https://fakerjs.dev/api/number',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'number.romanNumeral()',
          sampleReturnValue: 'MDCLXVIII',
          description: 'Shows number.romanNumeral when optional params are omitted.',
        },
        {
          functionCall: 'number.romanNumeral(max=10, min=1)',
          sampleReturnValue: 'V',
          description: 'Shows number.romanNumeral using min.',
        },
        {
          functionCall: 'number.romanNumeral(max=5)',
          sampleReturnValue: 'III',
          description: 'Shows number.romanNumeral using max.',
        },
      ],
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
