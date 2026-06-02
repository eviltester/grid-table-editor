import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createInlineMessageComponent } from '../../../../packages/core-ui/js/gui_components/shared/primitives/inline-message/index.js';

function renderInlineMessageStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '0.5rem';
  controls.innerHTML = `
    <button type="button" data-action="show">Show</button>
    <button type="button" data-action="clear">Clear</button>
  `;

  const messageRoot = document.createElement('div');
  messageRoot.className = 'import-progress-status';
  messageRoot.setAttribute('role', 'status');
  messageRoot.setAttribute('aria-live', 'polite');
  messageRoot.style.minHeight = '1.5rem';

  root.appendChild(controls);
  root.appendChild(messageRoot);

  const component = createInlineMessageComponent({
    root: messageRoot,
    props: {
      hideWhenEmpty: args.hideWhenEmpty,
      visibleDisplay: args.visibleDisplay,
      loadingClassName: args.loadingClassName,
      timeoutMs: args.timeoutMs,
    },
  });

  controls.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    if (args.mode === 'status') {
      component.setStatus(args.message, args.isLoading);
      return;
    }

    component.show(args.message, {
      severity: args.severity,
      sticky: args.sticky,
      timeoutMs: args.timeoutMs,
      isLoading: args.isLoading,
    });
  });

  controls.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    component.clear();
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Primitives/Inline Message',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'InlineMessage is a low-level UI primitive used underneath `createStatusPresenter`, `createLoadingStatusPresenter`, and `createTimedStatusPresenter`. These stories document the primitive itself, while most page-facing code should prefer the presenter/service APIs layered on top of it. Loading status mode now renders a visible spinner indicator so reviewers can distinguish active work from sticky warnings or static errors.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['status', 'timed'],
      description: 'Whether the story exercises status-presentation behavior or timed/severity-based error behavior.',
    },
    message: {
      control: 'text',
      description: 'Message text shown in the inline surface.',
    },
    severity: {
      control: 'radio',
      options: ['normal', 'error', 'warning', 'info'],
      description: 'Severity applied through `data-severity` in timed-message mode. `normal` clears severity styling.',
    },
    isLoading: {
      control: 'boolean',
      description:
        'Whether the message should render in loading mode, which applies the loading class and shows the spinner while a message is present.',
    },
    hideWhenEmpty: {
      control: 'boolean',
      description: 'Whether the message root should be hidden when no message is present.',
    },
    sticky: {
      control: 'boolean',
      description: 'Whether a timed message should stay visible until cleared manually.',
    },
    timeoutMs: {
      control: 'number',
      description: 'Auto-clear timeout for timed-message mode.',
    },
    visibleDisplay: {
      control: 'text',
      description: 'Display style used when showing a hidden message root.',
    },
    loadingClassName: {
      control: 'text',
      description:
        'Class name applied to the root element while the message is in loading mode, and removed otherwise.',
    },
  },
  args: {
    mode: 'status',
    message: 'Preparing export...',
    severity: 'error',
    isLoading: false,
    hideWhenEmpty: false,
    sticky: false,
    timeoutMs: 1500,
    visibleDisplay: 'inline-block',
    loadingClassName: 'is-loading',
  },
};

export default meta;

export const StatusLoading = {
  args: {
    mode: 'status',
    message: 'Preparing export...',
    isLoading: true,
    hideWhenEmpty: true,
  },
  render: renderInlineMessageStory,
  parameters: {
    docs: {
      description: {
        story:
          'Status mode. Click **Show** to simulate the app or generator setting a loading status. The message becomes visible, the loading class is applied, and a spinner indicator appears before the text while the status is active.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show' }));
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('Preparing export...');
    expect(status.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');
  },
};

export const TimedStatusAutoClear = {
  args: {
    mode: 'timed',
    message: 'Schema invalid',
    severity: 'error',
    sticky: false,
    timeoutMs: 700,
  },
  render: renderInlineMessageStory,
  parameters: {
    docs: {
      description: {
        story:
          'Timed status mode. Click **Show** to simulate a transient schema or import/export error. The surface applies `data-severity="error"` and then clears itself after the configured timeout.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await step('Show timed inline status', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Show' }));
      await expect(status).toHaveTextContent('Schema invalid');
      await expect(status).toHaveAttribute('data-severity', 'error');
    });

    await step('Auto clear removes the inline status', async () => {
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

export const TimedNormalStatusAutoClear = {
  args: {
    mode: 'timed',
    message: 'Text preview refreshed.',
    severity: 'normal',
    sticky: false,
    timeoutMs: 700,
  },
  render: renderInlineMessageStory,
  parameters: {
    docs: {
      description: {
        story:
          'Timed normal-status mode. Click **Show** to simulate a short-lived success or informational status such as `Text preview refreshed.` The message auto-clears without applying a `data-severity` attribute.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await step('Show timed normal status', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Show' }));
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

export const StickyWarning = {
  args: {
    mode: 'timed',
    message: 'Pairwise generation requires more enum columns.',
    severity: 'warning',
    sticky: true,
    timeoutMs: 1200,
  },
  render: renderInlineMessageStory,
  parameters: {
    docs: {
      description: {
        story:
          'Sticky warning mode. Click **Show** to simulate an error surface that should stay visible until the user or host logic clears it. This is useful for longer-lived validation or configuration warnings and does not show the loading spinner used by status mode.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show' }));
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('Pairwise generation requires more enum columns.');
  },
};
