import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: [
      { find: /^@anywaydata\/core$/, replacement: path.resolve(__dirname, '../../packages/core/src/index.js') },
      { find: /^@anywaydata\/core\/mcp\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/core/js/mcp/$1') },
      { find: /^@anywaydata\/core\/faker\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/core/js/faker/$1') },
      { find: /^@anywaydata\/core\/domain\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/core/js/domain/$1') },
      {
        find: /^@anywaydata\/core\/data_formats\/(.*)$/,
        replacement: path.resolve(__dirname, '../../packages/core/js/data_formats/$1'),
      },
      {
        find: /^@anywaydata\/core\/data_generation\/(.*)$/,
        replacement: path.resolve(__dirname, '../../packages/core/js/data_generation/$1'),
      },
      { find: /^@anywaydata\/core\/grid\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/core/js/grid/$1') },
      { find: /^@anywaydata\/core\/utils\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/core/js/utils/$1') },
      { find: /^@anywaydata\/core\/libs\/(.*)$/, replacement: path.resolve(__dirname, '../../packages/core/js/libs/$1') },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        app: path.resolve(__dirname, 'app.html'),
        generator: path.resolve(__dirname, 'generator.html'),
        webmcp: path.resolve(__dirname, 'webmcp.html'),
        combinatorial: path.resolve(__dirname, 'combinatorial.html'),
      },
    },
  },
});
