import { expect, userEvent, within } from 'storybook/test';
import { createPopulationActionsComponent } from '../../../../packages/core-ui/js/gui_components/app/population-actions/index.js';

function renderPopulationActionsStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const componentRoot = document.createElement('div');
  componentRoot.setAttribute('aria-label', 'Population actions example');

  const result = document.createElement('output');
  result.setAttribute('aria-label', 'Population action log');
  result.textContent = 'No actions yet.';

  root.append(componentRoot, result);

  const component = createPopulationActionsComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      pairwiseVisible: args.pairwiseVisible,
      generateBusy: args.generateBusy,
      generatePairwiseBusy: args.generatePairwiseBusy,
      refreshPreviewBusy: args.refreshPreviewBusy,
    },
    callbacks: {
      onGenerate: () => {
        result.textContent = 'action:generate';
      },
      onGeneratePairwise: () => {
        result.textContent = 'action:generate-pairwise';
      },
      onRefreshPreview: () => {
        result.textContent = 'action:refresh-preview';
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'App/Data Population/Actions',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PopulationActions is the app-side action cluster that owns Generate, optional Generate Pairwise, and Refresh Text Preview. This Storybook entry documents that visible subcomponent directly instead of only showing it as part of the larger data-population panel.',
      },
    },
  },
  args: {
    pairwiseVisible: false,
    generateBusy: false,
    generatePairwiseBusy: false,
    refreshPreviewBusy: false,
  },
  argTypes: {
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the Generate Pairwise button is shown.',
    },
    generateBusy: {
      control: 'boolean',
      description: 'Disables the Generate button when true.',
    },
    generatePairwiseBusy: {
      control: 'boolean',
      description: 'Disables the Generate Pairwise button when true.',
    },
    refreshPreviewBusy: {
      control: 'boolean',
      description: 'Disables the Refresh Text Preview button when true.',
    },
  },
  render: renderPopulationActionsStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the default action cluster with **Generate** and **Refresh Text Preview** available while pairwise generation stays hidden. Try each button and confirm the visible story log updates to the matching action.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate' })).toBeEnabled();
    await expect(canvas.queryByRole('button', { name: 'Generate Pairwise' })).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Refresh Text Preview' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Generate' }));
    await expect(canvas.getByText('action:generate')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh Text Preview' }));
    await expect(canvas.getByText('action:refresh-preview')).toBeVisible();
  },
};

export const PairwiseAvailable = {
  args: {
    pairwiseVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Documents the alternate visible state where pairwise generation is available. Use **Generate Pairwise** and confirm the story log records the pairwise action rather than a generic generate event.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate Pairwise' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Generate Pairwise' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Generate Pairwise' }));
    await expect(canvas.getByText('action:generate-pairwise')).toBeVisible();
  },
};

export const BusyStates = {
  args: {
    pairwiseVisible: true,
    generateBusy: true,
    generatePairwiseBusy: true,
    refreshPreviewBusy: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the review state where all three actions are present but currently busy. Reviewers should see each button disabled immediately, which makes the component-state contract obvious without needing page-level runtime wiring.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Generate Pairwise' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Refresh Text Preview' })).toBeDisabled();
  },
};
