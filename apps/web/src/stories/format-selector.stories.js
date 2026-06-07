import { expect, userEvent, within } from 'storybook/test';
import { createFormatSelectorComponent } from '../../../../packages/core-ui/js/gui_components/app/format-selector/index.js';

function renderFormatSelectorStory(args) {
  const root = document.createElement('section');
  const selectorRoot = document.createElement('div');
  selectorRoot.className = 'conversionTypes';

  const subtasksRoot = document.createElement('div');
  subtasksRoot.className = 'conversionSubtasks';
  subtasksRoot.style.display = 'none';

  root.append(selectorRoot, subtasksRoot);

  const component = createFormatSelectorComponent({
    root: selectorRoot,
    subtasksRoot,
    documentObj: document,
    props: {
      selectedFormat: args.selectedFormat,
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Export Formats/Format Selector',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'FormatSelector is the Phase 6 app-side component that owns the import/export format tabs and grouped code/unit-test subtask selection. The help icon next to the tabs explains when grouped subtabs appear and links reviewers to the Data Formats docs.',
      },
    },
  },
  args: {
    selectedFormat: 'csv',
  },
  argTypes: {
    selectedFormat: {
      control: 'select',
      options: ['csv', 'json', 'python', 'jest'],
    },
  },
  render: renderFormatSelectorStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Direct-format view with the core export tabs visible.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Show help' })).toHaveAttribute(
      'data-help',
      'export-format-tabs-help'
    );
    await userEvent.click(canvas.getByRole('link', { name: 'JSON' }));
    await expect(
      canvasElement.querySelector('[data-role="format-main-tab-item"][data-active-format="true"]')
    ).toHaveAttribute('data-tab-id', 'json');
  },
};

export const Code = {
  args: {
    selectedFormat: 'python',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grouped code-format view showing the programming-language subtask list under the Code top tab.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'JavaScript' }));
    await expect(
      canvasElement.querySelector('[data-role="format-subtask-item"][data-active-format="true"]')
    ).toHaveAttribute('data-type', 'javascript');
    await expect(
      canvasElement.querySelector('[data-role="format-main-tab-item"][data-active-main-tab="true"]')
    ).toHaveAttribute('data-tab-id', 'code');
  },
};

export const CodeUnitTest = {
  args: {
    selectedFormat: 'jest',
  },
  parameters: {
    docs: {
      description: {
        story: 'Grouped unit-test format view showing the code-unit-test subtask list.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'Python' }));
    await expect(
      canvasElement.querySelector('[data-role="format-subtask-item"][data-active-format="true"]')
    ).toHaveAttribute('data-type', 'pytest');
    await expect(
      canvasElement.querySelector('[data-role="format-main-tab-item"][data-active-main-tab="true"]')
    ).toHaveAttribute('data-tab-id', 'code-unit-test');
  },
};
