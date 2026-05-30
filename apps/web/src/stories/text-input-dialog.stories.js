import { expect, userEvent, within } from 'storybook/test';
import { createTextInputDialogService } from '../../../../packages/core-ui/js/gui_components/shared/dialog-services/index.js';

function removeTextInputModal() {
  document.getElementById('text-input-modal-backdrop')?.remove();
}

function renderTextInputDialogStory(args) {
  removeTextInputModal();

  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="open">Open text input dialog</button>
    </div>
    <output data-result>Pending</output>
  `;

  const result = root.querySelector('[data-result]');
  const dialogService = createTextInputDialogService({ documentObj: document });
  root.querySelector('[data-action="open"]')?.addEventListener('click', async () => {
    const value = await dialogService.requestTextInput({
      title: args.title,
      initialValue: args.initialValue,
      okLabel: args.okLabel,
      cancelLabel: args.cancelLabel,
    });
    result.textContent = value == null ? 'Cancelled' : value;
  });

  root.__storybookCleanup = removeTextInputModal;
  return root;
}

const meta = {
  title: 'Shared/Text Input Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for the shared text-input dialog service. This documents the promise-returning API used by guarded column edit and grid filter flows, without requiring page bootstrap.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title shown when the text-input modal opens.',
    },
    initialValue: {
      control: 'text',
      description: 'Initial field value shown before the reviewer edits the text.',
    },
    okLabel: {
      control: 'text',
      description: 'Text shown on the confirming action button.',
    },
    cancelLabel: {
      control: 'text',
      description: 'Text shown on the cancelling action button.',
    },
  },
  args: {
    title: 'Filter Column',
    initialValue: 'Current filter',
    okLabel: 'Apply',
    cancelLabel: 'Cancel',
  },
};

export default meta;

export const SubmitFilterValue = {
  render: renderTextInputDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Open text input dialog**, change the field value, and submit with **Apply**. This story demonstrates the confirmed text-entry path and shows the resolved promise value returned by the dialog service.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open text input dialog' }));
    const dialog = within(document.body);
    const input = dialog.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.type(input, 'Status: Active');
    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText(/Status: Active/)).toBeVisible();
  },
};

export const CancelTextInput = {
  render: renderTextInputDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Open text input dialog**, then choose **Cancel**. This story demonstrates the cancelled path and shows the `null`-style outcome as `Cancelled` in the result line.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open text input dialog' }));
    const dialog = within(document.body);
    await userEvent.click(dialog.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('Cancelled')).toBeVisible();
  },
};
