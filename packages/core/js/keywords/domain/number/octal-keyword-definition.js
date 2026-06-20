import { validateStringValue } from '../../../command-help/command-help-validators.js';

const NUMBER_OCTAL_KEYWORD_DEFINITION = {
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
};

export { NUMBER_OCTAL_KEYWORD_DEFINITION };
