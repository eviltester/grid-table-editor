import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '..', 'output');
const port = Number(process.env.PORT || 4177);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.dot': 'text/plain; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mmd': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
};

function resolveRequestPath(requestUrl = '/') {
  const parsedUrl = new URL(requestUrl, `http://127.0.0.1:${port}`);
  const requestedPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const normalizedPath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');
  return path.join(outputDir, normalizedPath);
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  const relativePath = path.relative(outputDir, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath) || !existsSync(filePath)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Graph report available at http://127.0.0.1:${port}/`);
});
