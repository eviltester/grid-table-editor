import { expect, userEvent, within } from 'storybook/test';
import { createGeneratorOutputFormatSelectorComponent } from '../../../../packages/core-ui/js/gui_components/generator/output-format-selector/index.js';

function createFormatGroups() {
  return {
    core: [
      { type: 'csv', label: 'CSV' },
      { type: 'json', label: 'JSON' },
      { type: 'markdown', label: 'Markdown' },
    ],
    code: [
      { type: 'python', label: 'Python' },
      { type: 'javascript', label: 'JavaScript' },
    ],
    unitTest: [
      { type: 'jest', label: 'Jest' },
      { type: 'vitest', label: 'Vitest' },
    ],
  };
}

function renderGeneratorOutputFormatSelectorStory(args) {
  const root = document.createElement('section');
  root.setAttribute('aria-label', 'Generator output format selector story');

  const componentRoot = document.createElement('div');
  root.appendChild(componentRoot);

  const eventLog = document.createElement('pre');
  eventLog.setAttribute('data-role', 'event-log');
  eventLog.style.marginTop = '0.75rem';
  eventLog.style.padding = '0.5rem';
  eventLog.style.background = '#f3f4f6';
  eventLog.style.whiteSpace = 'pre-wrap';
  eventLog.textContent = 'No interactions yet.';
  root.appendChild(eventLog);

  const component = createGeneratorOutputFormatSelectorComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      selectedFormat: args.selectedFormat,
    },
    services: {
      getOutputFormatGroups: createFormatGroups,
      canExportFormat: (type) => !args.unsupportedFormats.includes(type),
    },
    callbacks: {
      onFormatChange: (value) => {
        eventLog.textContent = `format:${value}`;
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/Generator/Output Format Selector',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GeneratorOutputFormatSelector is the focused visible format-choice surface extracted from GeneratorControls. It owns only the labeled select, supported-format filtering, and emitted selection changes, while GeneratorControls continues to own row count, actions, options, and status composition.',
      },
    },
  },
  args: {
    selectedFormat: 'csv',
    unsupportedFormats: [],
  },
  argTypes: {
    selectedFormat: {
      control: 'select',
      options: ['csv', 'json', 'markdown', 'python', 'javascript', 'jest', 'vitest'],
      description: 'Currently selected output format.',
    },
    unsupportedFormats: {
      control: 'check',
      options: ['csv', 'json', 'markdown', 'python', 'javascript', 'jest', 'vitest'],
      description: 'Formats removed from the selector because the current exporter cannot support them.',
    },
  },
  render: renderGeneratorOutputFormatSelectorStory,
};

export default meta;

export const CoreFormats = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the selector focused on the core export family. Change the selected format and watch the small log update to confirm the component emits the new choice.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByLabelText('Output Format'), 'json');
    await expect(canvas.getByText('format:json')).toBeTruthy();
  },
};

export const CodeFormats = {
  args: {
    selectedFormat: 'javascript',
    unsupportedFormats: ['vitest'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the selector with code-family formats available. Reviewers should still see the core group first, then the code group, and can switch into a code format directly.',
      },
    },
  },
};

export const UnitTestFormats = {
  args: {
    selectedFormat: 'jest',
    unsupportedFormats: ['python', 'javascript'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the selector with unit-test formats available while some code formats are filtered out. This makes the grouped opt-in filtering behavior easier to review without the larger controls surface.',
      },
    },
  },
};

export const UnsupportedFiltering = {
  args: {
    selectedFormat: 'csv',
    unsupportedFormats: ['python', 'javascript', 'jest', 'vitest'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the review state where unsupported formats are filtered out entirely. Reviewers should only see the remaining supported entries rather than disabled dead options.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = Array.from(canvas.getByLabelText('Output Format').querySelectorAll('option')).map(
      (option) => option.value
    );
    await expect(options).toEqual(['csv', 'json', 'markdown']);
  },
};
