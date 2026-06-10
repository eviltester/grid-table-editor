import { expect, userEvent, waitFor, within } from 'storybook/test';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { createDataGridComponent } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/index.js';
import { GridExtension as TabulatorGridExtension } from '../../../../packages/core-ui/js/gui_components/data-grid-editor/tabulator/gridExtension-tabulator.js';

function createSampleDataTable() {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(['First Name', 'Status']);
  dataTable.appendDataRow(['Ava', 'Active']);
  dataTable.appendDataRow(['Liam', 'Paused']);
  return dataTable;
}

function renderDataGridEditorStory(args) {
  const root = document.createElement('section');
  const component = createDataGridComponent({
    root,
    documentObj: document,
    services: {
      TabulatorCtor: Tabulator,
      GridExtensionClass: TabulatorGridExtension,
      requestConfirm: async () => true,
    },
  });

  component.whenReady().then(() => {
    if (args.withSampleData) {
      component.getGridExtras()?.setGridFromGenericDataTable?.(createSampleDataTable());
    }
  });

  root.__storybookCleanup = () => component.destroy();
  root.__whenReady = () => component.whenReady();
  return root;
}

const meta = {
  title: 'Data Grid Editor/Data Grid Editor',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'DataGridComponent is the Phase 7 app-side component boundary that composes the extracted GridToolbar with the shared late-mount-safe TabulatorGridAdapter. It preserves the current app DOM contract while moving the main grid onto the component model, including the live total-row status underneath the grid.',
      },
    },
  },
  args: {
    withSampleData: false,
  },
  render: renderDataGridEditorStory,
};

export default meta;

export const EmptyGrid = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the componentized app-side grid editor with the real Tabulator renderer but without seeded rows. Try using Add Row to confirm the toolbar is mounted through the new component boundary and the real grid host is present.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await canvasElement.__whenReady?.();
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Row' }));
    await expect(await canvas.findByText('~rename-me', { exact: true })).toBeVisible();
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-role="grid-total-rows"]')?.textContent).toMatch(/^Total rows: \d+/);
    });
  },
};

export const WithSampleData = {
  args: {
    withSampleData: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the same component after seeding real grid data through the shared grid extension API. This is the high-fidelity story for reviewing the real Tabulator-backed app grid surface.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await canvasElement.__whenReady?.();
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('First Name', { exact: true })).toBeVisible();
    await expect(await canvas.findByText('Ava', { exact: true })).toBeVisible();
    await expect(await canvas.findByText('Paused', { exact: true })).toBeVisible();
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-role="grid-total-rows"]')?.textContent).toBe('Total rows: 2');
    });
  },
};
