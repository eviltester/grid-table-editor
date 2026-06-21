import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_COMMON_FILE_TYPE_KEYWORD_DEFINITION = {
  keyword: 'system.commonFileType',
  delegate: {
    type: 'faker',
    target: 'system.commonFileType',
  },
  help: {
    summary: 'Returns a commonly used file type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.commonFileType',
        sampleReturnValue: 'image',
        description: 'Shows the default system.commonFileType call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_COMMON_FILE_TYPE_KEYWORD_DEFINITION };
