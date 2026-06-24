import { expect, waitFor, within } from 'storybook/test';
import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createGeneratorPageComponent } from '../../../../packages/core-ui/js/gui_components/generator/page/create-generator-page-component.js';
import { createGeneratorPageShellComponent } from '../../../../packages/core-ui/js/gui_components/generator/page/create-generator-page-shell-component.js';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-examples.js';
import { validateSchemaRows as validateSharedSchemaRows } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-editor-core.js';
import { getAllowedFakerCommandsAlphabetical } from '../../../../packages/core-ui/js/gui_components/shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../../../packages/core-ui/js/gui_components/shared/domain-commands.js';
import { buildSchemaModeHelpHtml } from '../../../../packages/core-ui/js/gui_components/shared/test-data/help/schema-mode-help-builder.js';
import { createGeneratorSchemaDefinitionSupport } from '../../../../packages/core-ui/js/gui_components/generator/schema-support/create-generator-schema-definition-support.js';
import { GridExtension as TabulatorGridExtension } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

function createStoryDataTable(headers, rows) {
  return {
    getHeaders() {
      return headers.slice();
    },
    getColumnCount() {
      return headers.length;
    },
    getRows() {
      return rows.map((row) => row.slice());
    },
    getRowCount() {
      return rows.length;
    },
    getRowAsObjectUsingHeadings(rowIndex, fieldNames) {
      const row = rows[rowIndex] || [];
      const output = {};
      fieldNames.forEach((fieldName, columnIndex) => {
        output[fieldName] = row[columnIndex] ?? '';
      });
      return output;
    },
  };
}

let generatorPageStoryInstanceCount = 0;

function getSchemaHelpText(rootElement) {
  return rootElement.querySelector('[data-help="shared-schema-mode-help"]')?.getAttribute('data-help-text') || '';
}

function createGeneratorSchemaStoryProps(ids = {}) {
  let rowCounter = 1;
  const fakerCommands = getAllowedFakerCommandsAlphabetical().filter(
    (command) => command !== 'RegEx' && command.startsWith('helpers.')
  );
  const domainCommands = getKnownDomainCommandsAlphabetical();
  const createBlankRow = () => ({
    id: `generator-story-schema-row-${rowCounter++}`,
    name: '',
    sourceType: 'regex',
    command: '',
    params: '',
    value: '',
    comments: '',
    leadingTextLines: [],
  });
  const schemaSupport = createGeneratorSchemaDefinitionSupport({
    createBlankRow,
    fakerCommands,
    domainCommands,
    buildModeHelpHtml: ({ inTextMode }) =>
      buildSchemaModeHelpHtml({
        inTextMode,
        supplementalLinkUrl: 'https://anywaydata.com/docs/test-data/generate-to-file',
        supplementalLinkText: 'Generate To File docs',
      }),
    validateSchemaRows: (rows) =>
      validateSharedSchemaRows({
        schemaRows: rows,
        schemaRowsToDataRules,
      }),
  });

  return {
    headingText: 'Schema',
    ids: { ...ids },
    schemaTextToDataRules,
    dataRulesToSchemaText,
    faker,
    RandExp,
    createBlankRow: schemaSupport.createBlankRow,
    mapRuleToRow: schemaSupport.mapRuleToRow,
    getMethodPickerOptions: schemaSupport.getMethodPickerOptions,
    getVisibleDomainCommands: schemaSupport.getVisibleDomainCommands,
    fakerCommands,
    sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
    buildModeHelpHtml: schemaSupport.buildModeHelpHtml,
    validateSchemaRows: schemaSupport.validateSchemaRows,
  };
}

function createGeneratorPageStoryIds(storyPrefix) {
  return {
    controls: {
      outputFormatSelect: `${storyPrefix}-generatorOutputFormat`,
      generateDataButton: `${storyPrefix}-generateDataButton`,
      generatePairwiseButtonWrapper: `${storyPrefix}-generateAllPairsButtonWrapper`,
      generatePairwiseButton: `${storyPrefix}-generateAllPairsButton`,
      status: `${storyPrefix}-generatorStatusText`,
      rowCountInput: `${storyPrefix}-generateRowsCount`,
    },
    preview: {
      previewButton: `${storyPrefix}-previewDataButton`,
      outputPreview: `${storyPrefix}-generatorOutputPreview`,
      previewGrid: `${storyPrefix}-generator-preview-grid`,
      rowCountInput: `${storyPrefix}-previewRowsCount`,
    },
  };
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
  const themeToggleHost = document.createElement('div');
  themeToggleHost.setAttribute('data-role', 'theme-toggle-host');
  themeToggleHost.style.minHeight = '2.5rem';
  root.appendChild(themeToggleHost);
  const shellRoot = document.createElement('div');
  shellRoot.id = `${storyPrefix}-generator-page-root`;
  root.appendChild(shellRoot);

  const shell = createGeneratorPageShellComponent({
    root: shellRoot,
  });
  const storyIds = createGeneratorPageStoryIds(storyPrefix);

  let component = null;
  const queuePreviewData = (pageComponent) => {
    if (!args.sampleData) {
      return;
    }

    const dataTable = createStoryDataTable(args.sampleData.headers, args.sampleData.rows);
    pageComponent
      .getGeneratorPreview?.()
      ?.whenReady?.()
      .then(() => {
        pageComponent.getGeneratorPreview()?.setPreviewDataTable?.(dataTable);
      });
  };

  component = createGeneratorPageComponent({
    root: root.querySelector('#generator-app'),
    documentObj: document,
    props: {
      controlsProps: {
        selectedFormat: args.selectedFormat,
        currentOptions: { options: { header: true, quoteChar: '"' } },
        pairwiseVisible: args.pairwiseVisible,
        ids: storyIds.controls,
      },
      previewProps: {
        outputPreviewText: args.outputPreviewText,
        ids: storyIds.preview,
      },
      schemaDefinitionProps: createGeneratorSchemaStoryProps(),
    },
    services: {
      createTimedStatusPresenter: () => ({
        show() {},
        clear() {},
      }),
      generatorPreviewServices: {
        TabulatorCtor: Tabulator,
        GridExtensionClass: TabulatorGridExtension,
      },
    },
  });
  queuePreviewData(component);

  root.__storybookCleanup = () => {
    component?.destroy();
    shell?.destroy?.();
  };
  return root;
}

const meta = {
  title: 'Pages/Generator/Page',
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
  },
  argTypes: {
    selectedFormat: {
      control: 'select',
      options: ['csv', 'json', 'markdown'],
      description: 'Selected output format passed to the GeneratorControls feature.',
    },
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the Generate Combinations button is visible in the controls feature.',
    },
    outputPreviewText: {
      control: 'text',
      description: 'Current output preview text shown by the preview feature.',
    },
    sampleData: {
      control: false,
      description: 'Sample data rendered into the preview table through the page component API.',
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
    const previewGridRegion = await canvas.findByLabelText('Data Table Preview Grid');
    await expect(await canvas.findByRole('button', { name: 'Generate Data' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(await canvas.findByRole('button', { name: 'Edit as Text' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue(
      'First Name,Status\nAlice,active'
    );
    await expect(previewGridRegion).toBeVisible();
    await expect(await within(previewGridRegion).findByText('First Name', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Status', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Alice', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('active', { exact: true })).toBeVisible();
    await waitFor(() => {
      expect(getSchemaHelpText(canvasElement)).toContain('Insert Example Schema');
    });
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
          'Shows the composed page when combination generation is available and the preview feature already has output text and preview rows. The page-level story should still expose the real schema help affordance and a visible preview table, not just the surrounding shells.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previewGridRegion = await canvas.findByLabelText('Data Table Preview Grid');
    await expect(await canvas.findByRole('button', { name: 'Generate Combinations' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue('Status,Priority\nactive,high');
    await expect(previewGridRegion).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Status', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Priority', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('active', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('high', { exact: true })).toBeVisible();
    await waitFor(() => {
      expect(getSchemaHelpText(canvasElement)).toContain('Insert Example Schema');
    });
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
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses the real `GeneratorPage -> GeneratorPreview -> TabulatorGridAdapter` service path with the same Tabulator library the generator page loads. This is the highest-fidelity page story for reviewing the preview-grid adapter boundary.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previewGridRegion = await canvas.findByLabelText('Data Table Preview Grid');
    await expect(await canvas.findByRole('button', { name: 'Generate Combinations' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Output Preview' })).toHaveValue(
      'Email,Status\nava@example.com,active'
    );
    await expect(previewGridRegion).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Email', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('Status', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('ava@example.com', { exact: true })).toBeVisible();
    await expect(await within(previewGridRegion).findByText('active', { exact: true })).toBeVisible();
    await waitFor(() => {
      expect(getSchemaHelpText(canvasElement)).toContain('Insert Example Schema');
    });
  },
};
