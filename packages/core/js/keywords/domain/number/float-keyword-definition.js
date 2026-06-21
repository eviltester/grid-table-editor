import { validateNumberValue } from '../../../command-help/command-help-validators.js';

const NUMBER_FLOAT_KEYWORD_DEFINITION = {
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
};

export { NUMBER_FLOAT_KEYWORD_DEFINITION };
