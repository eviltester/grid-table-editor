import { validateStringValue } from '../../../command-help/command-help-validators.js';

const DATABASE_TYPE_KEYWORD_DEFINITION = {
  keyword: 'database.type',
  delegate: {
    type: 'faker',
    target: 'database.type',
  },
  help: {
    summary: 'Returns a random database column type.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/database',
    fakerDocsUrl: 'https://fakerjs.dev/api/database',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'database.type',
        sampleReturnValue: 'float',
        description: 'Shows the default database.type call.',
      },
    ],
    args: [],
  },
};

export { DATABASE_TYPE_KEYWORD_DEFINITION };
