import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createMethodHelpDisplay } from '../../../../packages/core-ui/js/gui_components/shared/method-picker-dialog/method-help-display.js';
import { createMethodList } from '../../../../packages/core-ui/js/gui_components/shared/method-picker-dialog/method-list.js';
import { createMethodNavigator } from '../../../../packages/core-ui/js/gui_components/shared/method-picker-dialog/method-navigator.js';
import { createMethodPickerDialog } from '../../../../packages/core-ui/js/gui_components/shared/method-picker-dialog/index.js';
import { RECENT_STORAGE_KEY } from '../../../../packages/core-ui/js/gui_components/shared/method-picker-dialog/method-picker-dialog-utils.js';
import { openMethodPickerModal } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js';
import { buildSchemaHelpModel } from '../../../../packages/core-ui/js/gui_components/shared/test-data/help/help-model-builder.js';

const METHOD_PICKER_STYLE_ID = 'storybook-method-picker-modal-styles-link';

const METHOD_OPTION_SPECS = Object.freeze([
  { sourceType: 'regex', command: 'regex', helpCommand: '' },
  { sourceType: 'faker', command: 'helpers.arrayElement', helpCommand: 'helpers.arrayElement' },
  { sourceType: 'domain', command: 'internet.password', helpCommand: 'internet.password' },
  { sourceType: 'domain', command: 'commerce.price', helpCommand: 'commerce.price' },
]);

function buildMethodOptions() {
  return METHOD_OPTION_SPECS.map(({ sourceType, command, helpCommand }) => ({
    sourceType,
    command,
    helpModel: buildSchemaHelpModel(sourceType, helpCommand),
  }));
}

const METHOD_OPTIONS = buildMethodOptions();
const TAB_SPECS = [
  { id: 'all', label: 'All' },
  { id: 'core', label: 'Core' },
  { id: 'domain:commerce', label: 'commerce' },
  { id: 'domain:internet', label: 'internet' },
  { id: 'faker', label: 'Faker' },
  { id: 'recent', label: 'Recently used' },
];

function ensureMethodPickerStyles(documentObj) {
  if (!documentObj?.head || documentObj.getElementById(METHOD_PICKER_STYLE_ID)) {
    return;
  }
  const link = documentObj.createElement('link');
  link.id = METHOD_PICKER_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = new URL(
    '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.css',
    import.meta.url
  ).href;
  documentObj.head.appendChild(link);
}

function createRootWithLog() {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = '<output data-role="story-log" aria-label="Method picker story log">No actions yet.</output>';
  return {
    root,
    log: root.querySelector('[data-role="story-log"]'),
  };
}

function renderNavigatorStory(args) {
  ensureMethodPickerStyles(document);
  const { root, log } = createRootWithLog();
  const host = document.createElement('div');
  root.prepend(host);
  let state = {
    searchTerm: args.searchTerm,
    activeTab: args.activeTab,
    tabSpecs: TAB_SPECS,
  };
  let component = null;
  component = createMethodNavigator({
    root: host,
    props: state,
    callbacks: {
      onSearchTermChange: (searchTerm) => {
        state = { ...state, searchTerm };
        log.textContent = `search:${searchTerm}`;
        args.onSearchTermChange?.(searchTerm);
        component.update(state);
      },
      onTabChange: (activeTab) => {
        state = { ...state, activeTab };
        log.textContent = `tab:${activeTab}`;
        args.onTabChange?.(activeTab);
        component.update(state);
      },
    },
  });
  root.__storybookCleanup = () => component.destroy();
  return root;
}

function renderListStory(args) {
  ensureMethodPickerStyles(document);
  const { root, log } = createRootWithLog();
  const host = document.createElement('section');
  root.prepend(host);
  let selectedCommand = args.selectedCommand;
  let component = null;
  component = createMethodList({
    root: host,
    props: {
      selectedCommand,
      options: METHOD_OPTIONS,
    },
    callbacks: {
      onSelectCommand: (command) => {
        selectedCommand = command;
        log.textContent = `selected:${command}`;
        args.onSelectCommand?.(command);
        component.update({ selectedCommand, options: METHOD_OPTIONS });
      },
    },
  });
  root.__storybookCleanup = () => component.destroy();
  return root;
}

function renderHelpDisplayStory(args) {
  ensureMethodPickerStyles(document);
  const root = document.createElement('section');
  const selectedOption = METHOD_OPTIONS.find((option) => option.command === args.selectedCommand) || METHOD_OPTIONS[0];
  const component = createMethodHelpDisplay({
    root,
    props: { selectedOption },
  });
  root.__storybookCleanup = () => component.destroy();
  return root;
}

function renderVisualMethodPickerDialogStory(args) {
  ensureMethodPickerStyles(document);
  const { root, log } = createRootWithLog();
  const frame = document.createElement('div');
  frame.setAttribute('data-role', 'visual-method-picker-frame');
  frame.style.position = 'relative';
  frame.style.minHeight = '780px';
  const overlayRoot = document.createElement('div');
  frame.appendChild(overlayRoot);
  root.prepend(frame);

  const component = createMethodPickerDialog({
    root: overlayRoot,
    documentObj: document,
    props: {
      title: args.title,
      options: METHOD_OPTIONS,
      currentCommand: args.currentCommand,
      initialTab: args.initialTab,
    },
    callbacks: {
      onApply: (selection) => {
        log.textContent = `action:apply:${selection.command}`;
        args.onApply?.(selection);
      },
      onCancel: ({ reason } = {}) => {
        log.textContent = `action:${reason || 'cancel'}`;
        if (reason === 'close') {
          args.onClose?.();
        } else if (reason === 'backdrop') {
          args.onBackdrop?.();
        } else {
          args.onCancel?.();
        }
      },
    },
  });
  overlayRoot.style.position = 'absolute';
  overlayRoot.style.inset = '0';
  root.__storybookCleanup = () => {
    component.destroy();
    document.defaultView?.localStorage?.removeItem?.(RECENT_STORAGE_KEY);
  };
  return root;
}

function renderMethodPickerDialogStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="open">Open method picker</button>
    </div>
    <output data-result>Pending</output>
  `;

  const result = root.querySelector('[data-result]');
  const windowObj = document.defaultView;

  const openDialog = async () => {
    const selection = await openMethodPickerModal({
      documentObj: document,
      windowObj,
      title: args.title,
      options: METHOD_OPTIONS,
      currentCommand: args.currentCommand,
      initialTab: args.initialTab,
    });
    result.textContent = selection ? `${selection.sourceType}:${selection.command}` : 'Cancelled';
  };

  root.querySelector('[data-action="open"]')?.addEventListener('click', openDialog);
  root.__storybookCleanup = () => {
    windowObj?.localStorage?.removeItem?.(RECENT_STORAGE_KEY);
  };

  return root;
}

const meta = {
  title: 'Shared/Method Picker Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () =>
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Title),
          React.createElement(Description),
          React.createElement(Controls),
          React.createElement(Canvas, { of: NavigatorDefault }),
          React.createElement(Canvas, { of: ListDefault }),
          React.createElement(Canvas, { of: HelpDisplayWithUsage }),
          React.createElement(Canvas, { of: VisualAlwaysOpen }),
          React.createElement(Canvas, { of: ChooseFakerMethod }),
          React.createElement(Canvas, { of: FilterAndChooseDomainMethod }),
          React.createElement(Canvas, { of: CancelMethodSelection })
        ),
      description: {
        component:
          'Component-backed Method Picker Dialog coverage. Navigator, list, help display, and composed dialog stories all mount the real MVC components; the service-flow stories still demonstrate the promise-based open/apply/cancel compatibility API.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title shown in the method-picker header.',
    },
    currentCommand: {
      control: 'text',
      description: 'Currently selected command when the picker opens.',
    },
    initialTab: {
      control: 'select',
      options: ['all', 'core', 'faker', 'domain:commerce', 'domain:internet', 'recent'],
      description: 'Initial tab shown when the picker opens.',
    },
    selectedCommand: {
      control: 'select',
      options: METHOD_OPTIONS.map((option) => option.command),
      description: 'Selected command for focused list/help stories.',
    },
    searchTerm: {
      control: 'text',
      description: 'Initial navigator search text for focused navigator stories.',
    },
    activeTab: {
      control: 'select',
      options: TAB_SPECS.map((tab) => tab.id),
      description: 'Initial navigator active tab for focused navigator stories.',
    },
    onApply: { table: { category: 'Events' } },
    onCancel: { table: { category: 'Events' } },
    onClose: { table: { category: 'Events' } },
    onBackdrop: { table: { category: 'Events' } },
    onSearchTermChange: { table: { category: 'Events' } },
    onTabChange: { table: { category: 'Events' } },
    onSelectCommand: { table: { category: 'Events' } },
  },
  args: {
    title: 'Choose Method',
    currentCommand: 'helpers.arrayElement',
    initialTab: 'all',
    selectedCommand: 'helpers.arrayElement',
    searchTerm: '',
    activeTab: 'all',
    onApply: fn(),
    onCancel: fn(),
    onClose: fn(),
    onBackdrop: fn(),
    onSearchTermChange: fn(),
    onTabChange: fn(),
    onSelectCommand: fn(),
  },
};

export default meta;

export const NavigatorDefault = {
  render: renderNavigatorStory,
  parameters: {
    docs: {
      description: {
        story:
          'Focused Method Navigator story. Type in the filter or switch tabs and watch the story log record the emitted component events.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filter methods' }), 'city');
    await expect(canvas.getByText('search:city')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Core' }));
    await expect(canvas.getByText('tab:core')).toBeVisible();
  },
};

export const ListDefault = {
  render: renderListStory,
  parameters: {
    docs: {
      description: {
        story:
          'Focused Method List story. It renders method tiles with the selected command highlighted and emits a selection event when a tile is chosen.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('option', {
        name: 'commerce.price Generates a price between min and max (inclusive). domain',
      })
    );
    await expect(canvas.getByText('selected:commerce.price')).toBeVisible();
  },
};

export const HelpDisplayWithUsage = {
  render: renderHelpDisplayStory,
  args: {
    selectedCommand: 'internet.password',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Focused Method Help Display story. It shows the selected method summary, schema heading, parameter tables, structured usage examples, return values, and docs link.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'internet.password' })).toBeVisible();
    await expect(canvas.getByText('Parameter Details')).toBeVisible();
    await expect(canvas.getByText('Usage Examples')).toBeVisible();
  },
};

export const VisualAlwaysOpen = {
  render: renderVisualMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Reviewer-facing composed dialog story. The dialog stays open while Apply, Cancel, and Close log the action that the component emitted.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();
    await expect(
      canvas.getByRole('option', {
        name: 'helpers.arrayElement Returns one random element from the supplied array. faker',
      })
    ).toHaveClass('is-selected');

    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('action:apply:helpers.arrayElement')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('action:cancel')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(canvas.getByText('action:close')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Choose Method' })).toBeVisible();
  },
};

export const ChooseFakerMethod = {
  render: renderMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click Open method picker, choose helpers.arrayElement, then confirm with Apply. This demonstrates the normal confirmed-selection promise path.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.click(
      dialog.getByRole('option', {
        name: 'helpers.arrayElement Returns one random element from the supplied array. faker',
      })
    );
    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('faker:helpers.arrayElement')).toBeVisible();
  },
};

export const FilterAndChooseDomainMethod = {
  render: renderMethodPickerDialogStory,
  args: {
    currentCommand: '',
    initialTab: 'all',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Open the picker, type commerce into the filter, choose commerce.price, and apply. This covers searchable list behavior through the compatibility service.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.type(dialog.getByRole('searchbox', { name: 'Filter methods' }), 'commerce');
    await userEvent.click(
      dialog.getByRole('option', { name: 'commerce.price Generates a price between min and max (inclusive). domain' })
    );
    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('domain:commerce.price')).toBeVisible();
  },
};

export const CancelMethodSelection = {
  render: renderMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Open the picker and choose Cancel. This demonstrates the dismissed overlay path and shows the Cancelled result in the story output.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('Cancelled')).toBeVisible();
  },
};
