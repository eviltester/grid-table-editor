import { validateNanoIdValue } from '../../../command-help/command-help-validators.js';

const STRING_NANOID_KEYWORD_DEFINITION = {
  keyword: 'string.nanoid',
  delegate: {
    type: 'faker',
    target: 'string.nanoid',
  },
  help: {
    summary: 'Generates a Nano ID.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateNanoIdValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.nanoid()',
        sampleReturnValue: 'Ii5lxGSFycYGT2SqxjPK-',
        description: 'Shows string.nanoid when optional params are omitted.',
      },
      {
        functionCall: 'string.nanoid(length=5)',
        sampleReturnValue: 'Ii5lx',
        description: 'Shows string.nanoid using length.',
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

export { STRING_NANOID_KEYWORD_DEFINITION };
