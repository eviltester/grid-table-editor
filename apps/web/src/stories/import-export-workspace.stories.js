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
    this.callbacks.forEach((callback) => {
      callback();
    });
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
  if (args.unsupported === true) {
    exporter.canExport = () => false;
    importer.canImport = () => false;
  }
  const component = createImportExportWorkspaceComponent({
    root,
    documentObj: document,
    props: {
      previewRowLimit: args.previewRowLimit,
      importBusy: args.importBusy,
      exportBusy: args.exportBusy,
      importStatusMessage: args.importStatusMessage,
      importStatusLoading: args.importStatusLoading,
      exportStatusMessage: args.exportStatusMessage,
      exportStatusLoading: args.exportStatusLoading,
      errorStatusMessage: args.errorStatusMessage,
    },
    services: {
      requestConfirm: async () => true,
    },
  });

  component.setExporter(exporter);
  component.setImporter(importer);
  component.setGridChangeSource(storyGrid);
  component.renderTextFromGrid();
  component.setFileFormatType();
  component.setOptionsViewForFormatType();

  if (args.format && args.format !== 'csv') {
    component.setFileFormatType(args.format);
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
          'ImportExportWorkspace is the app-side component-owned import/export feature. It composes a grid/preview sync row, an import/export disclosure, and the preview/edit text workspace without delegating to the old legacy controls. The Import / Export details shell wraps only the import and download toolbar; the grid/preview sync row plus Auto Sync, Preview/Edit, row count, format tabs, and text preview remain visible outside that disclosure.',
      },
    },
  },
  args: {
    format: 'csv',
    previewRowLimit: 10,
    importBusy: false,
    exportBusy: false,
    importStatusMessage: '',
    importStatusLoading: false,
    exportStatusMessage: '',
    exportStatusLoading: false,
    errorStatusMessage: '',
    unsupported: false,
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
          'Shows the composed app-side import/export workspace mounted through the new Phase 6 feature boundary. The grid/preview sync actions stay visible above the closed Import / Export disclosure by default, while Auto Sync, Preview/Edit, row count, format tabs, and text preview remain available below. Expand Import / Export to inspect file import and download, use the compact preview row-count input next to Preview to change the sample size, and click Set Text From Grid to refresh preview text.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const outputPreview = canvas.getByRole('textbox', { name: 'Preview text editor' });
    const disclosure = canvasElement.querySelector('[data-role="import-export-toolbar-details"]');
    await expect(disclosure?.open).toBe(false);
    await expect(canvas.getByRole('checkbox', { name: 'Auto Sync' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Set Text From Grid' })).toBeVisible();
    await expect(outputPreview).toBeVisible();
    await userEvent.click(canvas.getByText('Import / Export'));
    await expect(disclosure?.open).toBe(true);
    await expect(canvas.getByRole('spinbutton', { name: 'Preview row count' })).toHaveValue(10);
    await userEvent.click(canvas.getByRole('button', { name: 'Set Text From Grid' }));
    await waitFor(() => {
      expect(outputPreview.value).toContain('"First Name","Status"');
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
    const outputPreview = canvas.getByRole('textbox', { name: 'Preview text editor' });
    await waitFor(() => {
      expect(outputPreview.value).toContain('"Ava"');
    });
    const asObjectCheckbox = canvas.getByRole('checkbox', { name: /as object/i });
    await userEvent.click(asObjectCheckbox);
    const applyButton = canvas.getByRole('button', { name: 'Apply' });
    await expect(applyButton).toBeEnabled();
  },
};

export const ImportBusy = {
  args: {
    importBusy: true,
    importStatusMessage: 'Importing full data into grid...',
    importStatusLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the workspace while an import is active. The Set Text From Grid and Download affordances become busy/disabled, and the import status remains visible with loading styling.',
      },
    },
  },
};

export const ExportBusy = {
  args: {
    exportBusy: true,
    exportStatusMessage: 'Generating export text...',
    exportStatusLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the workspace while a download/export is active. The download button is disabled and the export status explains the current operation.',
      },
    },
  },
};

export const UnsupportedFormat = {
  args: {
    format: 'json',
    unsupported: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how the toolbar renders when the selected format is not importable or exportable. Import controls and download are hidden while the selector/editor remain mounted.',
      },
    },
  },
};

export const ErrorState = {
  args: {
    errorStatusMessage: 'Import failed. Check file format/options.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the persistent error/status surface used when import/export validation or parsing fails. Retry Set Grid From Text after editing the preview text.',
      },
    },
  },
};
