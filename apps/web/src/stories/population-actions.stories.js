import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
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
      generateLabel: args.generateLabel,
      generatePairwiseLabel: args.generatePairwiseLabel,
      generateHelpHtml: args.generateHelpHtml,
      generatePairwiseHelpHtml: args.generatePairwiseHelpHtml,
    },
    callbacks: {
      onGenerate: () => {
        args.onGenerate?.();
        result.textContent = 'action:generate';
      },
      onGeneratePairwise: () => {
        args.onGeneratePairwise?.();
        result.textContent = 'action:generate-secondary';
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Shared/Generation Actions',
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
          React.createElement(Canvas, { of: PairwiseAvailable }),
          React.createElement(Canvas, { of: BusyStates })
        ),
      description: {
        component:
          'PopulationActions is the reusable action cluster shared by the app test-data panel and the generator controls. It owns the Generate action plus an optional secondary combination action, with host-configured labels and help tippies for each action.',
      },
    },
  },
  args: {
    pairwiseVisible: false,
    generateBusy: false,
    generatePairwiseBusy: false,
    generateLabel: 'Generate',
    generatePairwiseLabel: 'Generate Combinations',
    generateHelpHtml:
      '<p>Generate data from the current schema directly into the grid.</p><p><a class="helplink" href="/docs/test-data/test-data-generation" target="anywaydatadocs">Test-data generation docs</a></p>',
    generatePairwiseHelpHtml:
      '<p>Generate n-wise combinations from enum columns in the current schema directly into the grid.</p><p><a class="helplink" href="/docs/test-data/n-wise-testing" target="_blank" rel="noopener noreferrer">N-wise generation docs</a></p>',
    onGenerate: fn(),
    onGeneratePairwise: fn(),
  },
  argTypes: {
    pairwiseVisible: {
      control: 'boolean',
      description: 'Whether the optional secondary action button is shown.',
    },
    generateBusy: {
      control: 'boolean',
      description: 'Disables the Generate button when true.',
    },
    generatePairwiseBusy: {
      control: 'boolean',
      description: 'Disables the optional secondary action button when true.',
    },
    generateLabel: {
      control: 'text',
      description: 'Primary action label shown on the first action button.',
    },
    generatePairwiseLabel: {
      control: 'text',
      description: 'Secondary action label shown when the optional action is visible.',
    },
    generateHelpHtml: {
      control: 'text',
      description: 'Raw HTML used as the Generate help tippy content, including links.',
    },
    generatePairwiseHelpHtml: {
      control: 'text',
      description: 'Raw HTML used as the secondary action help tippy content, including links.',
    },
    onGenerate: {
      description: 'Storybook action fired when the primary Generate button is clicked.',
      table: { category: 'Events' },
    },
    onGeneratePairwise: {
      description: 'Storybook action fired when the secondary action button is clicked.',
      table: { category: 'Events' },
    },
  },
  render: renderPopulationActionsStory,
};

export default meta;

export const Default = {
  render: renderPopulationActionsStory,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the default app-style action cluster with the generator-style icon button and a host-configured help tippy that talks about generating into the grid. Click **Generate** and confirm the story log updates.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
    await expect(canvas.queryByRole('button', { name: 'Generate Combinations' })).toBeNull();
    await expect(canvas.getAllByRole('button', { name: /show .* help/i })).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Generate', exact: true }));
    await expect(canvas.getByText('action:generate')).toBeVisible();
  },
};

export const PairwiseAvailable = {
  args: {
    pairwiseVisible: true,
  },
  render: renderPopulationActionsStory,
  parameters: {
    docs: {
      description: {
        story:
          'Documents the alternate visible state where the combinations action is available. Use **Generate Combinations** and confirm both the story log and the Actions panel record the secondary action. This is the same shared visual contract used by the generator page, with host-specific help HTML supplied by the embedding surface.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeEnabled();
    await expect(canvas.getAllByRole('button', { name: /show .* help/i })).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Generate Combinations' }));
    await expect(canvas.getByText('action:generate-secondary')).toBeVisible();
  },
};

export const BusyStates = {
  args: {
    pairwiseVisible: true,
    generateBusy: true,
    generatePairwiseBusy: true,
  },
  render: renderPopulationActionsStory,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the review state where both actions are present but currently busy. Reviewers should see each button disabled immediately, with both `disabled` and `aria-disabled="true"` applied so the busy state is explicit in both interaction and accessibility terms.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Generate', exact: true })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Generate', exact: true })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    await expect(canvas.getByRole('button', { name: 'Generate Combinations' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  },
};
