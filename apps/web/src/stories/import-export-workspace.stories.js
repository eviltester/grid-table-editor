import { expect, userEvent, waitFor, within } from 'storybook/test';
import { GenericDataTable } from '@anywaydata/core/data_formats/generic-data-table.js';
import { Importer } from '@anywaydata/core/grid/importer.js';
import { Exporter } from '@anywaydata/core/grid/exporter.js';
import { createImportExportWorkspaceComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-workspace/index.js';

class StoryMemoryGrid {
  constructor(initialTable = new GenericDataTable()) {
    this.table = initialTable;
    this.callbacks = new Set();
  }

  getGridAsGenericDataTable(maxRows) {
    const table = new GenericDataTable();
    table.setHeaders(this.table.getHeaders());
    const rowLimit = Number.isFinite(maxRows) ? Math.min(maxRows, this.table.getRowCount()) : this.table.getRowCount();
    for (let rowIndex = 0; rowIndex < rowLimit; rowIndex += 1) {
      table.appendDataRow(this.table.getRow(rowIndex));
    }
    return table;
  }

  setGridFromGenericDataTable(dataTable) {
    this.table = dataTable;
    this.callbacks.forEach((callback) => callback());
    return Promise.resolve();
  }

  onGridChanged(callback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  getHeadersFromGrid() {
    return this.table.getHeaders();
  }
}

function createSampleGridData() {
  const dataTable = new GenericDataTable();
  dataTable.setHeaders(['First Name', 'Status']);
  dataTable.appendDataRow(['Ava', 'active']);
  dataTable.appendDataRow(['Liam', 'paused']);
  dataTable.appendDataRow(['Mia', 'review']);
  return dataTable;
}

function renderImportExportWorkspaceStory(args) {
  const root = document.createElement('section');
  const storyGrid = new StoryMemoryGrid(createSampleGridData());
  const exporter = new Exporter(storyGrid);
  const importer = new Importer(storyGrid);
  const component = createImportExportWorkspaceComponent({
    root,
    documentObj: document,
    props: {
      previewRowLimit: args.previewRowLimit,
    },
  });

  component.setExporter(exporter);
  component.setImporter(importer);
  component.setGridChangeSource(storyGrid);
  component.renderTextFromGrid();
  component.setFileFormatType();
  component.setOptionsViewForFormatType();

  if (args.format && args.format !== 'csv') {
    root.querySelector(`.type-select-action[data-type="${args.format}"]`)?.click();
  }

  root.__storybookCleanup = () => {
    component.destroy();
    root.remove();
  };
  return root;
}

const meta = {
  title: 'Pages/App/Import Export Workspace',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ImportExportWorkspace is the Phase 6 app-side feature boundary for import/export controls, format selection, text preview/editing, and options-panel composition.',
      },
    },
  },
  args: {
    format: 'csv',
    previewRowLimit: 10,
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['csv', 'json', 'markdown'],
    },
    previewRowLimit: {
      control: { type: 'number', min: 1, max: 50, step: 1 },
    },
  },
  render: renderImportExportWorkspaceStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the composed app-side import/export workspace mounted through the new Phase 6 feature boundary. Use the compact preview row-count input next to Preview to change the sample size, click Set Text From Grid to refresh preview text, and switch formats inside the same mounted component tree.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('spinbutton', { name: 'Preview row count' })).toHaveValue(10);
    await userEvent.click(canvas.getByRole('button', { name: 'v Set Text From Grid v' }));
    await waitFor(() => {
      expect(canvasElement.querySelector('#markdownarea')?.value?.length || 0).toBeGreaterThan(0);
    });
    await userEvent.click(canvas.getByRole('link', { name: 'JSON' }));
    await waitFor(() => {
      expect(canvas.getByRole('textbox', { name: /property name/i })).toBeTruthy();
    });
  },
};

export const JsonPreview = {
  args: {
    format: 'json',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the same workspace after switching to JSON so the shared format selector, preview editor, row-count control, and options panel can be reviewed together in a non-CSV state.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvasElement.querySelector('#markdownarea')?.value || '').toContain('{');
    });
    const asObjectCheckbox = canvas.getByRole('checkbox', { name: /as object/i });
    await userEvent.click(asObjectCheckbox);
    const applyButton = canvas.getByRole('button', { name: 'Apply' });
    await expect(applyButton).toBeEnabled();
  },
};
