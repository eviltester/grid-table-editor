import readline from 'node:readline';
import { generateFromTextSpec, SUPPORTED_FORMATS } from '@anywaydata/core';

const serverInfo = {
  name: 'anywaydata-mcp',
  version: '0.1.0',
};

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
            description: 'Generate data rows and formatted output from a multiline text specification.',
            inputSchema: {
              type: 'object',
              properties: {
                textSpec: { type: 'string' },
                rowCount: { type: 'integer', minimum: 0 },
                outputFormat: { type: 'string', enum: SUPPORTED_FORMATS },
                options: { type: 'object' },
                seed: { type: 'number' },
              },
              required: ['textSpec', 'rowCount', 'outputFormat'],
            },
          },
        ],
      },
    });
  }

  if (method === 'tools/call') {
    const name = params?.name;
    if (name !== 'generate_data_from_spec') {
      return writeMessage({
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown tool: ${name}` },
      });
    }

    const args = params?.arguments || {};
    const result = generateFromTextSpec(args);
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
