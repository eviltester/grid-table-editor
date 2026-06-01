import { expect, userEvent, within } from 'storybook/test';
import { createGridToolbarComponent } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/grid-toolbar/index.js';

function renderGridToolbarStory() {
  const root = document.createElement('section');
  const log = document.createElement('pre');
  log.setAttribute('aria-label', 'Grid toolbar log');
  log.textContent = 'No actions yet.';
  root.appendChild(log);

  const toolbarRoot = document.createElement('div');
  root.appendChild(toolbarRoot);

  const writeLog = (message) => {
    log.textContent = message;
  };

  const component = createGridToolbarComponent({
    root: toolbarRoot,
    documentObj: document,
    callbacks: {
      onAddRow: () => writeLog('add-row'),
      onAddRowsAbove: () => writeLog('add-rows-above'),
      onAddRowsBelow: () => writeLog('add-rows-below'),
      onDeleteSelectedRows: () => writeLog('delete-selected-rows'),
      onClearFilters: () => writeLog('clear-filters'),
      onClearSort: () => writeLog('clear-sort'),
      onClearTable: () => writeLog('clear-table'),
      onFilterTextChange: (filterText) => writeLog(`filter:${filterText}`),
      onUniqueColumnNamesChange: (enabled) => writeLog(`unique-column-names:${enabled}`),
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Data Grid/Grid Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GridToolbar is the extracted Phase 7 app-side control surface for row actions, filter text, sort clearing, table reset, and the unique-column-names toggle. It does not require a real Tabulator instance to be reviewed or interaction-tested.',
      },
    },
  },
  render: renderGridToolbarStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the extracted grid toolbar on its own. Try typing into Filter, toggling Unique Column Names, and clicking the row-action buttons to confirm the control surface works independently of the real grid renderer.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(await canvas.findByPlaceholderText('Filter...'), 'abc');
    await expect(canvas.getByText('filter:abc')).toBeVisible();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Unique Column Names' }));
    await expect(canvas.getByText('unique-column-names:true')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Add Row' }));
    await expect(canvas.getByText('add-row')).toBeVisible();
  },
};
