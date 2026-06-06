import { expect, userEvent, within } from 'storybook/test';
import { openMethodPickerModal } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/method-picker-modal.js';

const METHOD_PICKER_RECENT_STORAGE_KEY = 'anywaydata.method-picker.recent';

const METHOD_OPTIONS = [
  {
    sourceType: 'regex',
    command: 'regex',
    helpModel: {
      summary: 'Generate values from a regular expression.',
      heading: 'regex',
      examples: ['regex("[A-Z]{3}")'],
      params: [
        {
          name: 'pattern',
          type: 'string',
          description: 'Regular expression source used to build generated values.',
          example: '"[A-Z]{3}"',
        },
      ],
      exampleReturnValues: ['ABC', 'QWE'],
      docsUrl: 'https://anywaydata.com/docs/test-data/regex',
    },
  },
  {
    sourceType: 'faker',
    command: 'helpers.arrayElement',
    helpModel: {
      summary: 'Choose one item from the provided array.',
      heading: 'helpers.arrayElement',
      examples: ['helpers.arrayElement(["active", "paused", "deleted"])'],
      params: [
        {
          name: 'array',
          type: 'array',
          description: 'List of values to choose from.',
          example: '["active", "paused", "deleted"]',
        },
      ],
      exampleReturnValues: ['active', 'paused'],
      docsUrl: 'https://fakerjs.dev/api/helpers.html#arrayelement',
    },
  },
  {
    sourceType: 'domain',
    command: 'internet.password',
    helpModel: {
      summary: 'Generate a password-like string.',
      heading: 'internet.password',
      examples: ['internet.password()'],
      params: [],
      exampleReturnValues: ['hS9!wQ2'],
      docsUrl: 'https://fakerjs.dev/api/internet.html#password',
    },
  },
  {
    sourceType: 'domain',
    command: 'commerce.price',
    helpModel: {
      summary: 'Generate a commerce-style price.',
      heading: 'commerce.price',
      examples: ['commerce.price()'],
      params: [],
      exampleReturnValues: ['19.99'],
      docsUrl: 'https://fakerjs.dev/api/commerce.html#price',
    },
  },
];

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
    windowObj?.localStorage?.removeItem?.(METHOD_PICKER_RECENT_STORAGE_KEY);
  };

  return root;
}

const meta = {
  title: 'Shared/Method Picker Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for the shared method-picker dialog. This documents the visible selection overlay used by schema-definition flows without requiring page bootstrap.',
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
      description: 'Initial tab shown when the method-picker opens.',
    },
  },
  args: {
    title: 'Choose Method',
    currentCommand: 'helpers.arrayElement',
    initialTab: 'all',
  },
};

export default meta;

export const ChooseFakerMethod = {
  render: renderMethodPickerDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Open method picker**, choose **helpers.arrayElement**, then confirm with **Apply**. This shows the normal confirmed-selection path and the visible promise result beneath the trigger button.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.click(
      dialog.getByRole('button', { name: 'helpers.arrayElement Choose one item from the provided array. faker' })
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
          'Open the picker, type `commerce` into the filter, choose **commerce.price**, and apply. This demonstrates that the Storybook surface covers the searchable list behavior, not just a preselected tile.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open method picker' }));
    const dialog = within(document.body);
    await userEvent.type(dialog.getByRole('searchbox', { name: 'Filter methods' }), 'commerce');
    await userEvent.click(
      dialog.getByRole('button', { name: 'commerce.price Generate a commerce-style price. domain' })
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
          'Open the picker and choose **Cancel**. This demonstrates the dismissed overlay path and shows the `Cancelled` result in the story output.',
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
