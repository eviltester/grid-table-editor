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

const FORMAT_OPTION_NOTES = {
  xml: {
    rootElementName: 'XML root tag name.',
    itemElementName: 'Per-row XML tag name.',
    attributeColumnsCsv: 'Comma-separated columns to render as XML attributes on each item tag.',
    includeXmlHeader: 'Include XML declaration header.',
    xmlns: 'Namespace URI, rendered as xmlns attribute on the root tag.',
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
        capabilities: { tools: {} },
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
              },
              required: ['textSpec', 'rowCount', 'outputFormat'],
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
        return writeMessage({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  ok: false,
                  errors: [`outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`],
                }),
              },
            ],
            isError: true,
          },
        });
      }
      const payload = outputFormat
        ? {
            ok: true,
            supportedFormats: SUPPORTED_FORMATS,
            selectedFormat: outputFormat,
            formatSchema: FORMAT_OPTIONS_CATALOG[outputFormat],
          }
        : {
            ok: true,
            supportedFormats: SUPPORTED_FORMATS,
            formats: FORMAT_OPTIONS_CATALOG,
          };

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
          isError: false,
        },
      });
    }

    if (name !== 'generate_data_from_spec') {
      return writeMessage({
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown tool: ${name}` },
      });
    }

    const args = params?.arguments || {};
    const normalizedArgs = {
      ...args,
      textSpec: maybeConvertKeyValueSpec(args.textSpec),
    };
    const validation = validateSafeFakerRules(normalizedArgs.textSpec);
    if (!validation.ok) {
      return writeMessage({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ ok: false, errors: [validation.error] }),
            },
          ],
          isError: true,
        },
      });
    }
    const result = generateFromTextSpec(normalizedArgs);
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result),
          },
        ],
        isError: !result.ok,
      },
    });
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
