import { validateMongoObjectIdValue } from '../../../command-help/command-help-validators.js';

const DATABASE_MONGODB_OBJECT_ID_KEYWORD_DEFINITION = {
  keyword: 'database.mongodbObjectId',
  delegate: {
    type: 'faker',
    target: 'database.mongodbObjectId',
  },
  help: {
    summary: 'Returns a MongoDB ObjectId string.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/database',
    fakerDocsUrl: 'https://fakerjs.dev/api/database',
    validator: validateMongoObjectIdValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'database.mongodbObjectId',
        sampleReturnValue: '9f0632478b9f4d0e9c34bf6f',
        description: 'Shows the default database.mongodbObjectId call.',
      },
    ],
    args: [],
  },
};

export { DATABASE_MONGODB_OBJECT_ID_KEYWORD_DEFINITION };
