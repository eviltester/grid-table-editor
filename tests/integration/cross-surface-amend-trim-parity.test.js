import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { amendFromTextSpecAndData } from '@anywaydata/core';
import { createApiService } from '../../apps/api/src/api-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function jsonRpcMessages(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{'))
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function requestMcpServer(payload) {
  const repoRoot = path.resolve(__dirname, '../..');
  const scriptPath = path.join(repoRoot, 'apps', 'mcp', 'src', 'index.js');
  const output = execFileSync(process.execPath, [scriptPath], {
    input: `${JSON.stringify(payload)}\n`,
    encoding: 'utf8',
    cwd: repoRoot,
    timeout: 15000,
  });
  const messages = jsonRpcMessages(output);
  return messages.find((message) => message?.id === payload.id);
}

async function writeTempFile(prefix, content) {
  const filePath = path.join(
    os.tmpdir(),
    `anywaydata-${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}.txt`
  );
  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

describe('cross-surface amend trim parity', () => {
  test('core api and mcp stay aligned for import trim settings', () => {
    const payload = {
      textSpec: 'Status\nActive',
      inputData: '"Name","Role"\n"  Alice  ","  Engineer  "',
      inputFormat: 'csv',
      rowCount: 0,
      outputFormat: 'json',
      trimInputFieldsCsv: 'Name',
    };

    const coreResult = amendFromTextSpecAndData(payload);
    expect(coreResult.ok).toBe(true);

    const apiService = createApiService();
    const apiResult = apiService.handleAmendRequest({ body: payload });
    expect(apiResult.statusCode).toBe(200);
    expect(apiResult.body.rows).toEqual(coreResult.rows);

    const mcpResponse = requestMcpServer({
      jsonrpc: '2.0',
      id: 'trim-parity',
      method: 'tools/call',
      params: {
        name: 'amend_data_from_spec',
        arguments: payload,
      },
    });
    const mcpPayload = JSON.parse(mcpResponse?.result?.content?.[0]?.text || '{}');
    expect(mcpPayload.ok).toBe(true);
    expect(mcpPayload.rows).toEqual(coreResult.rows);
  });

  test('cli amend stays aligned with core for import trim settings', async () => {
    const schemaPath = await writeTempFile('trim-schema', 'Status\nActive');
    const dataPath = await writeTempFile('trim-data', '"Name","Role"\n"  Alice  ","  Engineer  "');
    const repoRoot = path.resolve(__dirname, '../..');
    const cliEntry = path.join(repoRoot, 'apps', 'cli', 'src', 'node-entry.js');

    try {
      const output = execFileSync(
        process.execPath,
        [
          cliEntry,
          'amend',
          '--schema-file',
          schemaPath,
          '--data-file',
          dataPath,
          '--input-format',
          'csv',
          '--trim-input-fields',
          'Name',
          '-n',
          '0',
          '-f',
          'json',
          '--show-progress',
          'false',
        ],
        {
          cwd: repoRoot,
          encoding: 'utf8',
          timeout: 15000,
        }
      );

      const coreResult = amendFromTextSpecAndData({
        textSpec: 'Status\nActive',
        inputData: '"Name","Role"\n"  Alice  ","  Engineer  "',
        inputFormat: 'csv',
        rowCount: 0,
        outputFormat: 'json',
        trimInputFieldsCsv: 'Name',
      });

      expect(JSON.parse(output.trim())).toEqual(
        coreResult.rows.map((row) => ({
          Name: row[0],
          Role: row[1],
          Status: row[2],
        }))
      );
    } finally {
      await fs.unlink(schemaPath).catch(() => {});
      await fs.unlink(dataPath).catch(() => {});
    }
  }, 20000);
});
