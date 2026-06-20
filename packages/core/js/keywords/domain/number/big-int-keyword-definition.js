import { validateIntegerValue } from '../../../command-help/command-help-validators.js';

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
};

export { NUMBER_BIG_INT_KEYWORD_DEFINITION };
