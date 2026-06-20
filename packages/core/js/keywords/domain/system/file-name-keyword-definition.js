import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_FILE_NAME_KEYWORD_DEFINITION = {
  keyword: 'system.fileName',
  delegate: {
    type: 'faker',
    target: 'system.fileName',
  },
  help: {
    summary: 'Returns a random file name with extension.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.fileName',
        sampleReturnValue: 'fog_aboard.otf',
        description: 'Shows the default system.fileName call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_FILE_NAME_KEYWORD_DEFINITION };
