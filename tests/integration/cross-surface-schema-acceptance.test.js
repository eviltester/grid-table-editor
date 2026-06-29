import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const CROSS_SURFACE_PROCESS_TIMEOUT_MS = 60000;

const require = createRequire(import.meta.url);
const { repoRoot, SCHEMA_ACCEPTANCE_SCENARIOS } = require('./support/schema-acceptance-fixtures.cjs');
const {
  normalizeCliSuccess,
  normalizeCliFailure,
  normalizeMcpPayload,
} = require('./support/schema-acceptance-assertions.cjs');

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
  const scriptPath = path.join(repoRoot, 'apps', 'mcp', 'src', 'index.js');
  const output = execFileSync(process.execPath, [scriptPath], {
    input: `${JSON.stringify(payload)}\n`,
    encoding: 'utf8',
    cwd: repoRoot,
    // Full-suite runs can be CPU-bound; keep the cross-surface contract stable under load.
    timeout: CROSS_SURFACE_PROCESS_TIMEOUT_MS,
  });
  const messages = jsonRpcMessages(output);
  const response = messages.find((message) => message?.id === payload.id);
  expect(response).toBeTruthy();
  return response;
}

function parseMcpScenarioPayload(response, scenarioId) {
  if (response?.error) {
    const code = response.error.code ?? 'unknown';
    const message = response.error.message || JSON.stringify(response.error);
    throw new Error(`MCP JSON-RPC error for schema acceptance scenario "${scenarioId}" [${code}]: ${message}`);
  }

  const text = response?.result?.content?.[0]?.text;
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error(`MCP returned no result payload for schema acceptance scenario "${scenarioId}".`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`MCP returned non-JSON payload for schema acceptance scenario "${scenarioId}": ${error.message}`);
  }
}

function runCliScenario(scenario) {
  const cliEntry = path.join(repoRoot, 'apps', 'cli', 'src', 'node-entry.js');

  let stdout;
  try {
    stdout = execFileSync(
      process.execPath,
      [
        cliEntry,
        'generate',
        '-i',
        scenario.schemaPath,
        '-n',
        String(scenario.rowCount),
        '-f',
        scenario.outputFormat,
        '--show-progress',
        'false',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf8',
        // Full-suite runs can be CPU-bound; keep the cross-surface contract stable under load.
        timeout: CROSS_SURFACE_PROCESS_TIMEOUT_MS,
      }
    );
  } catch (error) {
    return normalizeCliFailure(error.stderr || error.stdout || error.message);
  }

  try {
    return normalizeCliSuccess(stdout, scenario.expectedHeaders);
  } catch (error) {
    throw new Error(`CLI returned non-JSON output for schema acceptance scenario "${scenario.id}": ${error.message}`);
  }
}

describe('cross-surface schema acceptance (CLI + MCP)', () => {
  test.each(SCHEMA_ACCEPTANCE_SCENARIOS)('$id CLI matches shared acceptance criteria', (scenario) => {
    const normalized = runCliScenario(scenario);
    scenario.assertAcceptance(expect, normalized);
  });

  test.each(SCHEMA_ACCEPTANCE_SCENARIOS)('$id MCP matches shared acceptance criteria', (scenario) => {
    const response = requestMcpServer({
      jsonrpc: '2.0',
      id: `schema-acceptance-${scenario.id}`,
      method: 'tools/call',
      params: {
        name: 'generate_data_from_spec',
        arguments: {
          textSpec: scenario.schemaText,
          rowCount: scenario.rowCount,
          outputFormat: scenario.outputFormat,
        },
      },
    });
    const payload = parseMcpScenarioPayload(response, scenario.id);
    const normalized = normalizeMcpPayload(payload);
    scenario.assertAcceptance(expect, normalized);
  });
});
