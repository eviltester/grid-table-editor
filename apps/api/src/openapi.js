const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'AnyWayData REST API',
    version: '0.1.0',
    description: 'REST API for generating data from multiline text specifications.',
  },
  servers: [{ url: '/' }],
  paths: {
    '/v1/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service health response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    service: { type: 'string', example: 'anywaydata-api' },
                  },
                  required: ['ok', 'service'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/generate': {
      post: {
        summary: 'Generate data from text spec with selectable response shape',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['textSpec', 'rowCount'],
                properties: {
                  textSpec: { type: 'string' },
                  rowCount: { type: 'integer', minimum: 0 },
                  outputFormat: {
                    type: 'string',
                    enum: [
                      'csv',
                      'dsv',
                      'markdown',
                      'json',
                      'jsonl',
                      'javascript',
                      'python',
                      'java',
                      'typescript',
                      'xml',
                      'sql',
                      'gherkin',
                      'html',
                      'asciitable',
                      'junit4',
                      'junit5',
                      'junit6',
                      'testng',
                      'pytest',
                      'jest',
                      'xunit',
                      'rspec',
                      'phpunit',
                      'kotest',
                      'test-more',
                      'unittest',
                      'nose2',
                      'vitest',
                      'mocha',
                      'nunit',
                      'mstest',
                      'pest',
                      'minitest',
                      'junit5-kotlin',
                      'spek',
                      'test2-suite',
                    ],
                    default: 'csv',
                  },
                  options: { type: 'object' },
                  seed: { type: 'number' },
                  unsafeFakerExpressions: {
                    type: 'boolean',
                    default: false,
                    description: 'Allow expression-style faker arguments (unsafe for untrusted input)',
                  },
                  responseFormat: { type: 'string', enum: ['rows', 'rendered', 'all', 'raw'], default: 'rows' },
                },
              },
            },
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['textSpec', 'rowCount'],
                properties: {
                  textSpec: { type: 'string' },
                  rowCount: { type: 'integer', minimum: 0 },
                  outputFormat: {
                    type: 'string',
                    enum: [
                      'csv',
                      'dsv',
                      'markdown',
                      'json',
                      'jsonl',
                      'javascript',
                      'python',
                      'java',
                      'typescript',
                      'xml',
                      'sql',
                      'gherkin',
                      'html',
                      'asciitable',
                      'junit4',
                      'junit5',
                      'junit6',
                      'testng',
                      'pytest',
                      'jest',
                      'xunit',
                      'rspec',
                      'phpunit',
                      'kotest',
                      'test-more',
                      'unittest',
                      'nose2',
                      'vitest',
                      'mocha',
                      'nunit',
                      'mstest',
                      'pest',
                      'minitest',
                      'junit5-kotlin',
                      'spek',
                      'test2-suite',
                    ],
                    default: 'csv',
                  },
                  seed: { type: 'number' },
                  unsafeFakerExpressions: {
                    type: 'boolean',
                    default: false,
                    description: 'Allow expression-style faker arguments (unsafe for untrusted input)',
                  },
                  responseFormat: { type: 'string', enum: ['rows', 'rendered', 'all', 'raw'], default: 'rows' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Generation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    headers: { type: 'array', items: { type: 'string' } },
                    rows: {
                      type: 'array',
                      items: {
                        type: 'array',
                        items: {
                          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }, { type: 'object' }],
                        },
                      },
                    },
                    rendered: { type: 'string' },
                    format: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
          500: {
            description: 'Generation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/generate/fromschema': {
      post: {
        summary: 'Generate from raw multiline text/plain schema/spec',
        parameters: [
          {
            in: 'query',
            name: 'rowCount',
            required: true,
            schema: { type: 'integer', minimum: 0 },
            description: 'Number of rows to generate',
          },
          {
            in: 'query',
            name: 'outputFormat',
            required: false,
            schema: {
              type: 'string',
              enum: [
                'csv',
                'dsv',
                'markdown',
                'json',
                'jsonl',
                'javascript',
                'python',
                'java',
                'typescript',
                'xml',
                'sql',
                'gherkin',
                'html',
                'asciitable',
                'junit4',
                'junit5',
                'junit6',
                'testng',
                'pytest',
                'jest',
                'xunit',
                'rspec',
                'phpunit',
                'kotest',
                'test-more',
                'unittest',
                'nose2',
                'vitest',
                'mocha',
                'nunit',
                'mstest',
                'pest',
                'minitest',
                'junit5-kotlin',
                'spek',
                'test2-suite',
              ],
              default: 'csv',
            },
          },
          {
            in: 'query',
            name: 'seed',
            required: false,
            schema: { type: 'number' },
          },
          {
            in: 'query',
            name: 'unsafeFakerExpressions',
            required: false,
            schema: {
              type: 'boolean',
              default: false,
            },
            description: 'Allow expression-style faker arguments (unsafe for untrusted input)',
          },
          {
            in: 'query',
            name: 'responseFormat',
            required: false,
            schema: { type: 'string', enum: ['rows', 'rendered', 'all', 'raw'], default: 'rows' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'text/plain': {
              schema: { type: 'string' },
              example: 'iata\nairline.airline.iataCode\nseat\nairline.seat',
            },
          },
        },
        responses: {
          200: {
            description: 'Generation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    headers: { type: 'array', items: { type: 'string' } },
                    rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
                    rendered: { type: 'string' },
                    format: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
          500: {
            description: 'Generation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/generate/options/{format}': {
      get: {
        summary: 'Get current default generation options for a format',
        parameters: [
          {
            in: 'path',
            name: 'format',
            required: true,
            schema: {
              type: 'string',
              enum: [
                'csv',
                'dsv',
                'markdown',
                'json',
                'jsonl',
                'javascript',
                'python',
                'java',
                'typescript',
                'xml',
                'sql',
                'gherkin',
                'html',
                'asciitable',
                'junit4',
                'junit5',
                'junit6',
                'testng',
                'pytest',
                'jest',
                'xunit',
                'rspec',
                'phpunit',
                'kotest',
                'test-more',
                'unittest',
                'nose2',
                'vitest',
                'mocha',
                'nunit',
                'mstest',
                'pest',
                'minitest',
                'junit5-kotlin',
                'spek',
                'test2-suite',
              ],
            },
          },
        ],
        responses: {
          200: {
            description: 'Current defaults for the format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    format: { type: 'string' },
                    options: { type: 'object', additionalProperties: true },
                    source: { type: 'string', enum: ['custom-default', 'built-in-default'] },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Set default generation options for a format',
        parameters: [
          {
            in: 'path',
            name: 'format',
            required: true,
            schema: {
              type: 'string',
              enum: [
                'csv',
                'dsv',
                'markdown',
                'json',
                'jsonl',
                'javascript',
                'python',
                'java',
                'typescript',
                'xml',
                'sql',
                'gherkin',
                'html',
                'asciitable',
                'junit4',
                'junit5',
                'junit6',
                'testng',
                'pytest',
                'jest',
                'xunit',
                'rspec',
                'phpunit',
                'kotest',
                'test-more',
                'unittest',
                'nose2',
                'vitest',
                'mocha',
                'nunit',
                'mstest',
                'pest',
                'minitest',
                'junit5-kotlin',
                'spek',
                'test2-suite',
              ],
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated default options for the format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    format: { type: 'string' },
                    options: { type: 'object', additionalProperties: true },
                    source: { type: 'string', enum: ['custom-default'] },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/generate/options/{format}/default': {
      post: {
        summary: 'Reset default generation options for a format to built-in defaults',
        parameters: [
          {
            in: 'path',
            name: 'format',
            required: true,
            schema: {
              type: 'string',
              enum: [
                'csv',
                'dsv',
                'markdown',
                'json',
                'jsonl',
                'javascript',
                'python',
                'java',
                'typescript',
                'xml',
                'sql',
                'gherkin',
                'html',
                'asciitable',
                'junit4',
                'junit5',
                'junit6',
                'testng',
                'pytest',
                'jest',
                'xunit',
                'rspec',
                'phpunit',
                'kotest',
                'test-more',
                'unittest',
                'nose2',
                'vitest',
                'mocha',
                'nunit',
                'mstest',
                'pest',
                'minitest',
                'junit5-kotlin',
                'spek',
                'test2-suite',
              ],
            },
          },
        ],
        responses: {
          200: {
            description: 'Format defaults reset',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    format: { type: 'string' },
                    options: { type: 'object', additionalProperties: true },
                    source: { type: 'string', enum: ['built-in-default'] },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failure',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: { type: 'array', items: { type: 'string' } },
                    diagnostics: { type: 'object' },
                  },
                  required: ['errors'],
                },
              },
            },
          },
        },
      },
    },
  },
};

export { openApiDocument };
