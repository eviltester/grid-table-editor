import { expect, userEvent, waitFor, within } from 'storybook/test';
import RandExp from 'randexp';
import { faker } from '@faker-js/faker';
import {
  schemaTextToDataRules,
  dataRulesToSchemaText,
  schemaRowsToDataRules,
} from '@anywaydata/core/data_generation/schema-rules-adapter.js';
import { createSharedSchemaDefinitionComponent } from '../../../../packages/core-ui/js/gui_components/shared/schema-definition/index.js';
import {
  identifyFakerCommands,
  getMethodPickerOptions,
  getFakerCommands,
  getDomainCommands,
} from '../../../../packages/core-ui/js/gui_components/app/test-data-grid/schema/index.js';
import {
  TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
  mapDataRuleToSchemaRow,
  validateSchemaRows as validateSharedSchemaRows,
} from '../../../../packages/core-ui/js/gui_components/shared/test-data/schema/index.js';
import { getVisibleDomainCommands as getVisibleDomainCommandsForStory } from '../../../../packages/core-ui/js/gui_components/shared/test-data/help/index.js';

let storyInstanceCounter = 0;

function createIds(prefix) {
  storyInstanceCounter += 1;
  return {
    rows: `${prefix}-rows-${storyInstanceCounter}`,
    textContainer: `${prefix}-text-container-${storyInstanceCounter}`,
    text: `${prefix}-text-${storyInstanceCounter}`,
    addButton: `${prefix}-add-${storyInstanceCounter}`,
    toggleButton: `${prefix}-toggle-${storyInstanceCounter}`,
    helpIcon: `${prefix}-help-${storyInstanceCounter}`,
    error: `${prefix}-error-${storyInstanceCounter}`,
  };
}

function buildStoryHelpHtml({ inTextMode }) {
  if (inTextMode) {
    return `
      <p><strong>Edit as Schema</strong></p>
      <p>Switch back to row mode after reviewing or editing the text schema.</p>
      <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
    `;
  }

  return `
    <p><strong>Edit as Text</strong></p>
    <p>Switch to text mode when you want to inspect or paste the schema spec directly.</p>
    <button type="button" class="shared-schema-sample-button">Insert Example Schema</button>
  `;
}

function createBlankRowFactory(prefix = 'story-schema-row') {
  let counter = 0;
  return () => ({
    id: `${prefix}-${counter++}`,
    name: '',
    sourceType: 'regex',
    command: '',
    params: '',
    value: '',
    comments: '',
    leadingTextLines: [],
  });
}

function validateSchemaRows(schemaRows) {
  return validateSharedSchemaRows({
    schemaRows,
    schemaRowsToDataRules,
  });
}

function renderSharedSchemaDefinitionStory(args) {
  identifyFakerCommands();
  const fakerCommands = getFakerCommands().filter((command) => command !== 'RegEx' && command.startsWith('helpers.'));
  const domainCommands = getDomainCommands();
  const root = document.createElement('section');
  document.body.appendChild(root);
  const ids = createIds(args.idPrefix || 'shared-schema');
  const createBlankRow = createBlankRowFactory(args.idPrefix || 'story-schema-row');
  const component = createSharedSchemaDefinitionComponent({
    root,
    props: {
      headingText: args.headingText,
      ids,
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
      getMethodPickerOptions,
      getVisibleDomainCommands: (currentValue = '') =>
        getVisibleDomainCommandsForStory({
          commands: domainCommands,
          currentCommand: String(currentValue || '').trim(),
        }),
      fakerCommands,
      sampleSchemaText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
      buildModeHelpHtml: ({ inTextMode }) => buildStoryHelpHtml({ inTextMode }),
      validateSchemaRows,
    },
    callbacks: {
      onSchemaError: (message) => {
        const errorElement = root.querySelector(`#${ids.error}`);
        if (errorElement) {
          errorElement.textContent = message;
          errorElement.style.display = message ? 'inline-block' : 'none';
        }
      },
      onSchemaClear: () => {
        const errorElement = root.querySelector(`#${ids.error}`);
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      },
    },
    documentObj: document,
  });

  if (Array.isArray(args.initialRows) && args.initialRows.length > 0) {
    component.setRows(args.initialRows);
    component.render();
    component.syncTextFromRows();
  }

  if (args.startInTextMode === true) {
    component.toggleMode();
  }

  if (args.initialText) {
    const textArea = root.querySelector(`#${ids.text}`);
    textArea.value = args.initialText;
    component.syncFromText({
      showErrors: args.showErrors === true,
      force: args.startInTextMode !== true,
    });
  }

  root.__storybookCleanup = () => {
    component.destroy();
    root.remove();
  };
  return root;
}

function expectSchemaModeVisible(canvasElement) {
  const rows = canvasElement.querySelector('.generator-schema-rows');
  const textContainer = canvasElement.querySelector('.generator-schema-text');
  const addButton = canvasElement.querySelector('.generator-schema-footer button');
  const toggleButton = within(canvasElement).getByRole('button', { name: /edit as text/i });

  expect(rows?.style.display).toBe('flex');
  expect(textContainer?.style.display).toBe('none');
  expect(addButton).toBeVisible();
  expect(toggleButton).toBeVisible();
}

function expectTextModeVisible(canvasElement) {
  const rows = canvasElement.querySelector('.generator-schema-rows');
  const textContainer = canvasElement.querySelector('.generator-schema-text');
  const addButton = canvasElement.querySelector('.generator-schema-footer button');
  const toggleButton = within(canvasElement).getByRole('button', { name: /edit as schema/i });

  expect(rows?.style.display).toBe('none');
  expect(textContainer?.style.display).toBe('block');
  expect(addButton).not.toBeVisible();
  expect(toggleButton).toBeVisible();
}

async function expectVisibleSchemaHelpTooltip({ helpHeadingText }) {
  await waitFor(() => {
    const tooltipBox = Array.from(document.body.querySelectorAll('.tippy-box')).find((element) =>
      element.textContent?.includes(helpHeadingText)
    );
    expect(tooltipBox).not.toBeNull();
    expect(tooltipBox.textContent).toContain(helpHeadingText);
    expect(tooltipBox.textContent).toContain('Insert Example Schema');
  });
}

const meta = {
  title: 'Test Data Generation/Schema Definition',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SharedSchemaDefinition is the Phase 3 shared feature component for schema editing. It wraps the existing shared schema editor behavior behind the standard `Controller + View + createComponent` contract so page hosts can mount a complete schema-definition surface with a small harness and explicit dependencies.',
      },
    },
  },
  args: {
    headingText: 'Schema',
    idPrefix: 'schema-definition',
    initialRows: [],
    initialText: '',
    showErrors: false,
    startInTextMode: false,
  },
};

export default meta;

export const EmptySchema = {
  render: renderSharedSchemaDefinitionStory,
  parameters: {
    docs: {
      description: {
        story:
          'Default empty state. This is the smallest mount for the shared schema-definition component and should show one blank row plus the shared text-mode toggle and help icon.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    expectSchemaModeVisible(canvasElement);
    expect(canvasElement.querySelectorAll('.generator-schema-row').length).toBe(1);
    const helpIcon = canvasElement.querySelector('.helpicon[data-help="generator-schema-mode-help"]');
    await userEvent.hover(helpIcon);
    await expectVisibleSchemaHelpTooltip({ helpHeadingText: 'Edit as Text' });
    await userEvent.unhover(helpIcon);
  },
};

export const SampleSchema = {
  render: renderSharedSchemaDefinitionStory,
  args: {
    initialText: TEST_DATA_GRID_SAMPLE_SCHEMA_TEXT,
    showErrors: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sample schema state using the same example text shared elsewhere in the app. Reviewers can toggle to text mode and confirm the text/schema round-trip without page bootstrap.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    expectSchemaModeVisible(canvasElement);
    expect(canvasElement.querySelectorAll('.generator-schema-row').length).toBeGreaterThan(1);
  },
};

export const ValidationError = {
  render: renderSharedSchemaDefinitionStory,
  args: {
    initialText: 'Status\nenum(active,inactive)',
    showErrors: true,
    startInTextMode: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Validation error flow. This story starts in text mode with valid schema text, then the interaction example replaces it with invalid text and proves that switching back to schema mode surfaces the inline error.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openTextModeButton = canvas.getByRole('button', { name: /edit as text/i });
    await userEvent.click(openTextModeButton);
    const textArea = canvas.getByRole('textbox');
    const toggleButton = canvas.getByRole('button', { name: /edit as schema/i });
    await userEvent.clear(textArea);
    await userEvent.type(textArea, 'OnlyName');
    await userEvent.click(toggleButton);
    const status = canvas.getByRole('status');
    await expect(status.textContent.length).toBeGreaterThan(0);
  },
};

export const TextMode = {
  render: renderSharedSchemaDefinitionStory,
  args: {
    initialText: 'Status\nenum(active,inactive,pending)',
    showErrors: true,
    startInTextMode: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Text-mode focused state. This story is useful for reviewing the plain-text schema surface and then toggling back to row mode to confirm the parsed row representation.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    expectTextModeVisible(canvasElement);
    const textArea = within(canvasElement).getByRole('textbox');
    await expect(textArea.value).toContain('Status');
    await expect(textArea.value).toContain('enum(active,inactive,pending)');
    const helpIcon = canvasElement.querySelector('.helpicon[data-help="generator-schema-mode-help"]');
    await userEvent.hover(helpIcon);
    await expectVisibleSchemaHelpTooltip({ helpHeadingText: 'Edit as Schema' });
    await userEvent.unhover(helpIcon);
  },
};

export const PairwiseCapableEnumSchema = {
  render: renderSharedSchemaDefinitionStory,
  args: {
    initialRows: [
      {
        id: 'priority-row',
        name: 'Priority',
        sourceType: 'enum',
        command: '',
        params: '',
        value: 'high,medium,low',
        comments: '',
        leadingTextLines: [],
      },
      {
        id: 'status-row',
        name: 'Status',
        sourceType: 'enum',
        command: '',
        params: '',
        value: 'active,inactive,pending',
        comments: '',
        leadingTextLines: [],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pairwise-capable enum schema state. This mirrors the kind of valid multi-enum schema that can later drive pairwise generation at the page level.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    expectSchemaModeVisible(canvasElement);
    const sourceTypeSelects = canvasElement.querySelectorAll('[data-field="sourceType"]');
    expect(sourceTypeSelects.length).toBe(2);
    expect(Array.from(sourceTypeSelects).every((element) => element.value === 'enum')).toBe(true);
  },
};

export const CommandPicker = {
  render: renderSharedSchemaDefinitionStory,
  args: {
    initialRows: [
      {
        id: 'faker-row',
        name: 'Choice',
        sourceType: 'faker',
        command: 'helpers.arrayElement',
        params: '(["Ada","Bob"])',
        value: '',
        comments: '',
        leadingTextLines: [],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Command-picker state using the real shared method catalog. Reviewers can open the picker, filter methods, select one, and apply it back into the schema row without page bootstrap.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    expectSchemaModeVisible(canvasElement);
    const pickerButton = canvasElement.querySelector('[data-action="pick-command"]');
    expect(pickerButton).not.toBeNull();
    await userEvent.click(pickerButton);

    const dialog = within(document.body).getByRole('dialog', { name: /select schema method/i });
    const dialogScope = within(dialog);
    const searchInput = dialogScope.getByRole('searchbox', { name: /filter methods/i });
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'helpers.fake');

    const replacementTile = dialogScope.getByRole('button', { name: /helpers\.fake/i });
    await userEvent.click(replacementTile);
    await userEvent.click(dialogScope.getByRole('button', { name: /^apply$/i }));

    const commandInput = canvasElement.querySelector('[data-field="command"]');
    await expect(commandInput?.value).toBe('helpers.fake');
  },
};
