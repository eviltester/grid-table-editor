import { validateAlphanumericStringValue } from '../../../command-help/command-help-validators.js';

const STRING_CASING_TYPE = 'upper|lower|mixed';

const STRING_ALPHANUMERIC_KEYWORD_DEFINITION = {
  keyword: 'string.alphanumeric',
  delegate: {
    type: 'faker',
    target: 'string.alphanumeric',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generating a string consisting of alpha characters and digits.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateAlphanumericStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.alphanumeric()',
        sampleReturnValue: 'p',
        description: 'Shows string.alphanumeric when optional params are omitted.',
      },
      {
        functionCall: 'string.alphanumeric(length=5)',
        sampleReturnValue: 'pI0i9',
        description: 'Shows string.alphanumeric using length.',
      },
      {
        functionCall: 'string.alphanumeric(casing="upper")',
        sampleReturnValue: 'F',
        description: 'Shows string.alphanumeric using casing.',
      },
      {
        functionCall: 'string.alphanumeric(exclude=["A","B","C"])',
        sampleReturnValue: 'o',
        description: 'Shows string.alphanumeric using exclude.',
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
        description: 'An array of characters and digits which should be excluded in the generated string.',
      },
    ],
  },
};

export { STRING_ALPHANUMERIC_KEYWORD_DEFINITION };
