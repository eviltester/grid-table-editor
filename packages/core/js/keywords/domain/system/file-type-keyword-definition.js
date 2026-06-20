import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_FILE_TYPE_KEYWORD_DEFINITION = {
  keyword: 'system.fileType',
  delegate: {
    type: 'faker',
    target: 'system.fileType',
  },
  help: {
    summary: 'Returns a file type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.fileType',
        sampleReturnValue: 'font',
        description: 'Shows the default system.fileType call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_FILE_TYPE_KEYWORD_DEFINITION };
