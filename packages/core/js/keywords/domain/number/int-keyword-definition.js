import { validateIntegerValue } from '../../../command-help/command-help-validators.js';

const NUMBER_INT_KEYWORD_DEFINITION = {
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
};

export { NUMBER_INT_KEYWORD_DEFINITION };
