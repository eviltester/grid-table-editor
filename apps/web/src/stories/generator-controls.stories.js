import { expect, userEvent, within } from 'storybook/test';
import { createGeneratorControlsComponent } from '../../../../packages/core-ui/js/gui_components/generator/controls/index.js';

function createFormatGroups() {
  return {
    core: [
      { type: 'csv', label: 'CSV' },
      { type: 'json', label: 'JSON' },
      { type: 'markdown', label: 'Markdown' },
    ],
    code: [{ type: 'python', label: 'Python' }],
    unitTest: [{ type: 'jest', label: 'Jest' }],
  };
}

function renderGeneratorControlsStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Generator controls story');

  const heading = document.createElement('h1');
  heading.textContent = 'Generator controls';
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

  const eventLog = document.createElement('pre');
  eventLog.setAttribute('data-role', 'event-log');
  eventLog.setAttribute('aria-label', 'Interaction log');
  eventLog.style.marginTop = '0.75rem';
  eventLog.style.padding = '0.5rem';
  eventLog.style.background = '#f3f4f6';
  eventLog.style.whiteSpace = 'pre-wrap';
  eventLog.textContent = 'No interactions yet.';

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'Generator controls example');
  root.appendChild(componentRoot);
  root.appendChild(eventLog);

  const log = (message) => {
    eventLog.textContent = message;
  };

  const component = createGeneratorControlsComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      selectedFormat: args.selectedFormat,
      currentOptions: args.currentOptions,
      pairwiseVisible: args.pairwiseVisible,
      exportEncodingSettings: args.exportEncodingSettings,
    },
    services: {
      getOutputFormatGroups: createFormatGroups,
      canExportFormat: () => true,
    },
    callbacks: {
      onFormatChanged: (value) => log(`format:${value}`),
      onApplyOptions: ({ sanitized }) => log(`apply:${sanitized.outputFormat}`),
      onGenerateData: () => log('generate:data'),
      onGeneratePairwise: () => log('generate:pairwise'),
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/Generator/Controls',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GeneratorControls owns the generator page control surface: row count, output format, format options, generate actions, pairwise visibility, and the shared status surface. This is the first page-level generator feature extracted from the old host wiring.',
      },
    },
  },
  args: {
    selectedFormat: 'csv',
    currentOptions: { options: { header: true, quoteChar: '"' } },
    pairwiseVisible: false,
    exportEncodingSettings: {
      lineEnding: 'lf',
      includeBom: false,
    },
  },
  argTypes: {
    selectedFormat: {
      control: 'select',
      options: ['csv', 'json', 'markdown', 'python', 'jest'],
      description: 'Currently selected output format.',
    },
    currentOptions: {
      control: false,
      description: 'Current format options passed through to the shared FormatOptionsPanel.',
    },
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the pairwise action button is visible for the current schema state.',
    },
    exportEncodingSettings: {
      control: false,
      description: 'File-only export encoding settings used for generated downloads.',
    },
  },
  render: renderGeneratorControlsStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the default generator control surface with CSV selected. Try changing the output format, open the Settings menu to inspect file export defaults, and then click Generate Data to see the small event log update.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByLabelText('Output Format'), 'json');
    await expect(canvas.getByText('format:json')).toBeTruthy();

    await userEvent.click(canvas.getByRole('button', { name: 'Generate Data' }));
    await expect(canvas.getByText('generate:data')).toBeTruthy();
  },
};

export const PairwiseReady = {
  args: {
    pairwiseVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the same control surface when the current schema is eligible for combination generation. The Generate Combinations button should be visible immediately and the interaction proves it emits the expected action.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Generate Combinations' }));
    await expect(canvas.getByText('generate:pairwise')).toBeTruthy();
  },
};

export const BusyWithWindowsEncoding = {
  args: {
    pairwiseVisible: true,
    exportEncodingSettings: {
      lineEnding: 'crlf',
      includeBom: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Reviewer-facing example of the composed controls with pairwise enabled and non-default file export transport settings. Open the Settings menu to confirm that CR/LF and BOM are configured for downloads without changing the on-page preview behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const settingsSummary = canvasElement.querySelector('[data-role="export-encoding-summary"]');
    await expect(settingsSummary).toBeTruthy();
    await userEvent.click(settingsSummary);
    await expect(canvas.getByLabelText('Line endings')).toHaveValue('crlf');
    await expect(canvas.getByRole('checkbox', { name: 'Include BOM' })).toBeChecked();
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeVisible();
  },
};
