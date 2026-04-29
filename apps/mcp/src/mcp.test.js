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
