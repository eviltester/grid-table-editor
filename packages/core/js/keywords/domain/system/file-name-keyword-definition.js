import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_FILE_NAME_KEYWORD_DEFINITION = {
  keyword: 'system.fileName',
  delegate: {
    type: 'faker',
    target: 'system.fileName',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a random file name with extension.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.fileName()',
        sampleReturnValue: 'fog_aboard.otf',
        description: 'Shows the default system.fileName call.',
      },
      {
        functionCall: 'system.fileName(extensionCount=2)',
        sampleReturnValue: 'fog_aboard.otf.7z',
        description: 'Shows system.fileName using extensionCount.',
      },
    ],
    args: [
      {
        name: 'extensionCount',
        type: 'number',
        required: false,
        description: 'How many extensions the generated file name should have.',
        examples: [2],
      },
    ],
  },
};

export { SYSTEM_FILE_NAME_KEYWORD_DEFINITION };
