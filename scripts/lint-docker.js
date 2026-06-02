const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HADOLINT_IMAGE = process.env.HADOLINT_IMAGE || 'ghcr.io/hadolint/hadolint:v2.14.0';

function isHadolintAvailable() {
  try {
    const result = spawnSync('hadolint', ['--version'], { stdio: 'ignore' });
    return !result.error && result.status === 0;
  } catch (error) {
    return false;
  }
}

function isDockerAvailable() {
  try {
    // Check if Docker daemon is running by trying to connect
    execSync('docker version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function runHadolintBinary(dockerfilePath, label) {
  console.log(`Running hadolint on ${label} Dockerfile...`);
  const result = spawnSync('hadolint', [dockerfilePath], {
    stdio: 'inherit',
  });

  if (result.error || result.status !== 0) {
    throw new Error(`hadolint failed for ${label} Dockerfile with status ${result.status}`);
  }
}

function runHadolintDocker(dockerfilePath, label) {
  console.log(`Running hadolint on ${label} Dockerfile with ${HADOLINT_IMAGE}...`);
  const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
  const result = spawnSync('docker', ['run', '--rm', '-i', HADOLINT_IMAGE], {
    input: dockerfileContent,
    stdio: ['pipe', 'inherit', 'inherit'],
  });

  if (result.error || result.status !== 0) {
    throw new Error(`hadolint failed for ${label} Dockerfile with status ${result.status}`);
  }
}

function runDockerLinting() {
  // Use parent directory of scripts folder as project root
  const projectRoot = path.dirname(__dirname);
  const dockerfiles = [
    { label: 'API', path: path.join(projectRoot, 'apps', 'api', 'Dockerfile') },
    { label: 'MCP', path: path.join(projectRoot, 'apps', 'mcp', 'Dockerfile') },
  ];

  const useHadolintBinary = isHadolintAvailable();
  const useDockerFallback = !useHadolintBinary && isDockerAvailable();

  if (!useHadolintBinary && !useDockerFallback) {
    console.log('Hadolint and Docker are not available, skipping Dockerfile linting');
    return;
  }

  dockerfiles.forEach((dockerfile) => {
    if (useHadolintBinary) {
      runHadolintBinary(dockerfile.path, dockerfile.label);
      return;
    }
    runHadolintDocker(dockerfile.path, dockerfile.label);
  });

  console.log('Docker linting completed successfully!');
}

try {
  runDockerLinting();
} catch (error) {
  console.error('Docker linting failed:', error.message);
  process.exit(1);
}
