import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createImportExportToolbarComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-toolbar/index.js';

function renderImportExportToolbarStory() {
  const root = document.createElement('section');
  const component = createImportExportToolbarComponent({
    root,
    documentObj: document,
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/Import Export Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ImportExportToolbar is the Phase 6 app-side component that owns the import/export action buttons, file input, drag/drop zone, and inline status/error surfaces.',
      },
    },
  },
  render: renderImportExportToolbarStory,
};

export default meta;

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Default toolbar state before any import/export action has started.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButton = canvas.getByRole('button', { name: 'Show help' });
    const setTextButton = canvas.getByRole('button', { name: 'v Set Text From Grid v' });
    const setGridButton = canvas.getByRole('button', { name: '^ Set Grid From Text ^' });

    await userEvent.hover(helpButton);
    await waitFor(() => {
      const tooltip = document.body.querySelector('.tippy-box');
      expect(tooltip?.textContent || '').toContain('Using the import and export controls');
    });
    await expect(setTextButton).toBeEnabled();
    await expect(setGridButton).toBeDisabled();
  },
};
