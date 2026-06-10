import '@mcp-b/webmcp-polyfill';

void import('./webmcp-page.mjs')
  .then(({ bootstrapWebMcpPage }) => bootstrapWebMcpPage())
  .catch((error) => {
    globalThis.console?.error?.('Failed to load WebMCP page', error);
  });
