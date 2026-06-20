import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_COMMON_FILE_EXT_KEYWORD_DEFINITION = {
  keyword: 'system.commonFileExt',
  delegate: {
    type: 'faker',
    target: 'system.commonFileExt',
  },
  help: {
    summary: 'Returns a commonly used file extension.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.commonFileExt',
        sampleReturnValue: 'png',
        description: 'Shows the default system.commonFileExt call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_COMMON_FILE_EXT_KEYWORD_DEFINITION };
