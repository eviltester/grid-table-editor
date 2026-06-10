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
          <p id="webmcp-status">Preparing in-browser WebMCP tool registration...</p>
          <div id="webmcp-tool-list"></div>
        </main>
      </body></html>`,
      { url: 'https://example.test/webmcp.html' }
    );
  });

  afterEach(() => {
    dom.window.close();
    jest.restoreAllMocks();
  });

  function createModelContextDouble() {
    return {
      registerTool: jest.fn(),
    };
  }

  test('renders cards and registers tools through document.modelContext', async () => {
    const modelContext = createModelContextDouble();
    const createThemeToggleComponentFn = jest.fn(() => ({ destroy: jest.fn() }));

    const page = await bootstrapWebMcpPage({
      documentObj: dom.window.document,
      modelContext,
      createThemeToggleComponentFn,
    });

    expect(modelContext.registerTool).toHaveBeenCalledTimes(3);
    const generateToolRegistration = modelContext.registerTool.mock.calls.find(
      ([tool]) => tool.name === 'generate_data_from_spec'
    );
    expect(generateToolRegistration[0].inputSchema).toMatchObject({
      properties: {
        textSpec: { type: 'string' },
        rowCount: { type: 'integer' },
        outputFormat: { type: 'string' },
      },
    });
    expect(generateToolRegistration[0].outputSchema).toBeDefined();
    expect(generateToolRegistration[1].signal).toBeDefined();
    expect(page.registeredToolNames).toEqual([
      'generate_data_from_spec',
      'amend_data_from_spec',
      'get_output_format_options_schema',
    ]);
    expect(dom.window.document.getElementById('webmcp-status').textContent).toContain(
      'Registered 3 AnyWayData tools with document.modelContext'
    );
    expect(dom.window.document.querySelectorAll('.webmcp-card').length).toBe(3);
    expect(createThemeToggleComponentFn).toHaveBeenCalledWith({
      documentObj: dom.window.document,
      hostElement: dom.window.document.querySelector('[data-role="theme-toggle-host"]'),
    });
  });

  test('returns the declared MCP tool payload from registered document.modelContext tool callbacks', async () => {
    const modelContext = createModelContextDouble();

    await bootstrapWebMcpPage({
      documentObj: dom.window.document,
      modelContext,
      createThemeToggleComponentFn: () => null,
    });

    const generateTool = modelContext.registerTool.mock.calls.find(([tool]) => tool.name === 'generate_data_from_spec');
    const response = await generateTool[0].execute({
      textSpec: 'name\nperson.firstName',
      rowCount: 1,
      outputFormat: 'json',
    });

    expect(response.ok).toBe(true);
    expect(response.rows).toHaveLength(1);
    expect(response).not.toHaveProperty('structuredContent');
    expect(response).not.toHaveProperty('content');
    expect(response).not.toHaveProperty('isError');
  });

  test('aborts registered tools when the page is destroyed', async () => {
    const abortSpy = jest.fn();
    const originalAbortController = globalThis.AbortController;

    class AbortControllerDouble {
      constructor() {
        this.signal = { aborted: false };
      }

      abort() {
        this.signal.aborted = true;
        abortSpy();
      }
    }

    globalThis.AbortController = AbortControllerDouble;

    const modelContext = createModelContextDouble();

    try {
      const page = await bootstrapWebMcpPage({
        documentObj: dom.window.document,
        modelContext,
        createThemeToggleComponentFn: () => null,
      });

      page.destroy();

      expect(abortSpy).toHaveBeenCalledTimes(3);
    } finally {
      globalThis.AbortController = originalAbortController;
    }
  });

  test('shows a warning when document.modelContext is unavailable', async () => {
    const page = await bootstrapWebMcpPage({
      documentObj: dom.window.document,
      modelContext: null,
      createThemeToggleComponentFn: () => null,
    });

    expect(page.registeredToolNames).toEqual([]);
    const statusElement = dom.window.document.getElementById('webmcp-status');
    expect(statusElement.textContent).toContain('document.modelContext is not available');
    expect(statusElement.getAttribute('data-severity')).toBe('warning');
  });

  test('shows an error status when document.modelContext registration throws', async () => {
    const registrationError = new Error('registration failed');
    const destroy = jest.fn();

    await expect(
      bootstrapWebMcpPage({
        documentObj: dom.window.document,
        modelContext: {
          async registerTool() {
            throw registrationError;
          },
        },
        createThemeToggleComponentFn: () => ({ destroy }),
      })
    ).rejects.toThrow('registration failed');

    const statusElement = dom.window.document.getElementById('webmcp-status');
    expect(statusElement.textContent).toContain(
      'Unable to register AnyWayData tools with document.modelContext: registration failed'
    );
    expect(statusElement.getAttribute('data-severity')).toBe('error');
    expect(statusElement.classList.contains('is-loading')).toBe(false);
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});
