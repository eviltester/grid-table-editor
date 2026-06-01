import { execFileSync, spawn } from 'node:child_process';
import process from 'node:process';

function listPidsForPort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execFileSync('netstat', ['-ano'], { encoding: 'utf8' });
      return [...output.matchAll(new RegExp(`:${port}\\s+.*?\\s+(\\d+)`, 'g'))].map((match) => match[1]);
    }

    const output = execFileSync('lsof', ['-ti', `tcp:${port}`], { encoding: 'utf8' });
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    if (process.platform === 'win32') {
      execFileSync('taskkill', ['/PID', String(pid), '/F'], { stdio: 'ignore' });
      return;
    }

    process.kill(Number(pid), 'SIGTERM');
  } catch {
    // Ignore cleanup failures and let the real command report if the port is still blocked.
  }
}

function ensurePortFree(port) {
  const pids = [...new Set(listPidsForPort(port))];
  pids.forEach((pid) => killPid(pid));
}

ensurePortFree(6006);

const child = spawn('pnpm', ['exec', 'vitest', '--project=storybook', '--run'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
