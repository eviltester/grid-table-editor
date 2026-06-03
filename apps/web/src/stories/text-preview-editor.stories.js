import { expect, userEvent, waitFor, within } from 'storybook/test';
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
          'Shows Preview mode with Auto Preview enabled and the dedicated preview row-count spinbutton set to 10. Reviewers should hover the help button, confirm the tooltip mentions the first 10 rows, and try changing the Preview row count to see how the preview-specific guidance follows that value while the toggle button remains labeled Preview.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButton = canvas.getByRole('button', { name: 'Show help for this option' });
    const autoPreviewCheckbox = canvas.getByRole('checkbox', { name: 'Auto Preview' });

    await userEvent.hover(helpButton);
    await waitFor(() => {
      const tooltip = document.body.querySelector('.tippy-box');
      expect(tooltip?.textContent || '').toContain('Preview mode shows a sample of the first 10 rows');
    });

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
        story: 'Edit-mode state with the toggle button switched to Edit and Auto Preview disabled.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButton = canvas.getByRole('button', { name: 'Show help for this option' });
    const autoPreviewCheckbox = canvas.getByRole('checkbox', { name: 'Auto Preview' });

    await userEvent.hover(helpButton);
    await waitFor(() => {
      const tooltips = Array.from(document.body.querySelectorAll('.tippy-box'));
      expect(
        tooltips.some((tooltip) => (tooltip.textContent || '').includes('Edit mode shows the full grid text'))
      ).toBe(true);
    });

    await expect(autoPreviewCheckbox).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Edit' })).toBeTruthy();
  },
};
