import { createImportExportToolbarComponent } from '../../../../packages/core-ui/js/gui_components/app/import-export-toolbar/index.js';

function renderImportExportToolbarStory() {
  const root = document.createElement('section');
  const component = createImportExportToolbarComponent({
    root,
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'App/Import Export Toolbar',
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
};
