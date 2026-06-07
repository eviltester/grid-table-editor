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
    },
    callbacks: {
      onSetTextFromGrid: () => {
        args.onSetTextFromGrid?.();
        result.textContent = 'action:set-text-from-grid';
      },
      onSetGridFromText: () => {
        args.onSetGridFromText?.();
        result.textContent = 'action:set-grid-from-text';
      },
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
          React.createElement(Canvas, { of: BusyAndStatus })
        ),
      description: {
        component:
          'ImportExportToolbar is now a thin host around three reviewer-visible child components: Grid Preview Sync Control, Import Control, and Download Control. Each segment now owns its own help tippy, so the composed toolbar story documents three separate help affordances rather than one toolbar-wide tooltip.',
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
    onSetTextFromGrid: fn(),
    onSetGridFromText: fn(),
    onDownload: fn(),
    onFileSelected: fn(),
    onImportFromClipboard: fn(),
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['preview', 'edit'],
      description: 'Preview/edit mode used to determine whether Set Grid From Text is enabled.',
    },
    previewTextDirty: {
      control: 'boolean',
      description: 'When true in preview mode, Set Grid From Text becomes enabled.',
    },
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
    onSetTextFromGrid: {
      description: 'Storybook action fired when Set Text From Grid is clicked.',
      table: { category: 'Events' },
    },
    onSetGridFromText: {
      description: 'Storybook action fired when Set Grid From Text is clicked.',
      table: { category: 'Events' },
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
          'Default composed toolbar state. Reviewers should see the new order immediately: sync controls first, then import controls with drag/drop, then Download. Hover each help icon and confirm the Actions panel still reflects the real child behavior rather than one shared toolbar tippy.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButtons = canvas.getAllByRole('button', { name: 'Show help' });
    const setTextButton = canvas.getByRole('button', { name: 'Set Text From Grid' });
    const setGridButton = canvas.getByRole('button', { name: 'Set Grid From Text' });
    const downloadButton = canvas.getByRole('button', { name: /\.csv Download/i });

    await expect(helpButtons).toHaveLength(3);
    await expect(helpButtons[0]).toHaveAttribute('data-help', 'import-export-grid-preview-sync');
    await expect(helpButtons[1]).toHaveAttribute('data-help', 'import-export-import');
    await expect(helpButtons[2]).toHaveAttribute('data-help', 'import-export-download');
    await expect(getDropZoneLabel(canvas)).toBeVisible();
    await expect(setTextButton).toBeEnabled();
    await expect(setGridButton).toBeDisabled();
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
    mode: 'edit',
    previewTextDirty: true,
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
          'Shows the important busy/status review state. Reviewers should see **Set Text From Grid**, **Set Grid From Text**, and **Download** disabled immediately, with the import/export progress messages visible at the same time.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Set Text From Grid' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Set Grid From Text' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: /\.csv Download/i })).toBeDisabled();
    await expect(canvas.getByText('Importing full data into grid...')).toBeVisible();
    await expect(canvas.getByText('Generating export text...')).toBeVisible();
  },
};
