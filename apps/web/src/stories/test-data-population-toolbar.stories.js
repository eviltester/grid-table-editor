import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createTestDataPopulationToolbarComponent } from '../../../../packages/core-ui/js/gui_components/app/test-data-population-toolbar/index.js';

function renderToolbarStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const toolbarRoot = document.createElement('div');
  const log = document.createElement('output');
  log.setAttribute('aria-label', 'Test data population toolbar log');
  log.textContent = 'No actions yet.';

  if (args.maxWidth) {
    toolbarRoot.style.maxWidth = args.maxWidth;
  }

  root.append(toolbarRoot, log);

  const component = createTestDataPopulationToolbarComponent({
    root: toolbarRoot,
    documentObj: document,
    props: {
      selectedMode: args.selectedMode,
      pairwiseVisible: args.pairwiseVisible,
      generateBusy: args.generateBusy,
      generatePairwiseBusy: args.generatePairwiseBusy,
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
    },
    callbacks: {
      onGenerate: () => {
        args.onGenerate?.();
        log.textContent = 'action:generate';
      },
      onGeneratePairwise: () => {
        args.onGeneratePairwise?.();
        log.textContent = 'action:generate-secondary';
      },
      onModeChange: (mode) => {
        args.onModeChange?.(mode);
        log.textContent = `selected:${mode}`;
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'App/Data Population/Test Data Population Toolbar',
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
          React.createElement(Canvas, { of: Default }),
          React.createElement(Canvas, { of: PairwiseAndBusy }),
          React.createElement(Canvas, { of: NarrowWrapLayout })
        ),
      description: {
        component:
          'TestDataPopulationToolbar is the composed MVC surface for the app-side generation actions, row count, and mode selector. Storybook now documents this visible layout seam directly instead of only through the full test-data panel.',
      },
    },
  },
  args: {
    selectedMode: 'new-table',
    pairwiseVisible: false,
    generateBusy: false,
    generatePairwiseBusy: false,
    rowCount: 1,
    maxWidth: '',
    onGenerate: fn(),
    onGeneratePairwise: fn(),
    onModeChange: fn(),
  },
  argTypes: {
    selectedMode: {
      control: 'select',
      options: ['new-table', 'amend-table', 'amend-selected'],
      description: 'Initially selected app population mode.',
    },
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the shared combinations action is visible.',
    },
    generateBusy: {
      control: 'boolean',
      description: 'Disables the primary Generate button when true.',
    },
    generatePairwiseBusy: {
      control: 'boolean',
      description: 'Disables the combinations action when true.',
    },
    rowCount: {
      control: 'number',
      description: 'Initial count shown by the shared row-count control.',
    },
    maxWidth: {
      control: 'text',
      description: 'Optional max-width to make toolbar wrapping behavior obvious in Storybook.',
    },
  },
  render: renderToolbarStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the default horizontal toolbar composition: Generate action, row count, and mode selector on one line. Try **Generate** and confirm the log updates without needing the larger schema editor panel around it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(canvas.getByRole('spinbutton', { name: 'How Many?' })).toHaveValue(1);
    await expect(canvas.getByRole('radio', { name: 'New Table' })).toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: 'Generate' }));
    await expect(canvas.getByText('action:generate')).toBeVisible();
  },
};

export const PairwiseAndBusy = {
  args: {
    pairwiseVisible: true,
    generateBusy: true,
    generatePairwiseBusy: true,
    selectedMode: 'amend-selected',
    rowCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the composed toolbar with combinations generation visible and both actions busy. This keeps the reviewer-facing horizontal layout intact while making the disabled app state obvious.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeDisabled();
    await expect(canvas.getByRole('radio', { name: 'Amend Selected' })).toBeChecked();
  },
};

export const NarrowWrapLayout = {
  args: {
    pairwiseVisible: true,
    maxWidth: '22rem',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains the toolbar width so the composed layout has to wrap. This makes the responsive toolbar contract visible without needing the whole embedded panel around it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Amend Table' }));
    await expect(canvas.getByText('selected:amend-table')).toBeVisible();
  },
};
