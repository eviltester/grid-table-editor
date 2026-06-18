import { validateMongoObjectIdValue, validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_DATABASE_KEYWORD_DEFINITIONS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export { DOMAIN_FAKER_DATABASE_KEYWORD_DEFINITIONS };
