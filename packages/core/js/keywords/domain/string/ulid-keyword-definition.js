import { validateUlidValue } from '../../../command-help/command-help-validators.js';

const STRING_ULID_KEYWORD_DEFINITION = {
  keyword: 'string.ulid',
  delegate: {
    type: 'faker',
    target: 'string.ulid',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a ULID (Universally Unique Lexicographically Sortable Identifier).',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateUlidValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.ulid()',
        sampleReturnValue: '01KVDQ3AJ0DQ09425BCHDN6W0N',
        description: 'Shows string.ulid when optional params are omitted.',
      },
      {
        functionCall: 'string.ulid(refDate=1718755200000)',
        sampleReturnValue: '01J0PWP300DQ09425BCHDN6W0N',
        description: 'Shows string.ulid using refDate.',
      },
    ],
    args: [
      {
        name: 'refDate',
        type: 'number',
        required: false,
        description:
          'The date to use as reference point for the newly generated ULID encoded timestamp. The encoded timestamp is represented by the first 10 characters of the result.',
      },
    ],
  },
};

export { STRING_ULID_KEYWORD_DEFINITION };
