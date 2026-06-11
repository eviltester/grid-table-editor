#!/usr/bin/env node

import readline from 'node:readline';
import {
  ANYWAYDATA_MCP_SERVER_INFO,
  executeAnyWayDataMcpTool,
  getAnyWayDataMcpTool,
  listAnyWayDataMcpResources,
  listAnyWayDataMcpTools,
  readAnyWayDataMcpResource,
} from '@anywaydata/core/mcp/anywaydata-mcp-contract.js';

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
        serverInfo: ANYWAYDATA_MCP_SERVER_INFO,
        capabilities: { tools: {}, resources: {} },
      },
    });
  }

  if (method === 'tools/list') {
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        tools: listAnyWayDataMcpTools(),
      },
    });
  }

  if (method === 'resources/list') {
    return writeMessage({
      jsonrpc: '2.0',
      id,
      result: {
        resources: listAnyWayDataMcpResources(),
      },
    });
  }

  if (method === 'resources/read') {
    const uri = params?.uri;
    const payload = readAnyWayDataMcpResource(uri);
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
    if (!getAnyWayDataMcpTool(name)) {
      return writeMessage({
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown tool: ${name}` },
      });
    }

    const payload = executeAnyWayDataMcpTool(name, params?.arguments || {});
    return writeToolResult(id, payload, payload?.ok === false);
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
