import { createThemeToggleComponent } from '../../../packages/core-ui/js/gui_components/shared/theme-toggle.js';
import { executeAnyWayDataMcpTool, listAnyWayDataMcpTools } from '@anywaydata/core/mcp/anywaydata-mcp-contract.js';

function findModelContext(documentObj) {
  if (!documentObj) {
    return null;
  }

  return documentObj.modelContext || documentObj.defaultView?.navigator?.modelContext || null;
}

function setStatus(statusElement, message, options = {}) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.classList.remove('is-loading');

  if (options.isLoading) {
    statusElement.classList.add('is-loading');
  }

  if (options.severity) {
    statusElement.setAttribute('data-severity', options.severity);
  } else {
    statusElement.removeAttribute('data-severity');
  }
}

function appendListItems(container, items, createItem) {
  if (!container) {
    return;
  }

  container.replaceChildren();
  items.forEach((item) => {
    container.appendChild(createItem(item));
  });
}

function createToolCard(documentObj, tool) {
  const article = documentObj.createElement('article');
  article.className = 'webmcp-card';

  const heading = documentObj.createElement('h3');
  heading.className = 'webmcp-card__title';
  heading.textContent = tool.name;
  article.appendChild(heading);

  const description = documentObj.createElement('p');
  description.className = 'webmcp-card__body';
  description.textContent = tool.description;
  article.appendChild(description);

  const schemaNote = documentObj.createElement('p');
  schemaNote.className = 'webmcp-card__meta';
  const requiredFields = Array.isArray(tool.inputSchema?.required) ? tool.inputSchema.required.join(', ') : 'none';
  schemaNote.textContent = `Required inputs: ${requiredFields}`;
  article.appendChild(schemaNote);

  return article;
}

async function registerTools({ modelContext, tools }) {
  const registrations = [];

  try {
    for (const tool of tools) {
      const abortController = new globalThis.AbortController();
      await modelContext.registerTool(
        {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          outputSchema: tool.outputSchema,
          async execute(args) {
            return executeAnyWayDataMcpTool(tool.name, args);
          },
        },
        { signal: abortController.signal }
      );
      registrations.push(abortController);
    }
  } catch (error) {
    registrations.forEach((registration) => {
      registration.abort();
    });
    throw error;
  }

  return registrations;
}

async function bootstrapWebMcpPage({
  documentObj = globalThis.document,
  modelContext = findModelContext(documentObj),
  createThemeToggleComponentFn = createThemeToggleComponent,
} = {}) {
  if (!documentObj) {
    return null;
  }

  const statusElement = documentObj.getElementById('webmcp-status');
  const toolListElement = documentObj.getElementById('webmcp-tool-list');
  const tools = listAnyWayDataMcpTools();

  appendListItems(toolListElement, tools, (tool) => createToolCard(documentObj, tool));

  const themeToggle = createThemeToggleComponentFn({
    documentObj,
    hostElement: documentObj.querySelector('[data-role="theme-toggle-host"]'),
  });

  if (!modelContext?.registerTool) {
    setStatus(
      statusElement,
      'document.modelContext is not available in this browser session. This page still documents the in-browser AnyWayData tools.',
      { severity: 'warning' }
    );

    return {
      destroy() {
        themeToggle?.destroy?.();
      },
      registeredToolNames: [],
    };
  }

  setStatus(statusElement, 'Registering AnyWayData tools with document.modelContext...', { isLoading: true });

  let registrations;
  try {
    registrations = await registerTools({ modelContext, tools });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(statusElement, `Unable to register AnyWayData tools with document.modelContext: ${message}`, {
      severity: 'error',
    });
    themeToggle?.destroy?.();
    throw error;
  }

  setStatus(
    statusElement,
    `Registered ${tools.length} AnyWayData tools with document.modelContext for in-browser WebMCP agents.`,
    { severity: 'info' }
  );

  return {
    destroy() {
      registrations.forEach((registration) => {
        registration.abort();
      });
      themeToggle?.destroy?.();
    },
    registeredToolNames: tools.map((tool) => tool.name),
  };
}

export { bootstrapWebMcpPage, findModelContext };
