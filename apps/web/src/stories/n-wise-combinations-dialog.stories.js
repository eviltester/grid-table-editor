import { expect, within } from 'storybook/test';
import { createCombinationsDialogComponent } from '../../../../packages/core-ui/js/gui_components/generator/combinations-dialog/index.js';
import { CombinationAlgorithm } from '../../../../packages/core-ui/js/gui_components/generator/generation/n-wise-generation-options.js';

function renderDialogStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'N-wise combinations dialog story');

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.textContent = 'Open dialog';

  const log = document.createElement('pre');
  log.setAttribute('aria-label', 'Dialog result');
  log.textContent = 'No selection yet.';

  root.appendChild(launcher);
  root.appendChild(log);

  const dialogRoot = document.createElement('div');
  root.appendChild(dialogRoot);

  const component = createCombinationsDialogComponent({
    root: dialogRoot,
    documentObj: document,
    callbacks: {
      onSubmit: (selection) => {
        log.textContent = `strength:${selection.strength}; algorithm:${selection.algorithm}`;
      },
    },
  });

  const openDialog = () =>
    component.open({
      enumColumnCount: args.enumColumnCount,
      enumValueCounts: args.enumValueCounts,
      selectedStrength: args.selectedStrength,
      selectedAlgorithm: args.selectedAlgorithm,
    });
  launcher.addEventListener('click', openDialog);
  if (args.openOnRender) {
    openDialog();
  }

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/Generator/N-Wise Combinations Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The Generate Combinations dialog constrains n-wise strengths to the current enum-column count, filters strategies by selected strength, and returns the selected strength plus strategy to the generator page workflow.',
      },
    },
  },
  args: {
    enumColumnCount: 4,
    enumValueCounts: [3, 3, 3, 3],
    selectedStrength: 2,
    selectedAlgorithm: CombinationAlgorithm.PAIRWISE,
    openOnRender: true,
  },
  argTypes: {
    enumColumnCount: {
      control: { type: 'number', min: 0, max: 8, step: 1 },
      description: 'Number of enum columns in the current schema. Valid n values are 2 through this count.',
    },
    enumValueCounts: {
      control: 'object',
      description: 'Value counts for enum columns, used to calculate the Cartesian Product strategy row count.',
    },
    selectedStrength: {
      control: { type: 'number', min: 2, max: 8, step: 1 },
      description: 'Initial n-wise strength.',
    },
    selectedAlgorithm: {
      control: 'select',
      options: Object.values(CombinationAlgorithm),
      description: 'Initial strategy selection when it is valid for the selected strength.',
    },
    openOnRender: {
      control: 'boolean',
      description: 'Opens the dialog immediately so reviewers can inspect the modal state.',
    },
  },
  render: renderDialogStory,
};

export default meta;

export const StrengthFiltering = {
  args: {
    enumColumnCount: 4,
    selectedStrength: 3,
    selectedAlgorithm: CombinationAlgorithm.PAIRWISE,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates valid n values for a four-enum schema with 3-wise selected. Pairwise strategies are not available because they only support strength 2.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole('dialog', { name: 'Generate Combinations' });
    const pairwiseOption = dialog.querySelector(
      `[data-role="n-wise-strategy-option"][data-strategy-id="${CombinationAlgorithm.PAIRWISE}"]`
    );
    const greedyOption = dialog.querySelector(
      `[data-role="n-wise-strategy-option"][data-strategy-id="${CombinationAlgorithm.GREEDY}"]`
    );
    await expect(within(dialog).getByLabelText('n')).toHaveValue('3');
    await expect(pairwiseOption).toBeNull();
    await expect(greedyOption).toBeVisible();
  },
};

export const NotEnoughEnums = {
  args: {
    enumColumnCount: 1,
    selectedStrength: 2,
    selectedAlgorithm: CombinationAlgorithm.PAIRWISE,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the disabled state when a schema has fewer than two enum columns. The explanation names the finite-enum rule so the reviewer can see why no n values are available.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole('dialog', { name: 'Generate Combinations' });
    await expect(within(dialog).getByText(/Add at least 2 enum columns/i)).toBeVisible();
    await expect(within(dialog).getByRole('button', { name: 'Generate' })).toBeDisabled();
  },
};
