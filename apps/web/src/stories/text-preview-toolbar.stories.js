import { expect, userEvent, within } from 'storybook/test';
import { createTextPreviewToolbarComponent } from '../../../../packages/core-ui/js/gui_components/app/text-preview-toolbar/index.js';

function renderTextPreviewToolbarStory(args) {
  const root = document.createElement('section');
  root.setAttribute('aria-label', 'Text preview toolbar story');

  const componentRoot = document.createElement('div');
  root.appendChild(componentRoot);

  const eventLog = document.createElement('pre');
  eventLog.setAttribute('data-role', 'event-log');
  eventLog.style.marginTop = '0.75rem';
  eventLog.style.padding = '0.5rem';
  eventLog.style.background = '#f3f4f6';
  eventLog.style.whiteSpace = 'pre-wrap';
  eventLog.textContent = 'No interactions yet.';
  root.appendChild(eventLog);

  const state = {
    mode: args.mode,
    previewRowLimit: args.previewRowLimit,
    autoPreviewEnabled: args.autoPreviewEnabled,
  };

  let component;
  const sync = (message) => {
    eventLog.textContent = message;
    component.update({
      ...state,
    });
  };

  component = createTextPreviewToolbarComponent({
    root: componentRoot,
    documentObj: document,
    props: {
      ...state,
      editModeHelpText: args.editModeHelpText,
    },
    callbacks: {
      onToggleMode: () => {
        state.mode = state.mode === 'preview' ? 'edit' : 'preview';
        sync(`mode:${state.mode}`);
      },
      onAutoPreviewChange: (enabled) => {
        state.autoPreviewEnabled = enabled;
        sync(`auto-preview:${enabled}`);
      },
      onPreviewRowLimitChange: (value) => {
        state.previewRowLimit = value;
        sync(`preview-rows:${value}`);
      },
      onCopyText: () => {
        component.setCopyButtonText('Copied');
        sync('copy');
      },
    },
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/Text Preview Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'TextPreviewToolbar is the focused control cluster extracted from TextPreviewEditor. It renders the Preview/Edit actions above the export-format tabs, owns the Auto Sync checkbox and help tippy, preview-row count control, help tooltip, copy button, and format-selector mount roots, while the parent editor continues to own the text area and split-layout shell.',
      },
    },
  },
  args: {
    mode: 'preview',
    previewRowLimit: 10,
    autoPreviewEnabled: true,
    editModeHelpText:
      'Edit mode shows the full grid text in the chosen format. You can edit this text and use Set Grid From Text to apply changes back into the grid.',
  },
  render: renderTextPreviewToolbarStory,
};

export default meta;

export const PreviewMode = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the toolbar in Preview mode with Auto Sync enabled. Hover the help button to confirm the tooltip mentions the first 10 rows, change the preview row count, and use the action log to confirm the toolbar emits focused events without the larger text editor shell.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const helpButtons = canvas.getAllByRole('button', { name: 'Show help for this option' });
    const autoSyncHelpButton = helpButtons[0];
    const modeHelpButton = helpButtons[1];
    const previewRowCount = canvas.getByRole('spinbutton', { name: 'Preview row count' });

    await userEvent.hover(modeHelpButton);
    await expect(modeHelpButton).toHaveAttribute('data-help-text', expect.stringContaining('first 10 rows'));
    await expect(autoSyncHelpButton).toHaveAttribute('data-help', 'auto-sync-help');
    await expect(previewRowCount).toHaveValue(10);
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
        story:
          'Shows the toolbar in Edit mode, where Auto Sync and the preview-row count are disabled. Reviewers should hover the help button and confirm the edit-mode guidance replaces the preview-specific row-count explanation.',
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
  },
};
