import { expect, waitFor, within } from 'storybook/test';
import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createGeneratorPageComponent } from '../../../../packages/core-ui/js/gui_components/generator/page/index.js';
import { buildSchemaModeHelpHtml } from '../../../../packages/core-ui/js/gui_components/generator/schema/index.js';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-examples.js';
import {
  mapDataRuleToSchemaRow,
  validateSchemaRows as validateSharedSchemaRows,
  createSchemaRowValidation,
} from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/index.js';
import { getKnownFakerCommandsAlphabetical } from '../../../../packages/core-ui/js/gui_components/shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../../../packages/core-ui/js/gui_components/shared/domain-commands.js';
import {
  getVisibleDomainCommands,
  buildSchemaHelpModel,
} from '../../../../packages/core-ui/js/gui_components/shared/test-data/help/index.js';
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
  return rootElement.querySelector('[id$="schemaModeHelpIcon"]')?.getAttribute('data-help-text') || '';
}

function createGeneratorSchemaStoryProps() {
  let rowCounter = 1;
  const fakerCommands = getKnownFakerCommandsAlphabetical().filter(
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
    validation: createSchemaRowValidation(),
  });

  return {
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
    schemaTextToDataRules,
    dataRulesToSchemaText,
    faker,
    RandExp,
    createBlankRow,
    mapRuleToRow: (rule, leadingTextLines = []) => {
      const row = mapDataRuleToSchemaRow(rule, {
        createBlankSchemaRow: createBlankRow,
      });
      row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
      return row;
    },
    getMethodPickerOptions: (currentValue = '') => [
      {
        sourceType: 'enum',
        command: 'enum',
        helpModel: buildSchemaHelpModel('enum', 'enum'),
      },
      {
        sourceType: 'literal',
        command: 'literal',
        helpModel: buildSchemaHelpModel('literal', 'literal'),
      },
      {
        sourceType: 'regex',
        command: 'regex',
        helpModel: buildSchemaHelpModel('regex', 'regex'),
      },
      ...getVisibleDomainCommands({
        commands: domainCommands,
        currentCommand: String(currentValue || '').trim(),
      }).map((command) => ({
        sourceType: 'domain',
        command,
        helpModel: buildSchemaHelpModel('domain', command),
      })),
      ...fakerCommands.map((command) => ({
        sourceType: 'faker',
        command,
        helpModel: buildSchemaHelpModel('faker', command),
      })),
    ],
    getVisibleDomainCommands: (currentValue = '') =>
      getVisibleDomainCommands({
        commands: domainCommands,
        currentCommand: String(currentValue || '').trim(),
      }),
    fakerCommands,
    sampleSchemaText: GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT,
    buildModeHelpHtml: ({ inTextMode }) =>
      buildSchemaModeHelpHtml({
        inTextMode,
        generateToFileHelpUrl: 'https://anywaydata.com/docs/test-data/generate-to-file',
      }),
    validateSchemaRows: (rows) =>
      validateSharedSchemaRows({
        schemaRows: rows,
        schemaRowsToDataRules,
      }),
  };
}

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

  prefixElementIds(root, storyPrefix);
  queuePreviewData(component);

  root.__storybookCleanup = () => {
    component?.destroy();
  };
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
          'Shows the composed page when pairwise generation is available and the preview feature already has output text and preview rows. The page-level story should still expose the real schema help affordance and a visible preview table, not just the surrounding shells.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previewGridRegion = await canvas.findByLabelText('Data Table Preview Grid');
    await expect(await canvas.findByRole('button', { name: 'Generate Pairwise' })).toBeVisible();
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
    await expect(await canvas.findByRole('button', { name: 'Generate Pairwise' })).toBeVisible();
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
