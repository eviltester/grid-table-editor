import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { bootstrapWebMcpPage } from '../../webmcp-page.mjs';

describe('webmcp page bootstrap', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html><body>
        <div class="header" data-role="theme-toggle-host"><div class="pageheading">AnyWayData</div></div>
        <main id="webmcp-page-root">
          <p id="webmcp-status">Preparing WebMCP tool registration...</p>
          <div id="webmcp-tool-list"></div>
          <div id="webmcp-resource-list"></div>
          <div id="webmcp-config-examples"></div>
        </main>
      </body></html>`,
      { url: 'https://example.test/webmcp.html' }
    );
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  test('renders tool and resource cards and registers tools when modelContext is available', async () => {
    const registerTool = jest.fn();
    const modelContext = { registerTool };
    const createThemeToggleComponentFn = jest.fn(() => ({ destroy: jest.fn() }));

    const page = await bootstrapWebMcpPage({
      documentObj: dom.window.document,
      modelContext,
      createThemeToggleComponentFn,
    });

    expect(registerTool).toHaveBeenCalledTimes(3);
    expect(page.registeredToolNames).toEqual([
      'generate_data_from_spec',
      'amend_data_from_spec',
      'get_output_format_options_schema',
    ]);
    expect(dom.window.document.getElementById('webmcp-status').textContent).toContain('Registered 3 AnyWayData tools');
    expect(dom.window.document.querySelectorAll('.webmcp-card').length).toBeGreaterThanOrEqual(5);
    expect(createThemeToggleComponentFn).toHaveBeenCalledWith({
      documentObj: dom.window.document,
      hostElement: dom.window.document.querySelector('[data-role="theme-toggle-host"]'),
    });
  });

  test('wraps tool execution results in WebMCP response shape', async () => {
    const registerTool = jest.fn();

    await bootstrapWebMcpPage({
      documentObj: dom.window.document,
      modelContext: { registerTool },
      createThemeToggleComponentFn: () => null,
    });

    const generateTool = registerTool.mock.calls.find(([tool]) => tool.name === 'generate_data_from_spec')[0];
    const response = await generateTool.execute({
      textSpec: 'name\nperson.firstName',
      rowCount: 1,
      outputFormat: 'json',
    });

    expect(response.structuredContent.ok).toBe(true);
    expect(response.content[0].type).toBe('text');
    expect(JSON.parse(response.content[0].text).ok).toBe(true);
    expect(response.isError).toBe(false);
  });

  test('shows a warning when no modelContext runtime is available', async () => {
    const page = await bootstrapWebMcpPage({
      documentObj: dom.window.document,
      modelContext: null,
      createThemeToggleComponentFn: () => null,
    });

    expect(page.registeredToolNames).toEqual([]);
    const statusElement = dom.window.document.getElementById('webmcp-status');
    expect(statusElement.textContent).toContain('WebMCP runtime not detected');
    expect(statusElement.getAttribute('data-severity')).toBe('warning');
  });
});
