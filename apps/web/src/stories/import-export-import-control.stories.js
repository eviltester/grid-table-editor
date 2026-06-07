import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createImportExportImportControlComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-import-control/index.js';

function renderStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const componentRoot = document.createElement('div');
  const result = document.createElement('output');
  result.textContent = 'No imports yet.';
  root.append(componentRoot, result);

  const component = createImportExportImportControlComponent({
    root: componentRoot,
    props: args,
    callbacks: {
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
  title: 'Pages/App/Import Export/Import Control',
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
          React.createElement(Canvas, { of: ClipboardImport }),
          React.createElement(Canvas, { of: Busy }),
          React.createElement(Canvas, { of: Hidden })
        ),
      description: {
        component:
          'Reviewer-facing import control for file selection, drag and drop, and import progress state. This is the segment now placed before Download in the composed toolbar.',
      },
    },
  },
  args: {
    supportsImport: true,
    importBusy: false,
    fileExtension: '.csv',
    importStatusMessage: '',
    importStatusLoading: false,
    onFileSelected: fn(),
    onImportFromClipboard: fn(),
  },
  render: renderStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story:
          'Default import state with both the file input and drag/drop surface visible. Upload a file and watch the local log and Actions panel.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File(['name,status\\nAva,active'], 'story-import.csv', { type: 'text/csv' });
    const fileInput = canvas.getByLabelText(/\.csv import:/i);
    await expect(getDropZoneLabel(canvas)).toBeVisible();
    await userEvent.upload(fileInput, file);
    await expect(canvas.getByText('file:story-import.csv')).toBeVisible();
  },
};

export const Busy = {
  args: {
    importBusy: true,
    importStatusMessage: 'Preparing file import...',
    importStatusLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Busy import state. The file input is disabled and the progress surface is visible immediately.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/\.csv import:/i)).toBeDisabled();
    await expect(canvas.getByText('Preparing file import...')).toBeVisible();
  },
};

export const ClipboardImport = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the dedicated clipboard import action alongside file import and drag/drop. Click **From Clipboard** and watch the local log plus Actions panel report the attempted clipboard import path.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Import From Clipboard' }));
    await expect(canvas.getByText('action:import-from-clipboard')).toBeVisible();
  },
};

export const Hidden = {
  args: {
    supportsImport: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Import-disabled host state. The segment remains mounted for layout consistency, but the import affordances are hidden.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText(/\.csv import:/i);
    await expect(fileInput).not.toBeVisible();
  },
};
