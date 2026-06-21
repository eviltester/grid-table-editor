import { validateStringValue } from '../../../command-help/command-help-validators.js';

const NUMBER_BINARY_KEYWORD_DEFINITION = {
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
};

export { NUMBER_BINARY_KEYWORD_DEFINITION };
