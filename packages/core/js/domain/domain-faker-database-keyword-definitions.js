const DOMAIN_FAKER_DATABASE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'database.collation',
    delegate: {
      type: 'faker',
      target: 'database.collation',
    },
    help: {
      summary: 'Returns a random database collation.',
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'utf8_bin',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'status',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'ARCHIVE',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'e80bba2ae67c0c7dcc16bd57',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'smallint',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_DATABASE_KEYWORD_DEFINITIONS };
