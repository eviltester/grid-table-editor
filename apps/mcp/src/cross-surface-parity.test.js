import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { OPTION_KEYS_BY_FORMAT, getTipsForFormat } from '@anywaydata/core';
import { createApiService } from '../../api/src/api-service.js';
import { normalizeAndValidateFormat, sanitizeCliOptionsForFormat } from '../../cli/src/format-options.js';

function firstJsonLine(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith('{'));
}

function requestMcpServer(payload) {
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

describe('cross-surface option parity (API vs MCP vs CLI helper)', () => {
  const representativeFormats = ['csv', 'xml', 'junit5'];

  test.each(representativeFormats)('format %s stays aligned across surfaces', (format) => {
    const tips = getTipsForFormat(format);
    const expectedKeys = OPTION_KEYS_BY_FORMAT[format];
    expect(Array.isArray(expectedKeys)).toBe(true);

    const apiService = createApiService();
    const apiResult = apiService.handleGetOptionsRequest({ format });
    expect(apiResult.statusCode).toBe(200);
    expect(Object.keys(apiResult.body.tips)).toEqual(expectedKeys);
    expect(apiResult.body.tips).toEqual(tips);

    const mcpResponse = requestMcpServer({
      jsonrpc: '2.0',
      id: `cross-${format}`,
      method: 'tools/call',
      params: {
        name: 'get_output_format_options_schema',
        arguments: { outputFormat: format },
      },
    });
    const mcpPayload = JSON.parse(mcpResponse?.result?.content?.[0]?.text || '{}');
    expect(mcpPayload.ok).toBe(true);
    const props = mcpPayload?.formatSchema?.optionSchema?.properties || {};
    for (const [key, tip] of Object.entries(tips)) {
      if (props[key]) {
        expect(props[key].description).toBe(tip);
      }
    }

    const normalized = normalizeAndValidateFormat(format.toUpperCase());
    expect(normalized).toEqual({ format, isSupported: true });

    const firstKey = expectedKeys[0];
    const sanitized = sanitizeCliOptionsForFormat(format, { [firstKey]: 'keep-me', __invalid__: 'drop-me' });
    expect(sanitized).toEqual({ [firstKey]: 'keep-me' });
  });
});
