import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_COMMON_FILE_NAME_KEYWORD_DEFINITION = {
  keyword: 'system.commonFileName',
  delegate: {
    type: 'faker',
    target: 'system.commonFileName',
  },
  help: {
    summary: 'Returns a random file name with a given extension or a commonly used extension.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.commonFileName()',
        sampleReturnValue: 'fog_aboard.mp4v',
        description: 'Shows system.commonFileName when optional params are omitted.',
      },
      {
        functionCall: 'system.commonFileName(extension="txt")',
        sampleReturnValue: 'fog_aboard.txt',
        description: 'Shows system.commonFileName using extension.',
      },
    ],
    args: [
      {
        name: 'extension',
        type: 'string',
        required: false,
        description: 'File extension to include in the generated filename.',
      },
    ],
  },
};

export { SYSTEM_COMMON_FILE_NAME_KEYWORD_DEFINITION };
