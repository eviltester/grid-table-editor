import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

function firstJsonLine(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith('{'));
}

test('MCP server lists tools', () => {
  const scriptPath = path.resolve('src/index.js');
  const listRequest = `${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })}\n`;
  const output = execFileSync(process.execPath, [scriptPath], {
    input: listRequest,
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });

  const line = firstJsonLine(output);
  assert.ok(line);
  const response = JSON.parse(line);
  assert.equal(response?.result?.tools?.[0]?.name, 'generate_data_from_spec');
  assert.equal(response?.result?.tools?.[1]?.name, 'get_output_format_options_schema');
  const generateSchema = response?.result?.tools?.[0]?.inputSchema?.properties?.options;
  assert.equal(generateSchema?.type, 'object');
  assert.ok(Array.isArray(generateSchema?.oneOf));
});

test('MCP server handles generate_data_from_spec tool call', () => {
  const scriptPath = path.resolve('src/index.js');
  const callRequest = `${JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'generate_data_from_spec',
      arguments: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'json' },
    },
  })}\n`;

  const output = execFileSync(process.execPath, [scriptPath], {
    input: callRequest,
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });

  const line = firstJsonLine(output);
  assert.ok(line);
  const response = JSON.parse(line);
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  assert.equal(payload.ok, true);
});

test('MCP server accepts key/value style textSpec for faker rules', () => {
  const scriptPath = path.resolve('src/index.js');
  const callRequest = `${JSON.stringify({
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
  })}\n`;

  const output = execFileSync(process.execPath, [scriptPath], {
    input: callRequest,
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });

  const line = firstJsonLine(output);
  assert.ok(line);
  const response = JSON.parse(line);
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  assert.equal(payload.ok, true);
  assert.deepEqual(payload.headers, ['first_name', 'last_name']);
  assert.equal(payload.rows.length, 2);
});

test('MCP server rejects unsafe faker expression arguments', () => {
  const scriptPath = path.resolve('src/index.js');
  const callRequest = `${JSON.stringify({
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
  })}\n`;

  const output = execFileSync(process.execPath, [scriptPath], {
    input: callRequest,
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });

  const line = firstJsonLine(output);
  assert.ok(line);
  const response = JSON.parse(line);
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  assert.equal(response?.result?.isError, true);
  assert.equal(payload.ok, false);
  assert.match(payload.errors[0], /Unsafe faker rule syntax detected/);
});

test('MCP server returns discoverable options schema for xml output format', () => {
  const scriptPath = path.resolve('src/index.js');
  const callRequest = `${JSON.stringify({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'get_output_format_options_schema',
      arguments: {
        outputFormat: 'xml',
      },
    },
  })}\n`;

  const output = execFileSync(process.execPath, [scriptPath], {
    input: callRequest,
    encoding: 'utf8',
    cwd: path.resolve('.'),
  });

  const line = firstJsonLine(output);
  assert.ok(line);
  const response = JSON.parse(line);
  const payload = JSON.parse(response?.result?.content?.[0]?.text || '{}');
  assert.equal(payload.ok, true);
  assert.equal(payload.selectedFormat, 'xml');
  assert.equal(payload.formatSchema.optionDefaults.rootElementName, 'root');
  assert.equal(payload.formatSchema.optionDefaults.itemElementName, 'item');
  assert.equal(payload.formatSchema.optionSchema.properties.rootElementName.type, 'string');
});
