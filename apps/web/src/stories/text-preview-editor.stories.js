import { expect, userEvent, within } from 'storybook/test';
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
  title: 'Pages/App/Text Preview Editor',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TextPreviewEditor is the app-side preview/edit component. It now composes the focused TextPreviewToolbar for the visible Preview/Edit controls while continuing to own the shared text area and options/preview split-panel shell.',
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
          'Shows Preview mode with Auto Sync enabled and the dedicated preview row-count spinbutton set to 10. Reviewers should hover the help button, confirm the tooltip mentions the first 10 rows, and try changing the Preview row count to see how the preview-specific guidance follows that value while the toggle button remains labeled Preview.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButton = canvas.getAllByRole('button', { name: 'Show help for this option' })[1];
    const autoPreviewCheckbox = canvas.getByRole('checkbox', { name: 'Auto Sync' });

    await userEvent.hover(helpButton);
    await expect(helpButton).toHaveAttribute('data-help-text', expect.stringContaining('first 10 rows'));

    await expect(autoPreviewCheckbox).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Preview' })).toBeTruthy();
    await expect(canvas.getByRole('spinbutton', { name: 'Preview row count' })).toHaveValue(10);
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
        story: 'Edit-mode state with the toggle button switched to Edit and Auto Sync disabled.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButton = canvas.getAllByRole('button', { name: 'Show help for this option' })[1];
    const autoPreviewCheckbox = canvas.getByRole('checkbox', { name: 'Auto Sync' });

    await userEvent.hover(helpButton);
    await expect(helpButton).toHaveAttribute(
      'data-help-text',
      expect.stringContaining('Edit mode shows the full grid text')
    );

    await expect(autoPreviewCheckbox).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Edit' })).toBeTruthy();
  },
};
