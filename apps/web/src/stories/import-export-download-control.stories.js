import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createImportExportDownloadControlComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-download-control/index.js';

function renderStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const componentRoot = document.createElement('div');
  const result = document.createElement('output');
  result.textContent = 'No downloads yet.';
  root.append(componentRoot, result);

  const component = createImportExportDownloadControlComponent({
    root: componentRoot,
    props: args,
    callbacks: {
      onDownload: () => {
        args.onDownload?.();
        result.textContent = 'action:download';
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/Import Export/Download Control',
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
          React.createElement(Canvas, { of: Busy }),
          React.createElement(Canvas, { of: WindowsEncoding }),
          React.createElement(Canvas, { of: Hidden })
        ),
      description: {
        component:
          'Reviewer-facing download control for export start, export progress state, and file transport settings. The settings menu applies file-only line endings and optional UTF-8 BOM output without changing the visible preview text.',
      },
    },
  },
  args: {
    supportsExport: true,
    importBusy: false,
    exportBusy: false,
    fileExtension: '.csv',
    exportEncodingSettings: {
      lineEnding: 'lf',
      includeBom: false,
    },
    exportStatusMessage: '',
    exportStatusLoading: false,
    onDownload: fn(),
  },
  render: renderStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Default download state. Click Download and watch both the local log and the Actions panel.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const downloadButton = canvas.getByRole('button', { name: 'Download file' });
    await expect(downloadButton).toBeEnabled();
    await userEvent.click(downloadButton);
    await expect(canvas.getByText('action:download')).toBeVisible();
  },
};

export const Busy = {
  args: {
    exportBusy: true,
    exportStatusMessage: 'Generating export text...',
    exportStatusLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Busy export state. The button is disabled and the export progress message is visible immediately.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Download file' })).toBeDisabled();
    await expect(canvas.getByText('Generating export text...')).toBeVisible();
  },
};

export const WindowsEncoding = {
  args: {
    exportEncodingSettings: {
      lineEnding: 'crlf',
      includeBom: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Non-default file transport settings. Open the Settings menu to review the Windows CR/LF selection and BOM checkbox state that will be applied only to downloaded files.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const settingsSummary = canvasElement.querySelector('[data-role="export-encoding-summary"]');
    await expect(settingsSummary).toBeTruthy();
    await userEvent.click(settingsSummary);
    await expect(canvas.getByLabelText('Line endings')).toHaveValue('crlf');
    await expect(canvas.getByRole('checkbox', { name: 'Include BOM' })).toBeChecked();
  },
};

export const Hidden = {
  args: {
    supportsExport: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Export-disabled host state. The control stays mounted, but the Download affordance is hidden.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { hidden: true })).not.toBeVisible();
  },
};
