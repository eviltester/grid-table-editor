const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const buildDir = path.join(repoRoot, 'build');
const webDistDir = path.join(repoRoot, 'apps', 'web', 'dist');
const webImagesDir = path.join(repoRoot, 'apps', 'web', 'images');
const webLibsDir = path.join(repoRoot, 'apps', 'web', 'libs');

if (!fs.existsSync(buildDir)) {
  throw new Error(`Docs build directory not found: ${buildDir}`);
}

if (!fs.existsSync(webDistDir)) {
  throw new Error(`Web dist directory not found: ${webDistDir}`);
}

fs.cpSync(webDistDir, buildDir, { recursive: true, force: true });

if (fs.existsSync(webImagesDir)) {
  fs.cpSync(webImagesDir, path.join(buildDir, 'images'), { recursive: true, force: true });
}

if (fs.existsSync(webLibsDir)) {
  fs.cpSync(webLibsDir, path.join(buildDir, 'libs'), { recursive: true, force: true });
}

console.log('Merged apps/web dist, images, and libs into build/');
