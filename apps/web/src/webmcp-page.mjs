import { createThemeToggleComponent } from '../../../packages/core-ui/js/gui_components/shared/theme-toggle.js';
import {
  executeAnyWayDataMcpTool,
  listAnyWayDataMcpResources,
  listAnyWayDataMcpTools,
  readAnyWayDataMcpResource,
} from '@anywaydata/core/mcp/anywaydata-mcp-contract.js';

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

function createResourceCard(documentObj, resource) {
  const article = documentObj.createElement('article');
  article.className = 'webmcp-card';

  const heading = documentObj.createElement('h3');
  heading.className = 'webmcp-card__title';
  heading.textContent = resource.name;
  article.appendChild(heading);

  const description = documentObj.createElement('p');
  description.className = 'webmcp-card__body';
  description.textContent = resource.description;
  article.appendChild(description);

  const uri = documentObj.createElement('code');
  uri.className = 'webmcp-card__code';
  uri.textContent = resource.uri;
  article.appendChild(uri);

  return article;
}

function renderInstallExamples(documentObj, installGuide) {
  const host = documentObj.getElementById('webmcp-config-examples');
  if (!host || !installGuide?.examples) {
    return;
  }

  host.replaceChildren();
  Object.entries(installGuide.examples).forEach(([name, example]) => {
    const wrapper = documentObj.createElement('article');
    wrapper.className = 'webmcp-config-example';

    const heading = documentObj.createElement('h3');
    heading.className = 'webmcp-card__title';
    heading.textContent = name.replaceAll('_', ' ');
    wrapper.appendChild(heading);

    const block = documentObj.createElement('pre');
    block.className = 'webmcp-code-block';
    const code = documentObj.createElement('code');
    code.textContent = JSON.stringify(example, null, 2);
    block.appendChild(code);
    wrapper.appendChild(block);

    host.appendChild(wrapper);
  });
}

function createWebMcpToolResponse(payload) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload),
      },
    ],
    structuredContent: payload,
    isError: payload?.ok === false,
  };
}

async function registerTools({ modelContext, tools }) {
  const registrations = [];

  try {
    tools.forEach((tool) => {
      const abortController = new globalThis.AbortController();
      modelContext.registerTool(
        {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          outputSchema: tool.outputSchema,
          async execute(args) {
            return createWebMcpToolResponse(executeAnyWayDataMcpTool(tool.name, args));
          },
        },
        { signal: abortController.signal }
      );
      registrations.push(abortController);
    });
  } catch (error) {
    registrations.forEach((registration) => registration.abort());
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
  const resourceListElement = documentObj.getElementById('webmcp-resource-list');
  const tools = listAnyWayDataMcpTools();
  const resources = listAnyWayDataMcpResources();
  const installGuide = readAnyWayDataMcpResource(
    resources.find((resource) => resource.name === 'Install Config Examples')?.uri
  );

  appendListItems(toolListElement, tools, (tool) => createToolCard(documentObj, tool));
  appendListItems(resourceListElement, resources, (resource) => createResourceCard(documentObj, resource));
  renderInstallExamples(documentObj, installGuide);

  const themeToggle = createThemeToggleComponentFn({
    documentObj,
    hostElement: documentObj.querySelector('[data-role="theme-toggle-host"]'),
  });

  if (!modelContext?.registerTool) {
    setStatus(
      statusElement,
      'WebMCP runtime not detected in this browser session. The page still documents the available AnyWayData MCP tools.',
      { severity: 'warning' }
    );

    return {
      destroy() {
        themeToggle?.destroy?.();
      },
      registeredToolNames: [],
    };
  }

  setStatus(statusElement, 'Registering AnyWayData tools with WebMCP...', { isLoading: true });

  const registrations = await registerTools({ modelContext, tools });

  setStatus(statusElement, `Registered ${tools.length} AnyWayData tools for WebMCP clients on this page.`, {
    severity: 'info',
  });

  return {
    destroy() {
      registrations.forEach((registration) => registration.abort());
      themeToggle?.destroy?.();
    },
    registeredToolNames: tools.map((tool) => tool.name),
  };
}

export { bootstrapWebMcpPage, createWebMcpToolResponse, findModelContext };
