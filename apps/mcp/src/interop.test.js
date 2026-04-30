import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawn } from 'node:child_process';
import readline from 'node:readline';

function startServer({ cwd, scriptArg }) {
  const child = spawn(process.execPath, [scriptArg], {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const rl = readline.createInterface({ input: child.stdout });
  const stderrLines = [];
  const stderrRl = readline.createInterface({ input: child.stderr });
  stderrRl.on('line', (line) => stderrLines.push(line));

  const pending = new Map();
  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) {
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return;
    }

    if (parsed.id !== undefined && pending.has(parsed.id)) {
      const resolver = pending.get(parsed.id);
      pending.delete(parsed.id);
      resolver(parsed);
    }
  });

  let requestId = 1000;
  function rpc(method, params) {
    return new Promise((resolve, reject) => {
      const id = requestId++;
      pending.set(id, resolve);
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`, (error) => {
        if (error) {
          pending.delete(id);
          reject(error);
        }
      });
    });
  }

  async function stop() {
    child.kill();
    await new Promise((resolve) => child.once('exit', resolve));
  }

  return { rpc, stop, stderrLines };
}

const launchMatrix = [
  {
    name: 'repo-cwd relative script path',
    cwd: path.resolve('.'),
    scriptArg: 'src/index.js',
  },
  {
    name: 'repo-cwd absolute script path',
    cwd: path.resolve('.'),
    scriptArg: path.resolve('src/index.js'),
  },
  {
    name: 'parent-cwd with workspace-relative script path',
    cwd: path.resolve('..', '..'),
    scriptArg: 'apps/mcp/src/index.js',
  },
];

for (const launchCase of launchMatrix) {
  test(`MCP interop matrix: ${launchCase.name}`, async () => {
    const server = startServer(launchCase);
    try {
      const init = await server.rpc('initialize', {});
      assert.equal(init?.result?.protocolVersion, '2024-11-05');

      const tools = await server.rpc('tools/list');
      const toolNames = (tools?.result?.tools || []).map((tool) => tool.name);
      assert.ok(toolNames.includes('generate_data_from_spec'));
      assert.ok(toolNames.includes('get_output_format_options_schema'));

      const resources = await server.rpc('resources/list');
      const uris = (resources?.result?.resources || []).map((resource) => resource.uri);
      assert.ok(uris.includes('anywaydata://schemas/output-format-options'));
      assert.ok(uris.includes('anywaydata://install/config-examples'));

      const schemaTool = await server.rpc('tools/call', {
        name: 'get_output_format_options_schema',
        arguments: { outputFormat: 'xml' },
      });
      const schemaPayload = JSON.parse(schemaTool?.result?.content?.[0]?.text || '{}');
      assert.equal(schemaPayload.ok, true);
      assert.equal(schemaPayload.selectedFormat, 'xml');
    } finally {
      await server.stop();
    }
  });
}
