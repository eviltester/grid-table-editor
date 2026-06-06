import { expect, userEvent, within } from 'storybook/test';
import { createDataPopulationPanelComponent } from '../../../../packages/core-ui/js/gui_components/app/data-population-panel/index.js';
import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createAppSchemaDefinitionProps } from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-grid-schema-grid-controller.js';
import {
  createSchemaTextSyncState,
  initializeSchemaErrorDisplay,
} from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-grid-schema-text-sync.js';
import {
  identifyFakerCommands,
  getMethodPickerOptions,
  getVisibleDomainCommandOptions,
  FAKER_COMMANDS,
} from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-command-catalog.js';
import { validateSchemaRows as validateSharedSchemaRows } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-editor-core.js';
import { mapDataRuleToSchemaRow } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-row-mapper.js';

function createBlankSchemaRow(id, overrides = {}) {
  return {
    id,
    name: '',
    sourceType: 'regex',
    command: '',
    params: '',
    value: '',
    comments: '',
    leadingTextLines: [],
    ...overrides,
  };
}

function createSchemaDefinitionProps(schemaTextSyncState) {
  identifyFakerCommands();
  let rowCounter = 1;
  const createBlankRow = () => createBlankSchemaRow(`story-row-${rowCounter++}`);

  return createAppSchemaDefinitionProps({
    schemaTextToDataRules,
    dataRulesToSchemaText,
    schemaTextSyncState,
    updatePairwiseButtonVisibility: () => {},
    faker,
    RandExp,
    getMethodPickerOptions,
    fakerCommands: FAKER_COMMANDS.filter((command) => command !== 'RegEx' && command.startsWith('helpers.')),
    getVisibleDomainCommandOptions,
    mapRuleToRow: (rule, leadingTextLines = []) => {
      const row = mapDataRuleToSchemaRow(rule, {
        createBlankSchemaRow: createBlankRow,
      });
      row.leadingTextLines = Array.isArray(leadingTextLines) ? leadingTextLines.slice() : [];
      return row;
    },
    validateSchemaRows: (schemaRows) =>
      validateSharedSchemaRows({
        schemaRows,
        schemaRowsToDataRules,
      }),
  });
}

function getSchemaErrorElement(rootElement) {
  return rootElement?.querySelector?.('[data-role="schema-error"]') || null;
}

function renderDataPopulationPanelStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Data population panel story');

  const heading = document.createElement('h1');
  heading.textContent = 'Data population panel';
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

  const log = document.createElement('pre');
  log.setAttribute('aria-label', 'Data population interaction log');
  log.style.marginTop = '0.75rem';
  log.style.padding = '0.5rem';
  log.style.background = '#f3f4f6';
  log.style.whiteSpace = 'pre-wrap';
  log.textContent = 'No actions yet.';

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'Data population panel example');
  root.appendChild(componentRoot);
  root.appendChild(log);

  const schemaTextSyncState = createSchemaTextSyncState();

  const component = createDataPopulationPanelComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      selectedMode: args.selectedMode,
      pairwiseVisible: args.pairwiseVisible,
      modeOptions: [
        { value: 'new-table', label: 'New Table' },
        { value: 'amend-table', label: 'Amend Table' },
        { value: 'amend-selected', label: 'Amend Selected' },
      ],
      rowCountProps: {
        label: 'How Many?',
        min: 1,
        step: 1,
        value: args.rowCount,
        normalizeOnInput: true,
      },
      schemaDefinitionProps: createSchemaDefinitionProps(schemaTextSyncState),
    },
    callbacks: {
      onGenerate: () => {
        log.textContent = 'action:generate';
      },
      onGeneratePairwise: () => {
        log.textContent = 'action:generate-pairwise';
      },
      onRefreshPreview: () => {
        log.textContent = 'action:refresh-preview';
      },
      schemaDefinition: {
        onSchemaError: (message) => {
          const errorElement = getSchemaErrorElement(componentRoot);
          if (errorElement) {
            errorElement.textContent = String(message || '');
          }
        },
        onSchemaClear: () => {
          const errorElement = getSchemaErrorElement(componentRoot);
          if (errorElement) {
            errorElement.textContent = '';
          }
        },
      },
    },
  });

  initializeSchemaErrorDisplay(schemaTextSyncState);

  if (Array.isArray(args.schemaRows) && args.schemaRows.length > 0) {
    component.getSchemaDefinition()?.setRows?.(args.schemaRows);
    component.getSchemaDefinition()?.render?.();
    component.getSchemaDefinition()?.syncTextFromRows?.();
  }

  if (args.textMode) {
    component.getSchemaDefinition()?.setTextMode?.(true);
  }

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/TestDataGenerationPanel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DataPopulationPanel owns the embedded app-page test-data surface: generation actions, row count, mode selection, status surface, and shared schema definition. This replaces the older host/binder-driven panel shell with a component boundary that can be reviewed directly in Storybook.',
      },
    },
  },
  args: {
    selectedMode: 'new-table',
    pairwiseVisible: false,
    rowCount: 1,
    schemaRows: [],
    textMode: false,
  },
  argTypes: {
    selectedMode: {
      control: 'select',
      options: ['new-table', 'amend-table', 'amend-selected'],
      description: 'Selected population mode shown by the mode selector.',
    },
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the Generate Pairwise action is available.',
    },
    rowCount: {
      control: 'number',
      description: 'Initial count shown in the shared row-count control.',
    },
    schemaRows: {
      control: false,
      description: 'Optional schema rows seeded into the shared schema-definition component.',
    },
    textMode: {
      control: 'boolean',
      description: 'Whether the schema definition starts in text mode.',
    },
  },
  render: renderDataPopulationPanelStory,
};

export default meta;

export const NewTableMode = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the embedded panel in its default new-table mode. Review the shared row-count control, schema editor, and primary Generate action without pairwise generation enabled. Try Generate and Refresh Text Preview to confirm the composed panel callbacks fire through the interaction log.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(canvas.getByLabelText('How Many?')).toHaveValue(1);
    await expect(canvas.getByRole('radio', { name: 'New Table' })).toBeChecked();
    await expect(canvas.queryByRole('button', { name: 'Generate Pairwise' })).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Generate' }));
    await expect(canvas.getByText('action:generate')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh Text Preview' }));
    await expect(canvas.getByText('action:refresh-preview')).toBeVisible();
  },
};

export const AmendTableMode = {
  args: {
    selectedMode: 'amend-table',
    rowCount: 8,
    schemaRows: [createBlankSchemaRow('row-1', { name: 'Status', sourceType: 'enum', params: 'active,inactive' })],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the amend-table mode with a seeded schema row. This is the app-side mode where generated values are applied across the current table rather than building a new one.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Amend Table' })).toBeChecked();
    await expect(canvas.getByLabelText('How Many?')).toHaveValue(8);
    await expect(canvas.getAllByPlaceholderText('Column Name')[0]).toHaveValue('Status');
  },
};

export const AmendSelectedMode = {
  args: {
    selectedMode: 'amend-selected',
    pairwiseVisible: true,
    rowCount: 3,
    schemaRows: [
      createBlankSchemaRow('row-1', { name: 'Status', sourceType: 'enum', params: 'active,inactive' }),
      createBlankSchemaRow('row-2', { name: 'Priority', sourceType: 'enum', params: 'high,low' }),
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the amend-selected mode with pairwise generation available. This is the strongest Storybook proxy for the app path that amends selected rows with an enum-driven schema. Use Generate Pairwise to confirm the composed panel action flows through the shared interaction log.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Amend Selected' })).toBeChecked();
    await expect(canvas.getByRole('button', { name: 'Generate Pairwise' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Generate Pairwise' }));
    await expect(canvas.getByText('action:generate-pairwise')).toBeVisible();
  },
};
