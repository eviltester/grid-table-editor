import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createImportExportGridPreviewSyncControlComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-grid-preview-sync-control/index.js';

function renderStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const componentRoot = document.createElement('div');
  const result = document.createElement('output');
  result.textContent = 'No actions yet.';

  root.append(componentRoot, result);

  const component = createImportExportGridPreviewSyncControlComponent({
    root: componentRoot,
    props: args,
    callbacks: {
      onSetTextFromGrid: () => {
        args.onSetTextFromGrid?.();
        result.textContent = 'action:set-text-from-grid';
      },
      onSetGridFromText: () => {
        args.onSetGridFromText?.();
        result.textContent = 'action:set-grid-from-text';
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/Import Export/Grid Preview Sync Control',
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
          React.createElement(Canvas, { of: PreviewDirty }),
          React.createElement(Canvas, { of: EditMode })
        ),
      description: {
        component:
          'Reviewer-facing control for syncing between the grid and the preview text. It owns only the two sync actions and their enablement rules.',
      },
    },
  },
  args: {
    mode: 'preview',
    previewTextDirty: false,
    importBusy: false,
    supportsImport: true,
    supportsExport: true,
    onSetTextFromGrid: fn(),
    onSetGridFromText: fn(),
  },
  render: renderStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Default preview-mode state. Set Grid From Text stays disabled until preview text becomes dirty.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Set Text From Grid' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Set Grid From Text' })).toBeDisabled();
  },
};

export const PreviewDirty = {
  args: {
    previewTextDirty: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Preview-mode state after the preview text has been edited. Click either button and watch the local log and the Actions panel.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const setGridButton = canvas.getByRole('button', { name: 'Set Grid From Text' });
    await expect(setGridButton).toBeEnabled();
    await userEvent.click(setGridButton);
    await expect(canvas.getByText('action:set-grid-from-text')).toBeVisible();
  },
};

export const EditMode = {
  args: {
    mode: 'edit',
  },
  parameters: {
    docs: {
      description: {
        story: 'Edit mode allows Set Grid From Text immediately, even without preview-dirty state.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Set Grid From Text' })).toBeEnabled();
  },
};
