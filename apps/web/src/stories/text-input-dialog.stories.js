import React from 'react';
import { Canvas, Controls, Description, Title } from '@storybook/addon-docs/blocks';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createTextInputDialogService } from '../../../../packages/core-ui/js/gui_components/shared/dialog-services/text-input-dialog-service.js';

function renderTextInputDialogStory(args) {
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

  root.__storybookCleanup = () => {
    dialogService.destroy?.();
  };
  return root;
}

function renderVisualTextInputDialogStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div
      class="text-input-modal-backdrop"
      data-role="visual-text-input-backdrop"
      style="position:relative; inset:auto; display:flex; min-height:16rem;"
    >
      <div
        class="text-input-modal"
        data-role="text-input-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visual-text-input-dialog-title"
      >
        <h3
          id="visual-text-input-dialog-title"
          data-role="text-input-dialog-title"
          class="text-input-modal-title"
        >${args.title}</h3>
        <input
          data-role="text-input-dialog-field"
          type="text"
          class="text-input-modal-field"
          value="${args.initialValue.replace(/"/g, '&quot;')}"
          aria-label="${args.title}"
        />
        <div class="text-input-modal-actions">
          <button type="button" data-role="text-input-dialog-ok">${args.okLabel}</button>
          <button type="button" data-role="text-input-dialog-cancel">${args.cancelLabel}</button>
        </div>
      </div>
    </div>
    <output data-role="visual-text-input-log" aria-label="Text input dialog action log">No actions yet.</output>
  `;

  const backdrop = root.querySelector('[data-role="visual-text-input-backdrop"]');
  const input = root.querySelector('[data-role="text-input-dialog-field"]');
  const log = root.querySelector('[data-role="visual-text-input-log"]');

  const writeLog = (value) => {
    log.textContent = value;
  };

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      writeLog('action:backdrop');
      args.onBackdrop?.();
      return;
    }
    if (event.target?.closest?.('[data-role="text-input-dialog-ok"]')) {
      writeLog(`action:submit:${input.value}`);
      args.onSubmit?.(input.value);
      return;
    }
    if (event.target?.closest?.('[data-role="text-input-dialog-cancel"]')) {
      writeLog('action:cancel');
      args.onCancel?.();
    }
  });

  input.addEventListener('input', () => {
    args.onInput?.(input.value);
  });

  return root;
}

const meta = {
  title: 'Shared/Text Input Dialog',
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
          React.createElement(Canvas, { of: SubmitFilterValue }),
          React.createElement(Canvas, { of: CancelTextInput })
        ),
      description: {
        component:
          'Service-level Storybook coverage for the shared text-input dialog service. The visual always-open example is reviewer-facing and non-dismissing, while the other stories keep documenting the real promise-returning dialog lifecycle.',
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
    onSubmit: {
      description: 'Storybook action fired by the visual always-open example when Apply is clicked.',
      table: { category: 'Events' },
    },
    onCancel: {
      description: 'Storybook action fired by the visual always-open example when Cancel is clicked.',
      table: { category: 'Events' },
    },
    onBackdrop: {
      description: 'Storybook action fired by the visual always-open example when the backdrop is clicked.',
      table: { category: 'Events' },
    },
    onInput: {
      description: 'Storybook action fired as the visual always-open example field is edited.',
      table: { category: 'Events' },
    },
  },
  args: {
    title: 'Filter Column',
    initialValue: 'Current filter',
    okLabel: 'Apply',
    cancelLabel: 'Cancel',
    onSubmit: fn(),
    onCancel: fn(),
    onBackdrop: fn(),
    onInput: fn(),
  },
};

export default meta;

export const VisualAlwaysOpen = {
  render: renderVisualTextInputDialogStory,
  parameters: {
    docs: {
      description: {
        story:
          'This reviewer-facing example renders the text input dialog immediately and intentionally never closes. **Apply**, **Cancel**, and backdrop clicks all log what would have happened while the dialog stays visible for inspection, and the field remains editable.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Filter Column' });
    await expect(canvas.getByRole('dialog', { name: 'Filter Column' })).toBeVisible();

    await userEvent.click(input);
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(input, 'Status: Active');
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('action:submit:Status: Active')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Filter Column' })).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(canvas.getByText('action:cancel')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Filter Column' })).toBeVisible();

    await userEvent.click(canvasElement.querySelector('[data-role="visual-text-input-backdrop"]'));
    await expect(canvas.getByText('action:backdrop')).toBeVisible();
    await expect(canvas.getByRole('dialog', { name: 'Filter Column' })).toBeVisible();
  },
};

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
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    await userEvent.type(input, 'Status: Active');
    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(canvas.getByText('Status: Active')).toBeVisible();
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
