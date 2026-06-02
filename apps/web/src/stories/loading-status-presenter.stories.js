import { expect, userEvent, within } from 'storybook/test';
import { createLoadingStatusPresenter } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/index.js';

let loadingStatusPresenterStoryInstanceId = 0;

function createLoadingStatusPresenterHarness({ root, args, remountable = false }) {
  let presenter = null;
  let presenterRoot = null;

  const mountPresenter = () => {
    presenter?.destroy?.();
    loadingStatusPresenterStoryInstanceId += 1;
    const elementId = `storybook-loading-status-presenter-${loadingStatusPresenterStoryInstanceId}`;
    presenterRoot.innerHTML = `
      <div id="${elementId}" class="import-progress-status" role="status" aria-live="polite" style="min-height:1.5rem;"></div>
    `;

    presenter = createLoadingStatusPresenter({
      documentObj: document,
      elementId,
      hideWhenEmpty: args.hideWhenEmpty,
      statusClassName: args.statusClassName,
      visibleDisplay: args.visibleDisplay,
    });
  };

  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="show">Show loading status</button>
      <button type="button" data-action="clear">Clear status</button>
      ${remountable ? '<button type="button" data-action="remount">Destroy and remount</button>' : ''}
    </div>
    <div data-role="presenter-host"></div>
  `;

  presenterRoot = root.querySelector('[data-role="presenter-host"]');
  mountPresenter();

  root.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    presenter.setStatus(args.message);
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

function renderLoadingStatusPresenterStory(args) {
  const root = document.createElement('section');
  return createLoadingStatusPresenterHarness({ root, args });
}

const meta = {
  title: 'Shared/Loading Status Presenter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for `createLoadingStatusPresenter`, the loading-only status API layered over the inline-message primitive. Use this when work is actively in progress and the shared spinner/loading class should always be shown.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Loading status message rendered when the presenter is asked to show status.',
    },
    hideWhenEmpty: {
      control: 'boolean',
      description: 'Whether the status root is hidden when there is no message.',
    },
    statusClassName: {
      control: 'text',
      description: 'Class applied while the loading status is visible.',
    },
    visibleDisplay: {
      control: 'text',
      description: 'Display style used when a previously hidden status root becomes visible.',
    },
  },
  args: {
    message: 'Preparing export...',
    hideWhenEmpty: true,
    statusClassName: 'is-loading',
    visibleDisplay: 'inline-block',
  },
};

export default meta;

export const LoadingStatus = {
  render: renderLoadingStatusPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show loading status** to demonstrate the loading state used in app and generator flows. The status shows both text and the spinner indicator, and there is no non-loading toggle in this presenter.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showButton = canvas.getByRole('button', { name: 'Show loading status' });
    const clearButton = canvas.getByRole('button', { name: 'Clear status' });
    const status = canvas.getByRole('status');

    await userEvent.click(showButton);
    await expect(status).toHaveTextContent('Preparing export...');
    await expect(status).toHaveClass('is-loading');
    expect(status.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');

    await userEvent.click(clearButton);
    await expect(status).toHaveTextContent('');
    await expect(status).not.toHaveClass('is-loading');
  },
};

export const RemountableLoadingStatus = {
  render: (args) =>
    createLoadingStatusPresenterHarness({ root: document.createElement('section'), args, remountable: true }),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the loading-only presenter after an explicit destroy-and-remount cycle. Click **Destroy and remount** and then **Show loading status** again to confirm the rebuilt presenter still shows the spinner and loading class, which is the key difference from the plain Status Presenter.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show loading status' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Preparing export...');
    await expect(canvas.getByRole('status')).toHaveClass('is-loading');
    await userEvent.click(canvas.getByRole('button', { name: 'Destroy and remount' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('');
    await expect(canvas.getByRole('status')).not.toHaveClass('is-loading');
    await userEvent.click(canvas.getByRole('button', { name: 'Show loading status' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Preparing export...');
    await expect(canvas.getByRole('status')).toHaveClass('is-loading');
  },
};
