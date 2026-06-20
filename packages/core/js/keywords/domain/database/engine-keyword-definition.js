import { validateStringValue } from '../../../command-help/command-help-validators.js';

const DATABASE_ENGINE_KEYWORD_DEFINITION = {
  keyword: 'database.engine',
  delegate: {
    type: 'faker',
    target: 'database.engine',
  },
  help: {
    summary: 'Returns a random database engine.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/database',
    fakerDocsUrl: 'https://fakerjs.dev/api/database',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'database.engine',
        sampleReturnValue: 'CSV',
        description: 'Shows the default database.engine call.',
      },
    ],
    args: [],
  },
};

export { DATABASE_ENGINE_KEYWORD_DEFINITION };
