const { execSync } = require('child_process');
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
    execSync(`docker run --rm -i hadolint/hadolint < "${apiDockerfile}"`, { stdio: 'inherit' });
    
    console.log('Running hadolint on MCP Dockerfile...');
    execSync(`docker run --rm -i hadolint/hadolint < "${mcpDockerfile}"`, { stdio: 'inherit' });
    
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