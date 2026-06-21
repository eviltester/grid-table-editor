import { validateBooleanValue } from '../../../command-help/command-help-validators.js';

const DATATYPE_BOOLEAN_KEYWORD_DEFINITION = {
  keyword: 'datatype.boolean',
  delegate: {
    type: 'faker',
    target: 'datatype.boolean',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns the boolean value true or false.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/datatype',
    fakerDocsUrl: 'https://fakerjs.dev/api/datatype',
    validator: validateBooleanValue,
    returnType: 'boolean',
    usageExamples: [
      {
        functionCall: 'datatype.boolean()',
        sampleReturnValue: true,
        description: 'Shows datatype.boolean when optional params are omitted.',
      },
      {
        functionCall: 'datatype.boolean(probability=0.5)',
        sampleReturnValue: true,
        description: 'Shows datatype.boolean using probability.',
      },
    ],
    args: [
      {
        name: 'probability',
        type: 'number',
        required: false,
        description: 'Probability threshold for returning true (between 0 and 1).',
      },
    ],
  },
};

export { DATATYPE_BOOLEAN_KEYWORD_DEFINITION };
