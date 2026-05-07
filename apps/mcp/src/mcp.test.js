import test from 'node:test';
import assert from 'node:assert/strict';
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
  assert.ok(line);
  return JSON.parse(line);
}

test('MCP server lists tools', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  assert.equal(response?.result?.tools?.[0]?.name, 'generate_data_from_spec');
  assert.equal(response?.result?.tools?.[1]?.name, 'get_output_format_options_schema');
  const generateSchema = response?.result?.tools?.[0]?.inputSchema?.properties?.options;
  assert.equal(generateSchema?.type, 'object');
  assert.ok(Array.isArray(generateSchema?.oneOf));
  assert.ok(response?.result?.tools?.[0]?.outputSchema);
  assert.ok(response?.result?.tools?.[1]?.outputSchema);
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
  assert.equal(payload.ok, true);
  assert.equal(response?.result?.isError, false);
  assert.equal(response?.result?.structuredContent?.ok, true);
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
  assert.equal(payload.ok, true);
  assert.equal(payload.format, 'junit5');
  assert.match(payload.rendered, /@ParameterizedTest/);
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
  assert.equal(payload.ok, true);
  const props = payload?.formatSchema?.optionSchema?.properties || {};
  assert.match(props?.includeSetup?.description || '', /beforeEach/i);
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
  assert.match(jestPayload.rendered, /beforeEach/);
  assert.match(jestPayload.rendered, /expect\(/);

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
  assert.match(phpunitPayload.rendered, /setUp/);
  assert.match(phpunitPayload.rendered, /assertSame/);
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
  assert.equal(payload.ok, true);
  assert.deepEqual(payload.headers, ['first_name', 'last_name']);
  assert.equal(payload.rows.length, 2);
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
  assert.equal(response?.result?.isError, true);
  assert.equal(payload.ok, false);
  assert.equal(payload.error.code, 'unsafe_faker_rule');
  assert.match(payload.error.message, /Unsafe faker rule syntax detected/);
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
  assert.equal(payload.ok, true);
  assert.equal(payload.selectedFormat, 'xml');
  assert.equal(payload.formatSchema.optionDefaults.rootElementName, 'root');
  assert.equal(payload.formatSchema.optionDefaults.itemElementName, 'item');
  assert.equal(payload.formatSchema.optionSchema.properties.rootElementName.type, 'string');
});

test('MCP server initialize advertises tools and resources capability', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 6, method: 'initialize' });
  assert.ok(response?.result?.capabilities?.tools);
  assert.ok(response?.result?.capabilities?.resources);
});

test('MCP server lists discoverable resources', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 7, method: 'resources/list' });
  assert.equal(response?.result?.resources?.length, 2);
  assert.equal(response?.result?.resources?.[0]?.mimeType, 'application/json');
});

test('MCP server reads output format options resource', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 8,
    method: 'resources/read',
    params: { uri: 'anywaydata://schemas/output-format-options' },
  });
  const payload = JSON.parse(response?.result?.contents?.[0]?.text || '{}');
  assert.equal(payload.ok, true);
  assert.ok(payload.formats.xml);
});

test('MCP server reads install guide resource', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 9,
    method: 'resources/read',
    params: { uri: 'anywaydata://install/config-examples' },
  });
  const payload = JSON.parse(response?.result?.contents?.[0]?.text || '{}');
  assert.equal(payload.ok, true);
  assert.equal(payload.transport, 'stdio');
  assert.ok(payload.examples.codex_npx);
});

test('MCP server rejects unknown resource URI', () => {
  const response = requestServer({
    jsonrpc: '2.0',
    id: 10,
    method: 'resources/read',
    params: { uri: 'anywaydata://missing' },
  });
  assert.equal(response?.error?.code, -32602);
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
  assert.equal(response?.result?.isError, true);
  assert.equal(payload.error.code, 'invalid_output_format');
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
  assert.equal(response?.result?.isError, true);
  assert.equal(payload.error.code, 'unsafe_faker_rule');
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
  assert.equal(payload.error.code, 'text_spec_too_large');
});

test('MCP server returns method not found for unknown methods', () => {
  const response = requestServer({ jsonrpc: '2.0', id: 14, method: 'nope/method' });
  assert.equal(response?.error?.code, -32601);
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
    assert.equal(coreResult.ok, true, `core generation failed for ${outputFormat}`);

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
    assert.equal(payload.ok, true, `mcp generation failed for ${outputFormat}`);
    assert.equal(payload.rendered, coreResult.rendered, `render mismatch for ${outputFormat}`);
  }
});
