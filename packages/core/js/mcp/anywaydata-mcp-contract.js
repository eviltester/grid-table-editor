import {
  amendFromTextSpecAndData,
  createExporterForDefaults,
  getTipsForFormat,
  generateFromTextSpec,
  SUPPORTED_FORMATS,
  validateSafeFakerRules,
} from '../../src/index.js';

const ANYWAYDATA_MCP_SERVER_INFO = {
  name: 'anywaydata-mcp',
  version: '0.1.0',
};

const ANYWAYDATA_MCP_MAX_TEXT_SPEC_LENGTH = 200000;

const ANYWAYDATA_MCP_RESOURCE_URIS = {
  optionCatalog: 'anywaydata://schemas/output-format-options',
  installGuide: 'anywaydata://install/config-examples',
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
  const optionTips = getTipsForFormat(format);
  const properties = {};
  for (const [optionName, defaultValue] of Object.entries(defaultOptions || {})) {
    properties[optionName] = {
      type: inferJsonSchemaType(defaultValue),
      default: defaultValue,
      description: optionTips?.[optionName] || undefined,
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
  const mergedProperties = {};

  for (const format of SUPPORTED_FORMATS) {
    const optionSchema = FORMAT_OPTIONS_CATALOG[format].optionSchema;
    for (const [optionName, propertySchema] of Object.entries(optionSchema.properties || {})) {
      if (!mergedProperties[optionName]) {
        mergedProperties[optionName] = propertySchema;
      }
    }
  }

  return {
    type: 'object',
    description:
      'Flat formatter options object for the selected top-level outputFormat. For full per-format schema/defaults, call get_output_format_options_schema.',
    additionalProperties: true,
    properties: mergedProperties,
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

function normalizeToolArguments(args = {}) {
  return {
    ...args,
    textSpec: maybeConvertKeyValueSpec(args.textSpec),
  };
}

function validateTextSpecLength(args) {
  if (typeof args.textSpec === 'string' && args.textSpec.length > ANYWAYDATA_MCP_MAX_TEXT_SPEC_LENGTH) {
    return createToolError(
      'text_spec_too_large',
      `textSpec exceeds max length of ${ANYWAYDATA_MCP_MAX_TEXT_SPEC_LENGTH}`,
      {
        maxLength: ANYWAYDATA_MCP_MAX_TEXT_SPEC_LENGTH,
        actualLength: args.textSpec.length,
      }
    );
  }
  return null;
}

function validateSafeSpec(args) {
  const validation = validateSafeFakerRules(args.textSpec);
  if (!validation.ok) {
    return createToolError('unsafe_faker_rule', validation.error, {
      mode: 'safe',
    });
  }
  return null;
}

function createGenerateDataTool() {
  return {
    name: 'generate_data_from_spec',
    description:
      'Generate data rows and formatted output from a multiline text specification. Supported textSpec forms: (1) alternating lines: ColumnName then RuleDefinition, (2) key/value lines: ColumnName: RuleDefinition (auto-converted).',
    inputSchema: {
      type: 'object',
      properties: {
        textSpec: {
          type: 'string',
          description:
            'Examples:\nName\nperson.firstName\nSurname\nperson.lastName\nor\nname: person.firstName()\nlast_name: person.lastName',
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
  };
}

function createAmendDataTool() {
  return {
    name: 'amend_data_from_spec',
    description:
      'Import existing raw input data using inputFormat and amend rows using a multiline text specification. Returns the full amended dataset.',
    inputSchema: {
      type: 'object',
      properties: {
        textSpec: { type: 'string' },
        inputData: { type: 'string' },
        inputFormat: {
          type: 'string',
          enum: ['csv', 'dsv', 'markdown', 'json', 'javascript', 'html', 'gherkin'],
        },
        rowCount: { type: 'integer', minimum: 0 },
        outputFormat: { type: 'string', enum: SUPPORTED_FORMATS },
        options: GENERATE_OPTIONS_SCHEMA,
        seed: { type: 'number' },
        trimInput: {
          type: 'boolean',
          description: 'Trim whitespace from every imported input field value before amend processing.',
        },
        trimInputFieldsCsv: {
          type: 'string',
          description: 'Comma-separated imported field names whose values should be trimmed before amend processing.',
        },
        stream: {
          type: 'boolean',
          description: 'Accepted for compatibility and ignored for amend operation (always buffered).',
        },
      },
      required: ['textSpec', 'inputData', 'inputFormat', 'outputFormat'],
    },
    outputSchema: {
      oneOf: [GENERATE_RESULT_SCHEMA, TOOL_ERROR_SCHEMA],
    },
  };
}

function createFormatSchemaTool() {
  return {
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
  };
}

const ANYWAYDATA_MCP_TOOLS = [createGenerateDataTool(), createAmendDataTool(), createFormatSchemaTool()];

function executeFormatSchemaTool(args = {}) {
  const outputFormat = args.outputFormat;
  if (outputFormat && !SUPPORTED_FORMATS.includes(outputFormat)) {
    return createToolError('invalid_output_format', `outputFormat must be one of: ${SUPPORTED_FORMATS.join(', ')}`, {
      outputFormat,
      supportedFormats: SUPPORTED_FORMATS,
    });
  }

  return outputFormat
    ? createToolSuccess({
        supportedFormats: SUPPORTED_FORMATS,
        selectedFormat: outputFormat,
        formatSchema: FORMAT_OPTIONS_CATALOG[outputFormat],
      })
    : createToolSuccess({
        supportedFormats: SUPPORTED_FORMATS,
        formats: FORMAT_OPTIONS_CATALOG,
      });
}

function executeGenerateOrAmendTool(toolName, args = {}) {
  const normalizedArgs = normalizeToolArguments(args);
  const textSpecLengthError = validateTextSpecLength(normalizedArgs);
  if (textSpecLengthError) {
    return textSpecLengthError;
  }

  const safeSpecError = validateSafeSpec(normalizedArgs);
  if (safeSpecError) {
    return safeSpecError;
  }

  const result =
    toolName === 'amend_data_from_spec'
      ? amendFromTextSpecAndData(normalizedArgs)
      : generateFromTextSpec(normalizedArgs);

  if (result.ok) {
    return result;
  }

  const isAmendTool = toolName === 'amend_data_from_spec';
  return createToolError(
    isAmendTool ? 'amend_failed' : 'generation_failed',
    isAmendTool ? 'Failed to amend data from specification.' : 'Failed to generate data from specification.',
    {
      errors: result.errors,
      diagnostics: result.diagnostics,
    }
  );
}

function createInstallGuideResource() {
  return {
    ok: true,
    transport: 'stdio',
    examples: {
      codex_local_repo: {
        command: 'node',
        args: ['apps/mcp/src/index.js'],
        cwd: '<path-to-repo>',
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

function createOptionCatalogResource() {
  return {
    ok: true,
    supportedFormats: SUPPORTED_FORMATS,
    formats: FORMAT_OPTIONS_CATALOG,
  };
}

function listAnyWayDataMcpTools() {
  return ANYWAYDATA_MCP_TOOLS.map((tool) => ({ ...tool }));
}

function getAnyWayDataMcpTool(name) {
  return ANYWAYDATA_MCP_TOOLS.find((tool) => tool.name === name) || null;
}

function executeAnyWayDataMcpTool(name, args = {}) {
  if (name === 'get_output_format_options_schema') {
    return executeFormatSchemaTool(args);
  }

  if (name === 'generate_data_from_spec' || name === 'amend_data_from_spec') {
    return executeGenerateOrAmendTool(name, args);
  }

  return null;
}

function listAnyWayDataMcpResources() {
  return [
    {
      uri: ANYWAYDATA_MCP_RESOURCE_URIS.optionCatalog,
      name: 'Output Format Option Schemas',
      description: 'Discoverable formatter option defaults and schema per output format.',
      mimeType: 'application/json',
    },
    {
      uri: ANYWAYDATA_MCP_RESOURCE_URIS.installGuide,
      name: 'Install Config Examples',
      description: 'MCP install/config examples for common hosts and environments.',
      mimeType: 'application/json',
    },
  ];
}

function readAnyWayDataMcpResource(uri) {
  if (uri === ANYWAYDATA_MCP_RESOURCE_URIS.optionCatalog) {
    return createOptionCatalogResource();
  }

  if (uri === ANYWAYDATA_MCP_RESOURCE_URIS.installGuide) {
    return createInstallGuideResource();
  }

  return null;
}

export {
  ANYWAYDATA_MCP_MAX_TEXT_SPEC_LENGTH,
  ANYWAYDATA_MCP_RESOURCE_URIS,
  ANYWAYDATA_MCP_SERVER_INFO,
  executeAnyWayDataMcpTool,
  getAnyWayDataMcpTool,
  listAnyWayDataMcpResources,
  listAnyWayDataMcpTools,
  readAnyWayDataMcpResource,
};
