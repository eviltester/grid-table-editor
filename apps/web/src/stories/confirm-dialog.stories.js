import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
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

function renderVisualConfirmDialogStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div
      class="text-input-modal-backdrop"
      data-role="visual-confirm-backdrop"
      style="position:relative; inset:auto; display:flex; min-height:16rem;"
    >
      <div
        class="text-input-modal"
        data-role="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visual-confirm-dialog-title"
      >
        <h3
          id="visual-confirm-dialog-title"
          data-role="confirm-dialog-title"
          class="text-input-modal-title"
        >${args.title}</h3>
        <p data-role="confirm-dialog-message" class="text-input-modal-message">${args.message}</p>
        <div class="text-input-modal-actions">
          <button type="button" data-role="confirm-dialog-ok">${args.okLabel}</button>
          <button type="button" data-role="confirm-dialog-cancel">${args.cancelLabel}</button>
        </div>
      </div>
    </div>
    <output data-role="visual-confirm-log" aria-label="Confirm dialog action log">No actions yet.</output>
  `;

  const backdrop = root.querySelector('[data-role="visual-confirm-backdrop"]');
  const log = root.querySelector('[data-role="visual-confirm-log"]');

  const writeLog = (value) => {
    log.textContent = value;
  };

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      writeLog('action:backdrop');
      args.onBackdrop?.();
      return;
    }
    if (event.target?.closest?.('[data-role="confirm-dialog-ok"]')) {
      writeLog('action:confirm');
      args.onConfirm?.();
      return;
    }
    if (event.target?.closest?.('[data-role="confirm-dialog-cancel"]')) {
      writeLog('action:cancel');
      args.onCancel?.();
    }
  });

  return root;
}

const meta = {
  title: 'Shared/Confirm Dialog',
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
          React.createElement(Canvas, { of: VisualAlwaysOpen }),
          React.createElement(Canvas, { of: ConfirmDelete }),
          React.createElement(Canvas, { of: CancelDelete })
        ),
      description: {
        component:
          'Service-level Storybook coverage for the shared confirm dialog service. The visual always-open example is reviewer-facing and non-dismissing, while the other stories keep documenting the real promise-based dialog lifecycle.',
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
    onConfirm: {
      description: 'Storybook action fired by the visual always-open example when the confirm action is clicked.',
      table: { category: 'Events' },
    },
    onCancel: {
      description: 'Storybook action fired by the visual always-open example when the cancel action is clicked.',
      table: { category: 'Events' },
    },
    onBackdrop: {
      description: 'Storybook action fired by the visual always-open example when the backdrop is clicked.',
      table: { category: 'Events' },
    },
  },
  args: {
    title: 'Delete Rows',
    message: 'Are you sure you want to delete these rows?',
    okLabel: 'Delete',
    cancelLabel: 'Keep Rows',
    onConfirm: fn(),
    onCancel: fn(),
    onBackdrop: fn(),
  },
};

export default meta;

export const VisualAlwaysOpen = {
  render: renderVisualConfirmDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'This reviewer-facing example renders the confirm dialog immediately and intentionally never closes. **Delete**, **Keep Rows**, and backdrop clicks all log what would have happened while the dialog stays visible for visual inspection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const backdrop = canvasElement.querySelector('[data-role="visual-confirm-backdrop"]');
    await expect(canvas.getByRole('dialog', { name: 'Delete Rows' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(canvas.getByText('action:confirm')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Delete Rows' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Keep Rows' }));
    await expect(canvas.getByText('action:cancel')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Delete Rows' })).toBeVisible();

    await userEvent.click(backdrop);
    await expect(canvas.getByText('action:backdrop')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Delete Rows' })).toBeVisible();
  },
};

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
