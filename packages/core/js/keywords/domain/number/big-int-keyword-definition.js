import { validateIntegerValue } from '../../../command-help/command-help-validators.js';
import {
  composeArgsValidators,
  createOrderedArgsValidator,
  createNumericArgRangeValidator,
} from '../../../domain/domain-keyword-arg-validators.js';

const validateBigIntBounds = composeArgsValidators(
  createOrderedArgsValidator({ lowerName: 'min', upperName: 'max' }),
  createNumericArgRangeValidator({
    argName: 'multipleOf',
    min: 0,
    inclusiveMin: false,
    description: 'Invalid keyword arguments: argument "multipleOf" must be greater than 0',
  })
);

const NUMBER_BIG_INT_KEYWORD_DEFINITION = {
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
    argsValidator: validateBigIntBounds,
    returnType: 'integer',
    usageExamples: [
      {
        functionCall: 'number.bigInt()',
        sampleReturnValue: 703101335462806n,
        description: 'Shows number.bigInt with all optional params omitted.',
      },
      {
        functionCall: 'number.bigInt(min=100, max=1000)',
        sampleReturnValue: 570n,
        description: 'Shows number.bigInt using min and max bounds.',
      },
      {
        functionCall: 'number.bigInt(multipleOf=7)',
        sampleReturnValue: 292170934823957n,
        description: 'Shows number.bigInt constrained to a multiple.',
      },
      {
        functionCall: 'number.bigInt(max=1000)',
        sampleReturnValue: 699n,
        description: 'Shows number.bigInt using an upper bound.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'integer',
        required: false,
        description: 'Optional minimum bound for the generated BigInt value.',
        examples: [100],
      },
      {
        name: 'max',
        type: 'integer',
        required: false,
        description: 'Optional maximum bound for the generated BigInt value.',
        examples: [1000],
      },
      {
        name: 'multipleOf',
        type: 'integer',
        required: false,
        description: 'Generated BigInt will be a multiple of the given value.',
        examples: [7],
      },
    ],
  },
};

export { NUMBER_BIG_INT_KEYWORD_DEFINITION };
