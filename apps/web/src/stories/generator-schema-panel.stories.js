import { expect, within } from 'storybook/test';
import { faker } from '@faker-js/faker';
import RandExp from 'randexp';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createSchemaPanelComponent } from '../../../../packages/core-ui/js/gui_components/shared/schema-panel/index.js';
import { validateSchemaRows as validateSharedSchemaRows } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-editor-core.js';
import { getKnownFakerCommandsAlphabetical } from '../../../../packages/core-ui/js/gui_components/shared/faker-commands.js';
import { getKnownDomainCommandsAlphabetical } from '../../../../packages/core-ui/js/gui_components/shared/domain-commands.js';
import { buildSchemaModeHelpHtml } from '../../../../packages/core-ui/js/gui_components/shared/test-data/help/schema-mode-help-builder.js';
import { createGeneratorSchemaDefinitionSupport } from '../../../../packages/core-ui/js/gui_components/generator/schema-support/create-generator-schema-definition-support.js';
import { GENERATOR_DEFAULT_EXAMPLE_SCHEMA_TEXT } from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/schema-examples.js';

function createGeneratorSchemaStoryProps() {
  let rowCounter = 1;
  const fakerCommands = getKnownFakerCommandsAlphabetical().filter(
    (command) => command !== 'RegEx' && command.startsWith('helpers.')
  );
  const domainCommands = getKnownDomainCommandsAlphabetical();
  const createBlankRow = () => ({
    id: `generator-schema-panel-story-row-${rowCounter++}`,
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

function renderGeneratorSchemaPanelStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Generator schema panel story');

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'Generator schema panel example');
  componentRoot.setAttribute('role', 'group');
  root.appendChild(componentRoot);

  const component = createSchemaPanelComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      className: 'generator-schema',
      sectionId: 'generatorSchemaSection',
      sectionOrder: '2',
      ariaLabelledBy: 'generatorSchemaHeading',
      rootDataRole: 'generator-schema-panel-root',
      schemaDefinitionRootDataRole: 'generator-schema-definition-root',
      useTimedSchemaErrorDisplay: true,
      schemaErrorTimeoutMs: 5000,
      schemaDefinitionProps: createGeneratorSchemaStoryProps(),
    },
  });

  if (args.textMode) {
    component.getSchemaDefinition()?.toggleMode?.();
  }

  if (args.showSchemaError) {
    component.getSchemaErrorDisplay()?.show?.('Example schema error');
  }

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Shared/SchemaPanel/Generator Host',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SchemaPanel is the shared wrapper around the shared schema-definition component. This story shows the generator host configuration, including generator section styling and the timed schema-error presenter, without loading the full generator page.',
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
      description: 'Starts the shared schema definition in text mode instead of grid mode.',
    },
    showSchemaError: {
      control: 'boolean',
      description: 'Shows the timed generator schema error surface immediately for review.',
    },
  },
  render: renderGeneratorSchemaPanelStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the generator-specific schema section in its default grid-editing state. Review the schema heading, add-row affordances, and generator-specific help link without the controls or preview sections from the full generator page.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Schema')).toBeVisible();
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
          'Shows the generator schema panel with the shared schema definition already switched into text mode. This makes the generator-specific surrounding wrapper visible while the text-editing mode and its help copy are active immediately.',
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
          'Shows the generator schema panel with its timed schema-error surface already populated. This documents the generator-owned status wrapper that sits around the shared schema definition when generation-related schema validation fails.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Example schema error')).toBeVisible();
  },
};
