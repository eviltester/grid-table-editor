import { createTextPreviewEditorComponent } from '../../../../packages/core-ui/js/gui_components/app/text-preview-editor/index.js';

function renderTextPreviewEditorStory(args) {
  const root = document.createElement('section');
  const component = createTextPreviewEditorComponent({
    root,
    documentObj: document,
    props: {
      mode: args.mode,
      previewRowLimit: args.previewRowLimit,
      autoPreviewEnabled: args.autoPreviewEnabled,
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'App/Text Preview Editor',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TextPreviewEditor is the Phase 6 app-side component that owns preview/edit controls, the shared text area, and the options/preview split-panel shell.',
      },
    },
  },
  args: {
    mode: 'preview',
    previewRowLimit: 10,
    autoPreviewEnabled: false,
  },
  render: renderTextPreviewEditorStory,
};

export default meta;

export const PreviewMode = {
  parameters: {
    docs: {
      description: {
        story:
          'Preview-mode state with Auto Preview enabled and the preview-row count reflected in the toggle button label.',
      },
    },
  },
};

export const EditMode = {
  args: {
    mode: 'edit',
    autoPreviewEnabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Edit-mode state with the toggle button switched to Edit and Auto Preview disabled.',
      },
    },
  },
};
