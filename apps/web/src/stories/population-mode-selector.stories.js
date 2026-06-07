import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, userEvent, within } from 'storybook/test';
import { createPopulationModeSelectorComponent } from '../../../../packages/core-ui/js/gui_components/app/population-mode-selector/index.js';

function renderPopulationModeSelectorStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const componentRoot = document.createElement('div');
  componentRoot.setAttribute('aria-label', 'Population mode selector example');

  const result = document.createElement('output');
  result.setAttribute('aria-label', 'Population mode change log');
  result.textContent = 'No selection changes yet.';

  root.append(componentRoot, result);

  const component = createPopulationModeSelectorComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      name: args.name,
      selectedMode: args.selectedMode,
      options: [
        { value: 'new-table', label: 'New Table' },
        { value: 'amend-table', label: 'Amend Table' },
        { value: 'amend-selected', label: 'Amend Selected' },
      ],
    },
    callbacks: {
      onChange: (mode) => {
        result.textContent = `selected:${mode}`;
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'App/Data Population/Mode Selector',
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
          React.createElement(Canvas, { of: SwitchToAmendSelected }),
          React.createElement(Canvas, { of: StartsInAmendTableMode })
        ),
      description: {
        component:
          'PopulationModeSelector is the app-side component that owns the New Table, Amend Table, and Amend Selected radio choice. This Storybook entry documents that visible subcomponent directly instead of only showing it inside the larger embedded test-data panel.',
      },
    },
  },
  args: {
    name: 'testDataGenerationMode',
    selectedMode: 'new-table',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Shared radio-group name used by the rendered mode inputs.',
    },
    selectedMode: {
      control: 'select',
      options: ['new-table', 'amend-table', 'amend-selected'],
      description: 'Initially selected population mode.',
    },
  },
  render: renderPopulationModeSelectorStory,
};

export default meta;

export const Default = {
  render: renderPopulationModeSelectorStory,
  parameters: {
    docs: {
      description: {
        story:
          'Default app-side mode-selector view. It starts in **New Table** mode and exposes the exact radio choices that the larger data-population panel composes around the schema and action surfaces.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'New Table' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Amend Table' })).not.toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Amend Selected' })).not.toBeChecked();
  },
};

export const SwitchToAmendSelected = {
  render: renderPopulationModeSelectorStory,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the emitted change flow. Choose **Amend Selected** and the story log updates so reviewers can confirm the component emits the selected mode instead of only repainting the checked radio.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Amend Selected' }));
    await expect(canvas.getByRole('radio', { name: 'Amend Selected' })).toBeChecked();
    await expect(canvas.getByText('selected:amend-selected')).toBeVisible();
  },
};

export const StartsInAmendTableMode = {
  args: {
    selectedMode: 'amend-table',
  },
  render: renderPopulationModeSelectorStory,
  parameters: {
    docs: {
      description: {
        story:
          'Documents the second important review state: the selector can be mounted already focused on **Amend Table**, which is how the larger panel reflects runtime-controlled mode changes.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Amend Table' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'New Table' })).not.toBeChecked();
  },
};
