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
  document.body.appendChild(root);
  const storyGrid = new StoryMemoryGrid(createSampleGridData());
  const exporter = new Exporter(storyGrid);
  const importer = new Importer(storyGrid);
  const component = createImportExportWorkspaceComponent({
    root,
    documentObj: document,
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
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['csv', 'json', 'markdown'],
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
          'Shows the composed app-side import/export workspace mounted through the new Phase 6 feature boundary. Click Set Text From Grid to refresh preview text, switch formats, and use the options panel inside the same mounted component tree.',
      },
    },
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
          'Shows the same workspace after switching to JSON so the shared format selector, preview editor, and options panel can be reviewed together in a non-CSV state.',
      },
    },
  },
};
