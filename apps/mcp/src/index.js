#!/usr/bin/env node

import readline from 'node:readline';
import {
  createExporterForDefaults,
  generateFromTextSpec,
  SUPPORTED_FORMATS,
  validateSafeFakerRules,
} from '@anywaydata/core';

const serverInfo = {
  name: 'anywaydata-mcp',
  version: '0.1.0',
};

const MAX_TEXT_SPEC_LENGTH = 200000;

const RESOURCE_URIS = {
  optionCatalog: 'anywaydata://schemas/output-format-options',
  installGuide: 'anywaydata://install/config-examples',
};

const FORMAT_OPTION_NOTES = {
  xml: {
    rootElementName: 'XML root tag name.',
    itemElementName: 'Per-row XML tag name.',
    attributeColumnsCsv: 'Comma-separated columns to render as XML attributes on each item tag.',
    includeXmlHeader: 'Include XML declaration header.',
    xmlns: 'Namespace URI, rendered as xmlns attribute on the root tag.',
  },
  junit4: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @Before setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method, inline, or csv source.',
  },
  junit5: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @BeforeEach setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method, inline, or csv source.',
  },
  junit6: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @BeforeEach setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method, inline, or csv source.',
  },
  testng: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @BeforeMethod setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method or inline.',
  },
  pytest: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include pytest fixture scaffold and wire it into the test signature.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider function or inline rows.',
  },
  jest: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include beforeEach setup scaffold in generated suite.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider function or inline rows.',
  },
  xunit: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include constructor setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: MemberData provider or InlineData.',
  },
  rspec: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include before block scaffold in generated spec.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: rows constant iteration.',
  },
  phpunit: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include setUp() scaffold in generated test class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: data provider rows.',
  },
  kotest: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include beforeTest setup scaffold in generated spec.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: rows collection iteration.',
  },
  'test-more': {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include setup variable scaffold in generated script.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: row hash iteration.',
  },
};

function inferJsonSchemaType(value) {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'number') {
    return 'number';
  }
  if (typeof value === 'string') {
    return 'string';
  }
  if (value && typeof value === 'object') {
    return 'object';
  }
  return 'string';
}

function buildOptionsPropertySchema(defaultOptions, format) {
  const properties = {};
  for (const [optionName, defaultValue] of Object.entries(defaultOptions || {})) {
    properties[optionName] = {
      type: inferJsonSchemaType(defaultValue),
      default: defaultValue,
      description: FORMAT_OPTION_NOTES[format]?.[optionName] || undefined,
    };
  }

  return {
    type: 'object',
    additionalProperties: true,
    properties,
    description: `Formatter options for "${format}". Unknown keys are ignored by unsupported formatters.`,
  };
}

function buildFormatOptionCatalog() {
  const exporter = createExporterForDefaults();
  const catalog = {};
  for (const format of SUPPORTED_FORMATS) {
    const formatOptions = exporter.getOptionsForType(format)?.options || {};
    catalog[format] = {
      format,
      optionDefaults: formatOptions,
      optionSchema: buildOptionsPropertySchema(formatOptions, format),
    };
  }
  return catalog;
}

const FORMAT_OPTIONS_CATALOG = buildFormatOptionCatalog();

function buildGenerateOptionsSchema() {
  const oneOf = SUPPORTED_FORMATS.map((format) => ({
    type: 'object',
    properties: {
      outputFormat: { const: format },
      options: FORMAT_OPTIONS_CATALOG[format].optionSchema,
    },
    required: ['outputFormat'],
  }));

  return {
    type: 'object',
    description:
      'Formatter options for the selected outputFormat. For full schema/defaults, call get_output_format_options_schema.',
    additionalProperties: true,
    oneOf,
  };
}

const GENERATE_OPTIONS_SCHEMA = buildGenerateOptionsSchema();

const TOOL_ERROR_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', const: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        details: {},
      },
      required: ['code', 'message'],
    },
  },
  required: ['ok', 'error'],
};

const GENERATE_RESULT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    errors: { type: 'array', items: { type: 'string' } },
    headers: { type: 'array', items: { type: 'string' } },
    rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
    rendered: { type: 'string' },
    format: { type: 'string', enum: SUPPORTED_FORMATS },
    diagnostics: {
      type: 'object',
      properties: {
        report: { type: 'string' },
        rowCount: { type: 'integer' },
      },
      additionalProperties: true,
    },
  },
  required: ['ok'],
};

function createToolError(code, message, details) {
  return {
    ok: false,
    error: {
      code,
      message,
      details: details ?? null,
    },
  };
}

function createToolSuccess(payload) {
  return {
    ok: true,
    ...payload,
  };
}

function writeToolResult(id, payload, isError = false) {
  return writeMessage({
    jsonrpc: '2.0',
    id,
    result: {
      content: [
        {
          type: 'text',
          text: JSON.stringify(payload),
        },
      ],
      structuredContent: payload,
      isError,
    },
  });
}

function getResources() {
  return [
    {
      uri: RESOURCE_URIS.optionCatalog,
      name: 'Output Format Option Schemas',
      description: 'Discoverable formatter option defaults and schema per output format.',
      mimeType: 'application/json',
    },
    {
      uri: RESOURCE_URIS.installGuide,
      name: 'Install Config Examples',
      description: 'MCP install/config examples for common hosts and environments.',
      mimeType: 'application/json',
    },
  ];
}

function getResourceByUri(uri) {
  if (uri === RESOURCE_URIS.optionCatalog) {
    return {
      ok: true,
      supportedFormats: SUPPORTED_FORMATS,
      formats: FORMAT_OPTIONS_CATALOG,
    };
  }

  if (uri === RESOURCE_URIS.installGuide) {
    return {
      ok: true,
      transport: 'stdio',
      examples: {
        codex_local_repo: {
          command: 'node',
          args: ['apps/mcp/src/index.js'],
          cwd: 'D:/github/grid-table-editor',
        },
        codex_npx: {
          command: 'npx',
          args: ['-y', '@anywaydata/mcp'],
        },
        docker_stdio: {
          command: 'docker',
          args: ['run', '--rm', '-i', 'anywaydata-mcp'],
        },
      },
      notes: ['Use stdio transport.', 'Avoid npm run wrappers in MCP hosts to prevent non-JSON stdout noise.'],
    };
  }

  return null;
}

function normalizeRuleText(ruleText) {
  const trimmed = ruleText.trim();
  if (trimmed.startsWith('{{') && trimmed.endsWith('}}')) {
    return trimmed.slice(2, -2).trim();
  }
  return trimmed;
}

function maybeConvertKeyValueSpec(textSpec) {
  if (typeof textSpec !== 'string') {
    return textSpec;
  }

  const lines = textSpec
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0 || lines.some((line) => !line.includes(':'))) {
    return textSpec;
  }

  const converted = [];
  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    const name = line.slice(0, separatorIndex).trim();
    const rule = line.slice(separatorIndex + 1).trim();
    if (name.length === 0 || rule.length === 0) {
      return textSpec;
    }
    converted.push(name);
    converted.push(normalizeRuleText(rule));
  }

  return converted.join('\n');
}

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function handleRequest(request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        serverInfo,
        capabilities: { tools: {}, resources: {} },
      },
    });
  }

  if (method === 'tools/list') {
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'generate_data_from_spec',
            description:
              'Generate data rows and formatted output from a multiline text specification. Supported textSpec forms: (1) alternating lines: ColumnName then RuleDefinition, (2) key/value lines: ColumnName: RuleDefinition (auto-converted).',
            inputSchema: {
              type: 'object',
              properties: {
                textSpec: {
                  type: 'string',
                  description:
                    'Examples:\nName\\nperson.firstName\\nSurname\\nperson.lastName\nor\nname: faker.person.firstName()\nlast_name: person.lastName',
                },
                rowCount: { type: 'integer', minimum: 0 },
                outputFormat: { type: 'string', enum: SUPPORTED_FORMATS },
                options: GENERATE_OPTIONS_SCHEMA,
                seed: { type: 'number' },
                pairwise: {
                  type: 'boolean',
                  description: 'Generate pairwise combinations for ENUM fields (requires at least 2 ENUM rules).',
                },
              },
              required: ['textSpec', 'rowCount', 'outputFormat'],
            },
            outputSchema: {
              oneOf: [GENERATE_RESULT_SCHEMA, TOOL_ERROR_SCHEMA],
            },
          },
          {
            name: 'get_output_format_options_schema',
            description:
              'Return discoverable formatter option defaults and typed JSON schema for supported output formats. Use this to discover valid options before calling generate_data_from_spec.',
            inputSchema: {
              type: 'object',
              properties: {
                outputFormat: {
                  type: 'string',
                  enum: SUPPORTED_FORMATS,
                  description: 'Optional. If provided, return only this format schema.',
                },
              },
            },
            outputSchema: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', const: true },
                    supportedFormats: { type: 'array', items: { type: 'string' } },
                    selectedFormat: { type: 'string' },
                    formatSchema: { type: 'object' },
                    formats: { type: 'object' },
                  },
                  required: ['ok', 'supportedFormats'],
                },
                TOOL_ERROR_SCHEMA,
              ],
            },
          },
        ],
      },
    });
  }

  if (method === 'resources/list') {
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        resources: getResources(),
      },
    });
  }

  if (method === 'resources/read') {
    const uri = params?.uri;
    const payload = getResourceByUri(uri);
    if (!payload) {
      return writeMessage({
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown resource: ${uri}` },
      });
    }
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(payload),
          },
        ],
      },
    });
  }

  if (method === 'tools/call') {
    const name = params?.name;
    if (name === 'get_output_format_options_schema') {
      const args = params?.arguments || {};
      const outputFormat = args.outputFormat;
      if (outputFormat && !SUPPORTED_FORMATS.includes(outputFormat)) {
        return writeToolResult(
          id,
          createToolError('invalid_output_format', `outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`, {
            outputFormat,
            supportedFormats: SUPPORTED_FORMATS,
          }),
          true
        );
      }
      const payload = outputFormat
        ? createToolSuccess({
            supportedFormats: SUPPORTED_FORMATS,
            selectedFormat: outputFormat,
            formatSchema: FORMAT_OPTIONS_CATALOG[outputFormat],
          })
        : createToolSuccess({
            supportedFormats: SUPPORTED_FORMATS,
            formats: FORMAT_OPTIONS_CATALOG,
          });

      return writeToolResult(id, payload, false);
    }

    if (name !== 'generate_data_from_spec') {
      return writeMessage({
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown tool: ${name}` },
      });
    }

    const args = params?.arguments || {};
    if (typeof args.textSpec === 'string' && args.textSpec.length > MAX_TEXT_SPEC_LENGTH) {
      return writeToolResult(
        id,
        createToolError('text_spec_too_large', `textSpec exceeds max length of ${MAX_TEXT_SPEC_LENGTH}`, {
          maxLength: MAX_TEXT_SPEC_LENGTH,
          actualLength: args.textSpec.length,
        }),
        true
      );
    }
    const normalizedArgs = {
      ...args,
      textSpec: maybeConvertKeyValueSpec(args.textSpec),
    };
    const validation = validateSafeFakerRules(normalizedArgs.textSpec);
    if (!validation.ok) {
      return writeToolResult(
        id,
        createToolError('unsafe_faker_rule', validation.error, {
          mode: 'safe',
        }),
        true
      );
    }
    const result = generateFromTextSpec(normalizedArgs);
    if (!result.ok) {
      return writeToolResult(
        id,
        createToolError('generation_failed', 'Failed to generate data from specification.', {
          errors: result.errors,
          diagnostics: result.diagnostics,
        }),
        true
      );
    }
    return writeToolResult(id, result, false);
  }

  if (method === 'notifications/initialized') {
    return;
  }

  return writeMessage({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  });
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  if (!line.trim()) {
    return;
  }

  try {
    const request = JSON.parse(line);
    handleRequest(request);
  } catch (error) {
    writeMessage({
      jsonrpc: '2.0',
      error: { code: -32700, message: `Parse error: ${error.message}` },
    });
  }
});
