import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_FILE_EXT_KEYWORD_DEFINITION = {
  keyword: 'system.fileExt',
  delegate: {
    type: 'faker',
    target: 'system.fileExt',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Returns a file extension.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.fileExt()',
        sampleReturnValue: '7z',
        description: 'Shows system.fileExt when optional params are omitted.',
      },
      {
        functionCall: 'system.fileExt(mimeType="image/png")',
        sampleReturnValue: '7z',
        description: 'Shows system.fileExt using mimeType.',
      },
    ],
    args: [
      {
        name: 'mimeType',
        type: 'string',
        required: false,
        description: 'MIME type used to constrain generated values.',
      },
    ],
  },
};

export { SYSTEM_FILE_EXT_KEYWORD_DEFINITION };
