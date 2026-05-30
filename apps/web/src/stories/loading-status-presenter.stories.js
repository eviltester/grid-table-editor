import { expect, userEvent, within } from 'storybook/test';
import { createLoadingStatusPresenter } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/index.js';

function renderLoadingStatusPresenterStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="show">Show loading status</button>
      <button type="button" data-action="clear">Clear status</button>
    </div>
    <div id="storybook-loading-status-presenter" class="import-progress-status" role="status" aria-live="polite" style="min-height:1.5rem;"></div>
  `;

  const presenter = createLoadingStatusPresenter({
    documentObj: document,
    elementId: 'storybook-loading-status-presenter',
    hideWhenEmpty: args.hideWhenEmpty,
    statusClassName: args.statusClassName,
    visibleDisplay: args.visibleDisplay,
  });

  root.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    presenter.setStatus(args.message);
  });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    presenter.clear();
  });

  return root;
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
