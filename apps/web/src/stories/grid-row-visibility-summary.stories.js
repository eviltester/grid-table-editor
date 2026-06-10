import { expect, userEvent, within } from 'storybook/test';
import { createGridRowVisibilitySummaryComponent } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/grid-row-visibility-summary/index.js';

function renderGridRowVisibilitySummaryStory(args) {
  const root = document.createElement('section');
  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.style.gap = '0.75rem';
  root.style.padding = '0.75rem';
  root.style.background = 'var(--panel-bg)';
  root.style.color = 'var(--page-text)';
  const statusRoot = document.createElement('div');
  const controlsRoot = document.createElement('div');
  controlsRoot.style.display = 'flex';
  controlsRoot.style.flexWrap = 'wrap';
  controlsRoot.style.gap = '0.5rem';
  controlsRoot.innerHTML = `
    <button type="button" data-action="show-filtered">Show Filtered Summary</button>
    <button type="button" data-action="clear-filtered">Clear Filtered Summary</button>
  `;

  root.appendChild(statusRoot);
  root.appendChild(controlsRoot);

  const component = createGridRowVisibilitySummaryComponent({
    root: statusRoot,
    documentObj: document,
    props: {
      totalRowCount: args.totalRowCount,
      visibleRowCount: args.visibleRowCount,
      hasActiveFilters: args.hasActiveFilters,
    },
  });

  controlsRoot.querySelector('[data-action="show-filtered"]')?.addEventListener('click', () => {
    component.update({
      totalRowCount: 8,
      visibleRowCount: 3,
      hasActiveFilters: true,
    });
  });
  controlsRoot.querySelector('[data-action="clear-filtered"]')?.addEventListener('click', () => {
    component.update({
      totalRowCount: args.totalRowCount,
      visibleRowCount: args.totalRowCount,
      hasActiveFilters: false,
    });
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Data Grid Editor/Grid Row Visibility Summary',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GridRowVisibilitySummary is the extracted MVC status control for the Data Grid Editor row totals. It shows the always-visible total row count and conditionally adds the filtered visible count when the grid is actively filtered.',
      },
    },
  },
  args: {
    totalRowCount: 8,
    visibleRowCount: 8,
    hasActiveFilters: false,
  },
  render: renderGridRowVisibilitySummaryStory,
};

export default meta;

export const TotalOnly = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the default summary state with only the total row count visible. Reviewers should see the same status text that appears beneath the full data-grid component when no filters are active.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Total rows: 8');
  },
};

export const FilteredVisible = {
  args: {
    totalRowCount: 8,
    visibleRowCount: 3,
    hasActiveFilters: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the filtered state. Reviewers should see both the total row count and the filtered visible count, matching the app behavior after a global or column filter is applied.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Total rows: 8 | Filtered Visible: 3');
  },
};

export const InteractiveStateChange = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the component state transition. Try the buttons to switch between the filtered and unfiltered summaries and confirm the status text updates without the full grid story around it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show Filtered Summary' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Total rows: 8 | Filtered Visible: 3');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear Filtered Summary' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Total rows: 8');
  },
};
