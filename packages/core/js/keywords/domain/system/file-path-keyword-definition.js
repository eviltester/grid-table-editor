import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_FILE_PATH_KEYWORD_DEFINITION = {
  keyword: 'system.filePath',
  delegate: {
    type: 'faker',
    target: 'system.filePath',
  },
  help: {
    summary: 'Returns a file path.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.filePath',
        sampleReturnValue: '/opt/include/down_reproachfully_besides.woff2',
        description: 'Shows the default system.filePath call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_FILE_PATH_KEYWORD_DEFINITION };
