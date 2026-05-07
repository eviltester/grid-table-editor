import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { generateFromTextSpec } from '@anywaydata/core';

function firstJsonLine(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith('{'));
}

function requestServer(payload) {
  const scriptPath = path.resolve('src/index.js');
  const request = `${JSON.stringify(payload)}\n`;
  const output = execFileSync(process.execPath, [scriptPath], {
    input: request,
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });
  const line = firstJsonLine(output);
  expect(line).toBeTruthy();
  return JSON.parse(line);
}

test('MCP server lists tools', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  expect(response?.result?.tools?.[0]?.name).toBe('generate_data_from_spec');
  expect(response?.result?.tools?.[1]?.name).toBe('get_output_format_options_schema');
  const generateSchema = response?.result?.tools?.[0]?.inputSchema?.properties?.options;
  expect(generateSchema?.type).toBe('object');
  expect(Array.isArray(generateSchema?.oneOf)).toBeTruthy();
  expect(response?.result?.tools?.[0]?.outputSchema).toBeTruthy();
  expect(response?.result?.tools?.[1]?.outputSchema).toBeTruthy();
});

test('MCP server handles generate_data_from_spec tool call', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json' },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  expect(response?.result?.isError).toBe(false);
  expect(response?.result?.structuredContent?.ok).toBe(true);
});

test('MCP server handles test framework output format', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 21,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'junit5' },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  expect(payload.format).toBe('junit5');
  expect(payload.rendered).toMatch(/@ParameterizedTest/);
});

test('MCP schema notes reflect setup behavior for unit test formats', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 22,
    method: 'tools/call',
    params: {
      name: 'get_output_format_options_schema',
      arguments: { outputFormat: 'jest' },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  const props = payload?.formatSchema?.optionSchema?.properties || {};
  expect(props?.includeSetup?.description || '').toMatch(/beforeEach/i);
});

test('MCP generation uses includeSetup for representative frameworks', () => {
  const jestResponse = requestServer({
    jsonrpc: '2.0',
    id: 23,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: {
        textSpec: 'Name\nBob',
        rowCount: 1,
        outputFormat: 'jest',
        options: { outputFormat: 'jest', options: { includeSetup: true } },
      },
    },
  });
  const jestPayload = JSON.parse(jestResponse?.result?.content?.[0]?.text || '{}');
  expect(jestPayload.rendered).toMatch(/beforeEach/);
  expect(jestPayload.rendered).toMatch(/expect\(/);

  const phpunitResponse = requestServer({
    jsonrpc: '2.0',
    id: 24,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: {
        textSpec: 'Name\nBob',
        rowCount: 1,
        outputFormat: 'phpunit',
        options: { outputFormat: 'phpunit', options: { includeSetup: true } },
      },
    },
  });
  const phpunitPayload = JSON.parse(phpunitResponse?.result?.content?.[0]?.text || '{}');
  expect(phpunitPayload.rendered).toMatch(/setUp/);
  expect(phpunitPayload.rendered).toMatch(/assertSame/);
});

test('MCP server accepts key/value style textSpec for faker rules', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: {
        textSpec: 'first_name: faker.person.firstName()\nlast_name: person.lastName',
        rowCount: 2,
        outputFormat: 'json',
      },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  expect(payload.headers).toEqual(['first_name', 'last_name']);
  expect(payload.rows.length).toBe(2);
});

test('MCP server rejects unsafe faker expression arguments', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: {
        textSpec: 'Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})',
        rowCount: 1,
        outputFormat: 'json',
      },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(response?.result?.isError).toBe(true);
  expect(payload.ok).toBe(false);
  expect(payload.error.code).toBe('unsafe_faker_rule');
  expect(payload.error.message).toMatch(/Unsafe faker rule syntax detected/);
});

test('MCP server returns discoverable options schema for xml output format', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'get_output_format_options_schema',
      arguments: {
        outputFormat: 'xml',
      },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  expect(payload.selectedFormat).toBe('xml');
  expect(payload.formatSchema.optionDefaults.rootElementName).toBe('root');
  expect(payload.formatSchema.optionDefaults.itemElementName).toBe('item');
  expect(payload.formatSchema.optionSchema.properties.rootElementName.type).toBe('string');
});

test('MCP server initialize advertises tools and resources capability', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 6, method: 'initialize' });
  expect(response?.result?.capabilities?.tools).toBeTruthy();
  expect(response?.result?.capabilities?.resources).toBeTruthy();
});

test('MCP server lists discoverable resources', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 7, method: 'resources/list' });
  expect(response?.result?.resources?.length).toBe(2);
  expect(response?.result?.resources?.[0]?.mimeType).toBe('application/json');
});

test('MCP server reads output format options resource', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 8,
    method: 'resources/read',
    params: { uri: 'anywaydata://schemas/output-format-options' },
  });
  const payload = JSON.parse(response?.result?.contents?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  expect(payload.formats.xml).toBeTruthy();
});

test('MCP server reads install guide resource', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 9,
    method: 'resources/read',
    params: { uri: 'anywaydata://install/config-examples' },
  });
  const payload = JSON.parse(response?.result?.contents?.[0]?.text || '{}');
  expect(payload.ok).toBe(true);
  expect(payload.transport).toBe('stdio');
  expect(payload.examples.codex_npx).toBeTruthy();
});

test('MCP server rejects unknown resource URI', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 10,
    method: 'resources/read',
    params: { uri: 'anywaydata://missing' },
  });
  expect(response?.error?.code).toBe(-32602);
});

test('MCP server returns invalid_output_format for schema tool', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 11,
    method: 'tools/call',
    params: {
      name: 'get_output_format_options_schema',
      arguments: { outputFormat: 'nope' },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(response?.result?.isError).toBe(true);
  expect(payload.error.code).toBe('invalid_output_format');
});

test('MCP server allows large rowCount values', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 12,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: {
        textSpec: 'Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})',
        rowCount: 100001,
        outputFormat: 'json',
      },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(response?.result?.isError).toBe(true);
  expect(payload.error.code).toBe('unsafe_faker_rule');
});

test('MCP server rejects excessive textSpec length', () => {
  const hugeSpec = 'a'.repeat(200001);
  const response = requestServer({
    jsonrpc: '2.0',
    id: 13,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: { textSpec: hugeSpec, rowCount: 1, outputFormat: 'json' },
    },
  });
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  expect(payload.error.code).toBe('text_spec_too_large');
});

test('MCP server returns method not found for unknown methods', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 14, method: 'nope/method' });
  expect(response?.error?.code).toBe(-32601);
});

test('MCP parity: rendered output matches core for all unit-test frameworks', () => {
  const frameworks = [
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
  ];

  for (const outputFormat of frameworks) {
    const options = {
      outputFormat,
      options: {
        includeSetup: true,
        prettyPrint: true,
        dataSourceStrategy: 'provider',
      },
    };
    const coreResult = generateFromTextSpec({
      textSpec: 'Name\nBob\nAge\n21',
      rowCount: 2,
      outputFormat,
      options,
      seed: 123,
    });
    expect(coreResult.ok).toBe(true);

    const response = requestServer({
      jsonrpc: '2.0',
      id: `parity-${outputFormat}`,
      method: 'tools/call',
      params: {
        name: 'generate_data_from_spec',
        arguments: {
          textSpec: 'Name\nBob\nAge\n21',
          rowCount: 2,
          outputFormat,
          options,
          seed: 123,
        },
      },
    });
    const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
    expect(payload.ok).toBe(true);
    expect(payload.rendered).toBe(coreResult.rendered);
  }
});
