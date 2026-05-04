const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function isDockerAvailable() {
  try {
    // Check if Docker daemon is running by trying to connect
    execSync('docker version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function runDockerLinting() {
  // Use parent directory of scripts folder as project root
  const projectRoot = path.dirname(__dirname);
  const apiDockerfile = path.join(projectRoot, 'apps', 'api', 'Dockerfile');
  const mcpDockerfile = path.join(projectRoot, 'apps', 'mcp', 'Dockerfile');

  try {
    console.log('Running hadolint on API Dockerfile...');
    const apiDockerfileContent = fs.readFileSync(apiDockerfile, 'utf8');
    const apiResult = spawnSync('docker', ['run', '--rm', '-i', 'hadolint/hadolint'], {
      input: apiDockerfileContent,
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    if (apiResult.error || apiResult.status !== 0) {
      throw new Error(`hadolint failed for API Dockerfile with status ${apiResult.status}`);
    }

    console.log('Running hadolint on MCP Dockerfile...');
    const mcpDockerfileContent = fs.readFileSync(mcpDockerfile, 'utf8');
    const mcpResult = spawnSync('docker', ['run', '--rm', '-i', 'hadolint/hadolint'], {
      input: mcpDockerfileContent,
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    if (mcpResult.error || mcpResult.status !== 0) {
      throw new Error(`hadolint failed for MCP Dockerfile with status ${mcpResult.status}`);
    }

    console.log('Docker linting completed successfully!');
  } catch (error) {
    console.error('Docker linting failed:', error.message);
    process.exit(1);
  }
}

if (isDockerAvailable()) {
  runDockerLinting();
} else {
  console.log('Docker not available, skipping Dockerfile linting');
  process.exit(0);
}