import { expect, within } from 'storybook/test';
import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createSchemaPanelComponent } from '../../../../packages/core-ui/js/gui_components/shared/schema-panel/index.js';
import { createAppSchemaDefinitionProps } from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-grid-schema-grid-controller.js';
import {
  createSchemaTextSyncState,
  initializeSchemaErrorDisplay,
} from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/test-data-grid-schema-text-sync.js';
import {
  FAKER_COMMANDS,
  getMethodPickerOptions,
  getVisibleDomainCommandOptions,
  identifyFakerCommands,
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
  const createBlankRow = () => createBlankSchemaRow(`test-data-schema-panel-story-row-${rowCounter++}`);

  return {
    ...createAppSchemaDefinitionProps({
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
    }),
    headingText: 'Schema Definition',
  };
}

function getSchemaErrorElement(rootElement) {
  return rootElement?.querySelector?.('[data-role="schema-error"]') || null;
}

function renderTestDataSchemaPanelStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Test data schema panel story');

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'Test data schema panel example');
  componentRoot.setAttribute('role', 'group');
  root.appendChild(componentRoot);

  const schemaTextSyncState = createSchemaTextSyncState();
  const component = createSchemaPanelComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      className: 'test-data-schema-edit-zone shared-schema-section',
      rootDataRole: 'test-data-schema-panel-root',
      schemaDefinitionRootDataRole: 'schema-definition-root',
      ariaLabel: 'Test data schema panel',
      schemaDefinitionProps: createSchemaDefinitionProps(schemaTextSyncState),
    },
    callbacks: {
      schemaDefinition: {
        onSchemaError: (message) => {
          schemaTextSyncState.schemaErrorDisplay?.show?.(message);
        },
        onSchemaClear: () => {
          schemaTextSyncState.schemaErrorDisplay?.clear?.();
        },
      },
    },
  });

  initializeSchemaErrorDisplay(schemaTextSyncState, {
    documentObj: document,
    getSchemaErrorElement: () => getSchemaErrorElement(componentRoot),
  });

  if (args.textMode) {
    component.getSchemaDefinition()?.toggleMode?.();
  }

  if (args.showSchemaError) {
    schemaTextSyncState.schemaErrorDisplay?.show?.('Example app schema error');
  }

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Shared/SchemaPanel/App Host',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SchemaPanel is the shared wrapper around the shared schema-definition component. This story shows the app-page host configuration, including the test-data schema edit-zone styling, without loading the full data population panel.',
      },
    },
  },
  args: {
    textMode: false,
    showSchemaError: false,
  },
  argTypes: {
    textMode: {
      control: 'boolean',
      description: 'Starts the shared schema definition in text mode for review.',
    },
    showSchemaError: {
      control: 'boolean',
      description: 'Shows the app schema error surface immediately for review.',
    },
  },
  render: renderTestDataSchemaPanelStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the app schema panel in its default row-editing state. Review the app edit-zone wrapper, schema row controls, and shared schema mode help without the surrounding generation toolbar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Schema Definition')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Insert field after this row' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Edit as Text' })).toBeVisible();
  },
};

export const TextMode = {
  args: {
    textMode: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the same app schema panel after switching to text mode. This makes the shared text editor visible while keeping the app-owned schema edit-zone wrapper in view.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Edit as Schema' })).toBeVisible();
    await expect(canvas.getByRole('textbox')).toBeVisible();
  },
};

export const WithSchemaError = {
  args: {
    showSchemaError: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the app schema panel with the schema error presenter already populated. This documents the app-side error surface used by schema text parsing and command validation flows.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Example app schema error')).toBeVisible();
  },
};
