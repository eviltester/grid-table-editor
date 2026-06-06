import { expect, userEvent, within } from 'storybook/test';
import { createConfirmDialogService } from '../../../../packages/core-ui/js/gui_components/shared/dialog-services/confirm-dialog-service.js';

function renderConfirmDialogStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="open">Open confirm dialog</button>
    </div>
    <output data-result>Pending</output>
  `;

  const result = root.querySelector('[data-result]');
  const dialogService = createConfirmDialogService({ documentObj: document });
  root.querySelector('[data-action="open"]')?.addEventListener('click', async () => {
    const confirmed = await dialogService.requestConfirm({
      title: args.title,
      message: args.message,
      okLabel: args.okLabel,
      cancelLabel: args.cancelLabel,
    });
    result.textContent = confirmed ? 'Confirmed' : 'Cancelled';
  });

  root.__storybookCleanup = () => {
    dialogService.destroy?.();
  };
  return root;
}

const meta = {
  title: 'Shared/Confirm Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for the shared confirm dialog service. The story keeps the harness small and documents the promise-based API that grid and import/export flows use.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title shown when the confirm modal opens.',
    },
    message: {
      control: 'text',
      description: 'Dialog message shown in the modal body.',
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
    title: 'Delete Rows',
    message: 'Are you sure you want to delete these rows?',
    okLabel: 'Delete',
    cancelLabel: 'Keep Rows',
  },
};

export default meta;

export const ConfirmDelete = {
  render: renderConfirmDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Open confirm dialog**, then choose **Delete**. This story demonstrates the confirmed path and shows the resolved promise result underneath the trigger button.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open confirm dialog' }));
    const dialog = within(document.body);
    await userEvent.click(dialog.getByRole('button', { name: 'Delete' }));
    await expect(canvas.getByText('Confirmed')).toBeVisible();
  },
};

export const CancelDelete = {
  render: renderConfirmDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Open confirm dialog**, then choose **Keep Rows**. This story demonstrates the cancelled path and shows the resolved promise result underneath the trigger button.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open confirm dialog' }));
    const dialog = within(document.body);
    await userEvent.click(dialog.getByRole('button', { name: 'Keep Rows' }));
    await expect(canvas.getByText('Cancelled')).toBeVisible();
  },
};
