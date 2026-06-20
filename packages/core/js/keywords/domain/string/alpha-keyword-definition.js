import { validateAlphaStringValue } from '../../../command-help/command-help-validators.js';

const STRING_CASING_TYPE = 'upper|lower|mixed';

const STRING_ALPHA_KEYWORD_DEFINITION = {
  keyword: 'string.alpha',
  delegate: {
    type: 'faker',
    target: 'string.alpha',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generating a string consisting of letters in the English alphabet.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateAlphaStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.alpha()',
        sampleReturnValue: 'v',
        description: 'Shows string.alpha with all optional params omitted.',
      },
      {
        functionCall: 'string.alpha(length=5)',
        sampleReturnValue: 'vLaph',
        description: 'Shows string.alpha generating a fixed-length alphabetic value.',
      },
      {
        functionCall: 'string.alpha(casing="upper")',
        sampleReturnValue: 'K',
        description: 'Shows string.alpha using only the casing option.',
      },
      {
        functionCall: 'string.alpha(length=5, casing="upper")',
        sampleReturnValue: 'KSAHD',
        description: 'Shows string.alpha with explicit uppercase output.',
      },
      {
        functionCall: 'string.alpha(exclude=["A","B","C"])',
        sampleReturnValue: 'u',
        description: 'Shows string.alpha excluding specific characters without setting length or casing.',
      },
      {
        functionCall: 'string.alpha(length=5, casing="upper", exclude=["A","B","C"])',
        sampleReturnValue: 'MTDJG',
        description: 'Shows string.alpha excluding specific characters from the candidate set.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Desired length of the generated value.',
      },
      {
        name: 'casing',
        type: STRING_CASING_TYPE,
        required: false,
        description: 'The casing of the characters.',
      },
      {
        name: 'exclude',
        type: 'array',
        required: false,
        description: 'An array with characters which should be excluded in the generated string.',
      },
    ],
  },
};

export { STRING_ALPHA_KEYWORD_DEFINITION };
