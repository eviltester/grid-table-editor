import { validateStringValue } from '../../../command-help/command-help-validators.js';

const NUMBER_HEX_KEYWORD_DEFINITION = {
  keyword: 'number.hex',
  delegate: {
    type: 'faker',
    target: 'number.hex',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a lowercase hexadecimal number.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/number',
    fakerDocsUrl: 'https://fakerjs.dev/api/number',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'number.hex()',
        sampleReturnValue: '6',
        description: 'Shows number.hex when optional params are omitted.',
      },
      {
        functionCall: 'number.hex(max=10, min=1)',
        sampleReturnValue: '5',
        description: 'Shows number.hex using min.',
      },
      {
        functionCall: 'number.hex(max=5)',
        sampleReturnValue: '2',
        description: 'Shows number.hex using max.',
      },
    ],
    args: [
      {
        name: 'min',
        type: 'number',
        required: false,
        description: 'Minimum bound used when generating a value.',
      },
      {
        name: 'max',
        type: 'number',
        required: false,
        description: 'Maximum bound used when generating a value.',
      },
    ],
  },
};

export { NUMBER_HEX_KEYWORD_DEFINITION };
