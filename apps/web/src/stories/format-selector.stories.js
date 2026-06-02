import { expect, userEvent, within } from 'storybook/test';
import { createFormatSelectorComponent } from '../../../../packages/core-ui/js/gui_components/app/format-selector/index.js';

function renderFormatSelectorStory(args) {
  const root = document.createElement('section');
  root.innerHTML = `
    <div id="selectorRoot" class="conversionTypes"></div>
    <div id="subtasksRoot" class="conversionSubtasks" style="display:none;"></div>
  `;
  const component = createFormatSelectorComponent({
    root: root.querySelector('#selectorRoot'),
    subtasksRoot: root.querySelector('#subtasksRoot'),
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
          'FormatSelector is the Phase 6 app-side component that owns the import/export format tabs and grouped code/unit-test subtask selection.',
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
    await userEvent.click(canvas.getByRole('link', { name: 'JSON' }));
    await expect(canvas.getByRole('link', { name: 'JSON' }).closest('.type-select')).toHaveClass('active-type');
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
    await expect(canvas.getByRole('link', { name: 'JavaScript' }).closest('.subtask-select')).toHaveClass(
      'active-type'
    );
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
    await expect(canvas.getByRole('link', { name: 'Python' }).closest('.subtask-select')).toHaveClass('active-type');
  },
};
