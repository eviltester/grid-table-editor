import { expect, within } from 'storybook/test';
import { createGeneratorPageComponent } from '../../../../packages/core-ui/js/gui_components/generator/page/index.js';
import { buildSchemaModeHelpHtml } from '../../../../packages/core-ui/js/gui_components/generator/schema/index.js';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-examples.js';

function createStoryDataTable(headers, rows) {
  return {
    getHeaders() {
      return headers.slice();
    },
    getRows() {
      return rows.map((row) => row.slice());
    },
  };
}

function renderStoryPreviewGridMarkup(headers, rows, dataRole) {
  const headerMarkup = headers
    .map(
      (header) => `
        <th
          style="border:1px solid #c9d7e1;padding:0.45rem 0.6rem;background:#edf4f8;font-weight:600;text-align:left;"
        >
          ${header}
        </th>
      `
    )
    .join('');

  const rowMarkup = rows
    .map(
      (row) => `
        <tr>
          ${row
            .map(
              (cell) => `
                <td style="border:1px solid #d7e2e8;padding:0.45rem 0.6rem;background:#ffffff;">
                  ${cell}
                </td>
              `
            )
            .join('')}
        </tr>
      `
    )
    .join('');

  return `
    <div
      class="story-preview-grid"
      data-role="${dataRole}"
      style="padding:0.35rem;border:1px solid #d7e2e8;border-radius:6px;background:#f8fbfd;overflow:auto;"
    >
      <table
        style="width:100%;border-collapse:collapse;font-size:0.92rem;color:#163247;background:#ffffff;"
        aria-label="Preview grid"
      >
        <thead>
          <tr>${headerMarkup}</tr>
        </thead>
        <tbody>${rowMarkup}</tbody>
      </table>
    </div>
  `;
}

let generatorPageStoryInstanceCount = 0;

function prefixElementIds(root, prefix) {
  const elementsWithIds = Array.from(root.querySelectorAll('[id]'));
  const idMap = new Map();

  elementsWithIds.forEach((element) => {
    const originalId = element.id;
    const nextId = `${prefix}-${originalId}`;
    idMap.set(originalId, nextId);
    element.id = nextId;
  });

  const referenceAttributes = ['for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns'];
  const selector = referenceAttributes.map((attribute) => `[${attribute}]`).join(',');

  root.querySelectorAll(selector).forEach((element) => {
    referenceAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) {
        return;
      }

      const mapped = value
        .split(/\s+/)
        .map((token) => idMap.get(token) || token)
        .join(' ');
      element.setAttribute(attribute, mapped);
    });
  });

  return idMap;
}

class StoryPageTabulator {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.element.innerHTML = '<div class="story-page-tabulator-grid" data-role="generator-page-adapter-grid"></div>';
  }

  destroy() {
    this.element.innerHTML = '';
  }
}

class StoryPagePreviewGridExtension {
  constructor(tabulator) {
    this.tabulator = tabulator;
  }

  setGridFromGenericDataTable(dataTable) {
    const headers = dataTable?.getHeaders?.() || [];
    const rows = dataTable?.getRows?.() || [];
    this.tabulator.element.innerHTML = renderStoryPreviewGridMarkup(headers, rows, 'generator-page-adapter-grid');
  }
}

function renderGeneratorPageStory(args) {
  generatorPageStoryInstanceCount += 1;
  const storyPrefix = `generator-page-story-${generatorPageStoryInstanceCount}`;
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Generator page story');

  const heading = document.createElement('h1');
  heading.textContent = 'Generator page';
  heading.style.position = 'absolute';
  heading.style.width = '1px';
  heading.style.height = '1px';
  heading.style.padding = '0';
  heading.style.margin = '-1px';
  heading.style.overflow = 'hidden';
  heading.style.clip = 'rect(0, 0, 0, 0)';
  heading.style.whiteSpace = 'nowrap';
  heading.style.border = '0';
  root.appendChild(heading);

  const component = createGeneratorPageComponent({
    root,
    documentObj: document,
    props: {
      controlsProps: {
        selectedFormat: args.selectedFormat,
        currentOptions: { options: { header: true, quoteChar: '"' } },
        pairwiseVisible: args.pairwiseVisible,
      },
      previewProps: {
        outputPreviewText: args.outputPreviewText,
      },
      schemaDefinitionProps: {
        headingText: 'Schema',
        ids: {
          rows: 'generatorSchemaRows',
          textContainer: 'generatorSchemaTextContainer',
          text: 'generatorSchemaText',
          addButton: 'addSchemaRowButton',
          toggleButton: 'schemaModeToggleButton',
          helpIcon: 'schemaModeHelpIcon',
          error: 'generatorSchemaErrorText',
        },
        schemaTextToDataRules: () => ({ dataRules: [], errors: [], schemaTokens: [] }),
        dataRulesToSchemaText: () => '',
        fakerCommands: [],
        sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
        createBlankRow: () => ({
          id: 'schema-row-1',
          name: '',
          sourceType: 'regex',
          command: '',
          params: '',
          value: '',
          comments: '',
          leadingTextLines: [],
        }),
        mapRuleToRow: () => ({
          id: 'schema-row-1',
          name: '',
          sourceType: 'regex',
          command: '',
          params: '',
          value: '',
          comments: '',
          leadingTextLines: [],
        }),
        getMethodPickerOptions: () => [],
        getVisibleDomainCommands: () => [],
        buildModeHelpHtml: ({ inTextMode }) =>
          buildSchemaModeHelpHtml({
            inTextMode,
            generateToFileHelpUrl: 'https://anywaydata.com/docs/test-data/generate-to-file',
          }),
        validateSchemaRows: (rows) => ({ rows, errors: [] }),
      },
    },
    services: {
      createTimedStatusPresenter: () => ({
        show() {},
        clear() {},
      }),
      generatorPreviewServices: args.usePreviewAdapter
        ? {
            TabulatorCtor: StoryPageTabulator,
            GridExtensionClass: StoryPagePreviewGridExtension,
          }
        : {
            createPreviewGrid: ({ rootElement }) => {
              const renderTable = (dataTable) => {
                const headers = dataTable?.getHeaders?.() || [];
                const rows = dataTable?.getRows?.() || [];
                rootElement.innerHTML = renderStoryPreviewGridMarkup(headers, rows, 'generator-page-preview-grid');
              };

              return {
                tableApi: { story: true },
                gridApi: { setGridFromGenericDataTable: renderTable },
              };
            },
          },
    },
  });

  if (args.sampleData) {
    component
      .getGeneratorPreview()
      ?.setPreviewDataTable?.(createStoryDataTable(args.sampleData.headers, args.sampleData.rows));
  }

  prefixElementIds(root, storyPrefix);

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Generator/Page',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GeneratorPage composes the generator schema, controls, and preview feature roots. It is the page-level boundary that keeps host/bootstrap code out of the feature internals.',
      },
    },
  },
  args: {
    selectedFormat: 'csv',
    pairwiseVisible: false,
    outputPreviewText: 'First Name,Status\nAlice,active',
    sampleData: {
      headers: ['First Name', 'Status'],
      rows: [['Alice', 'active']],
    },
    usePreviewAdapter: false,
  },
  argTypes: {
    selectedFormat: {
      control: 'select',
      options: ['csv', 'json', 'markdown'],
      description: 'Selected output format passed to the GeneratorControls feature.',
    },
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the pairwise button is visible in the controls feature.',
    },
    outputPreviewText: {
      control: 'text',
      description: 'Current output preview text shown by the preview feature.',
    },
    sampleData: {
      control: false,
      description: 'Sample data rendered into the preview table through the page component API.',
    },
    usePreviewAdapter: {
      control: false,
      description: 'When true, the story uses the preview adapter path with Storybook Tabulator stand-ins.',
    },
  },
  render: renderGeneratorPageStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the composed generator page with schema, controls, and preview roots mounted together. Hover the schema help icon to see the real insert-example affordance, and inspect the preview section to confirm the page story renders both output text and a sample data-table preview.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const schemaHelpIcon = canvasElement.querySelector('[data-help="generator-schema-mode-help"]');
    await expect(canvas.getByRole('button', { name: 'Generate Data' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Edit as Text' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue(
      'First Name,Status\nAlice,active'
    );
    await expect(canvas.getByRole('table', { name: 'Preview grid' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'First Name' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'Alice' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'active' })).toBeVisible();
    expect(schemaHelpIcon?.getAttribute('data-help-text')).toContain('Insert Example Schema');
  },
};

export const PairwiseReady = {
  args: {
    pairwiseVisible: true,
    outputPreviewText: 'Status,Priority\nactive,high',
    sampleData: {
      headers: ['Status', 'Priority'],
      rows: [['active', 'high']],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the composed page when pairwise generation is available and the preview feature already has output text and preview rows. The page-level story should still expose the real schema help affordance and a visible preview table, not just the surrounding shells.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const schemaHelpIcon = canvasElement.querySelector('[data-help="generator-schema-mode-help"]');
    await expect(canvas.getByRole('button', { name: 'Generate Pairwise' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue('Status,Priority\nactive,high');
    await expect(canvas.getByRole('table', { name: 'Preview grid' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'Priority' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'active' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'high' })).toBeVisible();
    expect(schemaHelpIcon?.getAttribute('data-help-text')).toContain('Insert Example Schema');
  },
};

export const WithPreviewGridAdapter = {
  args: {
    pairwiseVisible: true,
    outputPreviewText: 'Email,Status\nava@example.com,active',
    sampleData: {
      headers: ['Email', 'Status'],
      rows: [['ava@example.com', 'active']],
    },
    usePreviewAdapter: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses the real `GeneratorPage -> GeneratorPreview -> TabulatorGridAdapter` service path, but with Storybook Tabulator stand-ins so the Data Table Preview is still visible and inspectable in Docs/Canvas. This is the higher-fidelity page story for the preview-grid boundary.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const schemaHelpIcon = canvasElement.querySelector('[data-help="generator-schema-mode-help"]');
    await expect(canvas.getByRole('button', { name: 'Generate Pairwise' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue(
      'Email,Status\nava@example.com,active'
    );
    await expect(canvas.getByRole('table', { name: 'Preview grid' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'ava@example.com' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'active' })).toBeVisible();
    expect(schemaHelpIcon?.getAttribute('data-help-text')).toContain('Insert Example Schema');
  },
};
