import { validateStringValue } from '../../../command-help/command-help-validators.js';

const DATABASE_COLUMN_KEYWORD_DEFINITION = {
  keyword: 'database.column',
  delegate: {
    type: 'faker',
    target: 'database.column',
  },
  help: {
    summary: 'Returns a random database column name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/database',
    fakerDocsUrl: 'https://fakerjs.dev/api/database',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'database.column',
        sampleReturnValue: 'group',
        description: 'Shows the default database.column call.',
      },
    ],
    args: [],
  },
};

export { DATABASE_COLUMN_KEYWORD_DEFINITION };
