import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createTimedStatusPresenter } from '../../../../packages/core-ui/js/gui_components/shared/timed-error-display.js';

let timedStatusPresenterStoryInstanceCounter = 0;

function renderTimedStatusPresenterStory(args) {
  const root = document.createElement('section');
  const statusElementId = `storybook-timed-status-${++timedStatusPresenterStoryInstanceCounter}`;
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="show">Show timed status</button>
      <button type="button" data-action="clear">Clear timed status</button>
    </div>
    <div id="${statusElementId}" class="import-progress-status" role="status" aria-live="polite" style="min-height:1.5rem;"></div>
  `;

  const presenter = createTimedStatusPresenter({
    documentObj: document,
    elementId: statusElementId,
    timeoutMs: args.timeoutMs,
  });

  root.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    presenter.show(args.message, {
      severity: args.severity,
      timeoutMs: args.timeoutMs,
    });
  });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    presenter.clear();
  });

  return root;
}

const meta = {
  title: 'Shared/Timed Status Presenter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for `createTimedStatusPresenter`, the transient auto-clearing status surface used for schema, grid, import/export, and short-lived feedback states. This story documents the injected presenter API rather than the lower-level shared message component.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Status text shown when the presenter is asked to display a transient message.',
    },
    severity: {
      control: 'radio',
      options: ['normal', 'error', 'warning', 'info'],
      description: 'Severity applied through the underlying inline-message primitive.',
    },
    timeoutMs: {
      control: 'number',
      description: 'Auto-clear timeout used for transient timed-status messages.',
    },
  },
  args: {
    message: 'Schema invalid',
    severity: 'error',
    timeoutMs: 700,
  },
};

export default meta;

export const AutoClearingStatus = {
  render: renderTimedStatusPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show timed status** to demonstrate the transient timed-status presenter mode. This matches the kind of schema, import/export, or short-lived success/info/warning status that should appear briefly and then clear itself after the configured timeout.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await step('Show timed status', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Show timed status' }));
      await expect(status).toHaveTextContent('Schema invalid');
      await expect(status).toHaveAttribute('data-severity', 'error');
    });

    await step('Auto clear removes the timed status', async () => {
      await waitFor(
        () => {
          expect(status.textContent).toBe('');
          expect(status).not.toHaveAttribute('data-severity');
        },
        { timeout: 2000 }
      );
    });
  },
};

export const AutoClearingNormalStatus = {
  args: {
    message: 'Text preview refreshed.',
    severity: 'normal',
    timeoutMs: 700,
  },
  render: renderTimedStatusPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show timed status** to demonstrate a transient non-error status such as `Text preview refreshed.` This uses `severity: "normal"` so it auto-clears without applying severity styling.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await step('Show timed normal status', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Show timed status' }));
      await expect(status).toHaveTextContent('Text preview refreshed.');
      await expect(status).not.toHaveAttribute('data-severity');
    });

    await step('Auto clear removes the normal status', async () => {
      await waitFor(
        () => {
          expect(status.textContent).toBe('');
          expect(status).not.toHaveAttribute('data-severity');
        },
        { timeout: 2000 }
      );
    });
  },
};
