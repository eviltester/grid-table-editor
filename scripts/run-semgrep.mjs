import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const localSemgrepBinary = isWindows
  ? join(process.cwd(), '.tmp', 'semgrep-env', 'Scripts', 'semgrep.exe')
  : join(process.cwd(), '.tmp', 'semgrep-env', 'bin', 'semgrep');
const semgrepCommand = existsSync(localSemgrepBinary) ? localSemgrepBinary : 'semgrep';
const extraArgs = process.argv.slice(2);
const isCiMode = extraArgs.includes('--ci');
const passthroughArgs = extraArgs.filter((arg) => arg !== '--ci');
const scanTargets = [
  'apps/api/src',
  'apps/cli/src',
  'apps/mcp/src',
  'apps/web/src',
  'packages/core/js',
  'packages/core-ui/js',
  'scripts',
];

const semgrepArgs = [
  'scan',
  '--metrics',
  'off',
  '--disable-version-check',
  '--config',
  'p/javascript',
  '--config',
  'p/nodejs',
  '--exclude-rule',
  'javascript.express.security.injection.raw-html-format.raw-html-format',
  ...scanTargets,
  ...passthroughArgs,
];

if (isCiMode) {
  semgrepArgs.splice(1, 0, '--error');
}

const result = spawnSync(semgrepCommand, semgrepArgs, {
  stdio: 'inherit',
  shell: false,
});

if (result.error?.code === 'ENOENT') {
  console.error('Semgrep is not installed.');
  console.error('Install it into a local venv with:');
  console.error('  python -m venv .tmp/semgrep-env');
  console.error('  .tmp/semgrep-env/Scripts/python -m pip install -r .semgrep/requirements.txt');
  process.exit(1);
}

process.exit(result.status ?? 1);
