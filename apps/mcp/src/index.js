import readline from 'node:readline';
import { generateFromTextSpec, SUPPORTED_FORMATS, validateSafeFakerRules } from '@anywaydata/core';

const serverInfo = {
  name: 'anywaydata-mcp',
  version: '0.1.0',
};

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
