import { validateStringValue } from '../../../command-help/command-help-validators.js';

const DATABASE_COLLATION_KEYWORD_DEFINITION = {
  keyword: 'database.collation',
  delegate: {
    type: 'faker',
    target: 'database.collation',
  },
  help: {
    summary: 'Returns a random database collation.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/database',
    fakerDocsUrl: 'https://fakerjs.dev/api/database',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'database.collation',
        sampleReturnValue: 'cp1250_bin',
        description: 'Shows the default database.collation call.',
      },
    ],
    args: [],
  },
};

export { DATABASE_COLLATION_KEYWORD_DEFINITION };
