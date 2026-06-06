import { expect, userEvent, within } from 'storybook/test';
import { createStatusPresenter } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/status-presenter.js';

function createStatusPresenterHarness({ root, args, remountable = false }) {
  let presenter = null;
  let presenterRoot = null;

  const mountPresenter = () => {
    presenter?.destroy?.();
    presenterRoot.innerHTML = `
      <div
        class="import-progress-status"
        data-role="status-presenter-root"
        role="status"
        aria-live="polite"
        style="min-height:1.5rem;"
      ></div>
    `;

    presenter = createStatusPresenter({
      documentObj: document,
      resolveElement: () => presenterRoot?.querySelector?.('[data-role="status-presenter-root"]') || null,
      hideWhenEmpty: args.hideWhenEmpty,
      statusClassName: args.statusClassName,
      visibleDisplay: args.visibleDisplay,
    });
  };

  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="show">Show status</button>
      <button type="button" data-action="clear">Clear status</button>
      ${remountable ? '<button type="button" data-action="remount">Destroy and remount</button>' : ''}
    </div>
    <div data-role="presenter-host"></div>
  `;

  presenterRoot = root.querySelector('[data-role="presenter-host"]');
  mountPresenter();

  root.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    presenter.setStatus(args.message, {
      severity: args.severity,
      dismissable: args.dismissable,
    });
  });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    presenter.clear();
  });
  root.querySelector('[data-action="remount"]')?.addEventListener('click', () => {
    mountPresenter();
  });

  root.__storybookCleanup = () => {
    presenter?.destroy?.();
  };

  return root;
}

function renderStatusPresenterStory(args) {
  const root = document.createElement('section');
  return createStatusPresenterHarness({ root, args });
}

const meta = {
  title: 'Shared/Status Presenter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for `createStatusPresenter`, the non-loading app/generator status API layered over the inline-message primitive. Use this for completion, informational, warning, and error status messages that should not show the loading spinner. Dismissable statuses render a small close button that clears the message using the same shared clear path.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Status message rendered when the presenter is asked to show status.',
    },
    hideWhenEmpty: {
      control: 'boolean',
      description: 'Whether the status root is hidden when there is no message.',
    },
    severity: {
      control: 'radio',
      options: ['normal', 'info', 'warning', 'error'],
      description: 'Visual/status severity for the non-loading status surface.',
    },
    dismissable: {
      control: 'boolean',
      description: 'Whether the status shows a close button that clears the current message.',
    },
    statusClassName: {
      control: 'text',
      description: 'Reserved class name for status-surface styling when the loading presenter targets the same root.',
    },
    visibleDisplay: {
      control: 'text',
      description: 'Display style used when a previously hidden status root becomes visible.',
    },
  },
  args: {
    message: 'Generate complete. Grid and preview updated.',
    hideWhenEmpty: true,
    severity: 'normal',
    dismissable: false,
    statusClassName: 'is-loading',
    visibleDisplay: 'inline-block',
  },
};

export default meta;

export const CompletionStatus = {
  render: renderStatusPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show status** to demonstrate the non-loading completion state used by the app after generation steps such as `Generated 9 pairwise combinations.` and `Generate complete. Grid and preview updated.` This mode keeps the status visible without the loading spinner until a later action replaces it or the host clears it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showButton = canvas.getByRole('button', { name: 'Show status' });
    const clearButton = canvas.getByRole('button', { name: 'Clear status' });
    const status = canvas.getByRole('status');

    await userEvent.click(showButton);
    await expect(status).toHaveTextContent('Generate complete. Grid and preview updated.');
    await expect(status).not.toHaveClass('is-loading');
    expect(status.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('none');

    await userEvent.click(clearButton);
    await expect(status).toHaveTextContent('');
    await expect(status).not.toHaveClass('is-loading');
  },
};

export const DismissableStatus = {
  args: {
    message: 'Schema validation failed.',
    severity: 'error',
    dismissable: true,
  },
  render: renderStatusPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show status** to demonstrate a dismissable non-loading status message. This example uses `severity: "error"` to mirror current page-level failure statuses, but the same dismissable pattern can also be used with other non-loading status severities.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showButton = canvas.getByRole('button', { name: 'Show status' });
    const status = canvas.getByRole('status');

    await userEvent.click(showButton);
    await expect(status).toHaveTextContent('Schema validation failed.');
    await expect(status).toHaveAttribute('data-severity', 'error');
    await expect(status).not.toHaveClass('is-loading');

    const dismissButton = within(status).getByRole('button', { name: 'Dismiss message' });
    await userEvent.click(dismissButton);
    await expect(status).toHaveTextContent('');
  },
};

export const RemountableStatus = {
  args: {
    message: 'Secondary export complete.',
    severity: 'info',
    dismissable: false,
  },
  render: (args) => createStatusPresenterHarness({ root: document.createElement('section'), args, remountable: true }),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the non-loading presenter after an explicit destroy-and-remount cycle. Click **Destroy and remount** and then **Show status** again to confirm the rebuilt presenter still renders the message without inheriting stale loading state or dismiss buttons from the previous instance.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show status' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Secondary export complete.');
    await userEvent.click(canvas.getByRole('button', { name: 'Destroy and remount' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('');
    await userEvent.click(canvas.getByRole('button', { name: 'Show status' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Secondary export complete.');
    await expect(canvas.getByRole('status')).toHaveAttribute('data-severity', 'info');
  },
};
