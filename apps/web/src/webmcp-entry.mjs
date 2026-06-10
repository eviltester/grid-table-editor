import { initializeWebMCPPolyfill } from '@mcp-b/webmcp-polyfill';

initializeWebMCPPolyfill();

void import('./webmcp-page.mjs')
  .then(({ bootstrapWebMcpPage }) => bootstrapWebMcpPage())
  .catch((error) => {
    globalThis.console?.error?.('Failed to load WebMCP page', error);
  });
