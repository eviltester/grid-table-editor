import { validateSampleStringValue } from '../../../command-help/command-help-validators.js';

const STRING_SAMPLE_KEYWORD_DEFINITION = {
  keyword: 'string.sample',
  delegate: {
    type: 'faker',
    target: 'string.sample',
  },
  help: {
    summary: 'Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateSampleStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.sample()',
        sampleReturnValue: 'Gc!=.)2AES',
        description: 'Shows string.sample when optional params are omitted.',
      },
      {
        functionCall: 'string.sample(length=5)',
        sampleReturnValue: 'Gc!=.',
        description: 'Shows string.sample using length.',
      },
    ],
    args: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: 'Exact number of characters to generate.',
      },
    ],
  },
};

export { STRING_SAMPLE_KEYWORD_DEFINITION };
