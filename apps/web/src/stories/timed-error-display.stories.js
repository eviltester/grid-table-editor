import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createTimedErrorPresenter } from '../../../../packages/core-ui/js/gui_components/shared/timed-error-display.js';

function renderTimedErrorPresenterStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="show">Show error</button>
      <button type="button" data-action="clear">Clear error</button>
    </div>
    <div id="storybook-timed-error" role="status" aria-live="polite" style="min-height:1.5rem;"></div>
  `;

  const presenter = createTimedErrorPresenter({
    documentObj: document,
    elementId: 'storybook-timed-error',
    timeoutMs: args.timeoutMs,
  });

  root.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    presenter.show(args.message, {
      severity: args.severity,
      sticky: args.sticky,
      timeoutMs: args.timeoutMs,
    });
  });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    presenter.clear();
  });

  return root;
}

const meta = {
  title: 'Shared/Timed Error Presenter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for `createTimedErrorPresenter`, the timed error surface used for schema, grid, and import/export error states. This story documents the injected presenter API rather than the lower-level shared message component.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Error text shown when the presenter is asked to display an error.',
    },
    severity: {
      control: 'radio',
      options: ['error', 'warning', 'info'],
      description: 'Severity applied through the underlying inline-message primitive.',
    },
    sticky: {
      control: 'boolean',
      description: 'Whether the error stays visible until cleared manually.',
    },
    timeoutMs: {
      control: 'number',
      description: 'Auto-clear timeout used for transient error messages.',
    },
  },
  args: {
    message: 'Schema invalid',
    severity: 'error',
    sticky: false,
    timeoutMs: 700,
  },
};

export default meta;

export const AutoClearingError = {
  render: renderTimedErrorPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show error** to demonstrate the transient timed-error presenter mode. This matches the kind of schema or import/export error that should appear briefly and then clear itself after the configured timeout.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await step('Show timed error', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Show error' }));
      await expect(status).toHaveTextContent('Schema invalid');
      await expect(status).toHaveAttribute('data-severity', 'error');
    });

    await step('Auto clear removes the error', async () => {
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
