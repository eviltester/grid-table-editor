import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createImportExportToolbarComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-toolbar/index.js';

function renderImportExportToolbarStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const componentRoot = document.createElement('div');
  componentRoot.setAttribute('aria-label', 'Import export toolbar example');

  const result = document.createElement('output');
  result.setAttribute('aria-label', 'Import export action log');
  result.textContent = 'No actions yet.';

  root.append(componentRoot, result);

  const component = createImportExportToolbarComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      mode: args.mode,
      previewTextDirty: args.previewTextDirty,
      fileExtension: args.fileExtension,
      supportsImport: args.supportsImport,
      supportsExport: args.supportsExport,
      importBusy: args.importBusy,
      exportBusy: args.exportBusy,
      importStatusMessage: args.importStatusMessage,
      importStatusLoading: args.importStatusLoading,
      exportStatusMessage: args.exportStatusMessage,
      exportStatusLoading: args.exportStatusLoading,
      errorStatusMessage: args.errorStatusMessage,
      trimInput: args.trimInput,
      trimInputFieldsEnabled: args.trimInputFieldsEnabled,
      trimInputFieldsCsv: args.trimInputFieldsCsv,
    },
    callbacks: {
      onDownload: () => {
        args.onDownload?.();
        result.textContent = 'action:download';
      },
      onFileSelected: (file) => {
        args.onFileSelected?.(file);
        result.textContent = file ? `file:${file.name}` : 'file:none';
      },
      onImportFromClipboard: () => {
        args.onImportFromClipboard?.();
        result.textContent = 'action:import-from-clipboard';
      },
      onImportTrimSettingsChange: (settings) => {
        args.onImportTrimSettingsChange?.(settings);
        result.textContent = `trim:${JSON.stringify(settings)}`;
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

function getDropZoneLabel(canvas) {
  return canvas.getByText((_, element) => {
    if (!element || element.getAttribute('data-role') !== 'drop-zone') {
      return false;
    }
    return element.textContent?.replace(/\s+/g, ' ').includes('[Drag And Drop .csv File Here]');
  });
}

const meta = {
  title: 'Pages/App/Import Export Toolbar',
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
          React.createElement(Canvas, { of: FileImportSurface }),
          React.createElement(Canvas, { of: ImportTrimSettings }),
          React.createElement(Canvas, { of: BusyAndStatus })
        ),
      description: {
        component:
          'ImportExportToolbar is now a thin host around the import and download MVC components only. The grid/preview sync control moved up into the parent workspace, so this story focuses on the closed-disclosure contents: import help, file and clipboard import, drag/drop, download, and shared error/status messaging.',
      },
    },
  },
  args: {
    mode: 'preview',
    previewTextDirty: false,
    fileExtension: '.csv',
    supportsImport: true,
    supportsExport: true,
    importBusy: false,
    exportBusy: false,
    importStatusMessage: '',
    importStatusLoading: false,
    exportStatusMessage: '',
    exportStatusLoading: false,
    errorStatusMessage: '',
    trimInput: false,
    trimInputFieldsEnabled: false,
    trimInputFieldsCsv: '',
    onDownload: fn(),
    onFileSelected: fn(),
    onImportFromClipboard: fn(),
    onImportTrimSettingsChange: fn(),
  },
  argTypes: {
    fileExtension: {
      control: 'text',
      description: 'Visible file-extension label shown on import and download affordances.',
    },
    supportsImport: {
      control: 'boolean',
      description: 'Hides the file input and drag/drop zone when false.',
    },
    supportsExport: {
      control: 'boolean',
      description: 'Hides export controls when false.',
    },
    importBusy: {
      control: 'boolean',
      description: 'Disables import/export controls while import work is active.',
    },
    exportBusy: {
      control: 'boolean',
      description: 'Disables download while export work is active.',
    },
    importStatusMessage: {
      control: 'text',
      description: 'Visible import status text shown inline under the drop-zone surface.',
    },
    importStatusLoading: {
      control: 'boolean',
      description: 'Adds loading styling to the import status surface.',
    },
    exportStatusMessage: {
      control: 'text',
      description: 'Visible export status text shown inline next to the toolbar actions.',
    },
    exportStatusLoading: {
      control: 'boolean',
      description: 'Adds loading styling to the export status surface.',
    },
    errorStatusMessage: {
      control: 'text',
      description: 'Persistent error/status message shown at the end of the toolbar.',
    },
    trimInput: {
      control: 'boolean',
      description: 'When true, imported input values are trimmed before import/amend processing.',
    },
    trimInputFieldsEnabled: {
      control: 'boolean',
      description: 'Enables field-list trimming in the import settings disclosure.',
    },
    trimInputFieldsCsv: {
      control: 'text',
      description: 'Comma-separated imported field names trimmed when selected-fields mode is enabled.',
    },
    onDownload: {
      description: 'Storybook action fired when Download is clicked.',
      table: { category: 'Events' },
    },
    onFileSelected: {
      description: 'Storybook action fired when a file is chosen from the file input or dropped on the drop zone.',
      table: { category: 'Events' },
    },
    onImportFromClipboard: {
      description: 'Storybook action fired when From Clipboard is clicked.',
      table: { category: 'Events' },
    },
    onImportTrimSettingsChange: {
      description: 'Storybook action fired when the import trim settings change.',
      table: { category: 'Events' },
    },
  },
  render: renderImportExportToolbarStory,
};

export default meta;

export const Default = {
  render: renderImportExportToolbarStory,
  parameters: {
    docs: {
      description: {
        story:
          'Default import/export disclosure contents. Reviewers should see import controls with drag/drop first, then Download. Hover each help icon and confirm the Actions panel still reflects the real child behavior rather than one shared toolbar tippy.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButtons = canvas.getAllByRole('button', { name: 'Show help' });
    const downloadButton = canvas.getByRole('button', { name: 'Download file' });

    await expect(helpButtons).toHaveLength(2);
    await expect(helpButtons[0]).toHaveAttribute('data-help', 'import-export-import');
    await expect(helpButtons[1]).toHaveAttribute('data-help', 'import-export-download');
    await expect(getDropZoneLabel(canvas)).toBeVisible();
    await expect(downloadButton).toBeEnabled();

    await userEvent.click(downloadButton);
    await expect(canvas.getByText('action:download')).toBeVisible();
  },
};

export const FileImportSurface = {
  render: renderImportExportToolbarStory,
  parameters: {
    docs: {
      description: {
        story:
          'Documents the reviewer-facing file-import boundary. Use the file picker or drag a file onto the drop zone and watch both the local log and the Actions panel record the selected filename. The story play example uploads a CSV through the real file input binding path.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File(['name,status\\nAva,active'], 'story-import.csv', { type: 'text/csv' });
    const fileInput = canvas.getByLabelText(/\.csv import:/i);

    await userEvent.upload(fileInput, file);
    await expect(canvas.getByText('file:story-import.csv')).toBeVisible();
    await expect(getDropZoneLabel(canvas)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Import From Clipboard' }));
    await expect(canvas.getByText('action:import-from-clipboard')).toBeVisible();
  },
};

export const BusyAndStatus = {
  args: {
    importBusy: true,
    exportBusy: true,
    importStatusMessage: 'Importing full data into grid...',
    importStatusLoading: true,
    exportStatusMessage: 'Generating export text...',
    exportStatusLoading: true,
  },
  render: renderImportExportToolbarStory,
  parameters: {
    docs: {
      description: {
        story:
          'Shows the important busy/status review state. Reviewers should see the import inputs, clipboard action, and **Download** disabled immediately, with the import/export progress messages visible at the same time.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Import From Clipboard' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Download file' })).toBeDisabled();
    await expect(canvas.getByText('Importing full data into grid...')).toBeVisible();
    await expect(canvas.getByText('Generating export text...')).toBeVisible();
  },
};

export const ImportTrimSettings = {
  args: {
    trimInput: true,
    trimInputFieldsEnabled: true,
    trimInputFieldsCsv: 'Name, Email',
  },
  render: renderImportExportToolbarStory,
  parameters: {
    docs: {
      description: {
        story:
          'Documents the import-only trim settings behind the import settings disclosure. Toggle the radio groups and edit the CSV textbox to confirm the emitted settings payload shown in the story log.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Import settings'));
    const textInput = canvas.getByRole('textbox', { name: /trim input fields csv/i });
    await userEvent.clear(textInput);
    await userEvent.type(textInput, 'Name, Role');
    await expect(canvas.getByText(/"trimInputFieldsCsv":"Name, Role"/)).toBeVisible();
  },
};
