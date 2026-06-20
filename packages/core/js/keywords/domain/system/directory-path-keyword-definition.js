import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_DIRECTORY_PATH_KEYWORD_DEFINITION = {
  keyword: 'system.directoryPath',
  delegate: {
    type: 'faker',
    target: 'system.directoryPath',
  },
  help: {
    summary: 'Returns a directory path.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.directoryPath',
        sampleReturnValue: '/opt/include',
        description: 'Shows the default system.directoryPath call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_DIRECTORY_PATH_KEYWORD_DEFINITION };
