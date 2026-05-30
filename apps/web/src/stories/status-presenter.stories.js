import { expect, userEvent, within } from 'storybook/test';
import { createStatusPresenter } from '../../../../packages/core-ui/js/gui_components/shared/test-data/ui/index.js';

function renderStatusPresenterStory(args) {
  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';

  root.innerHTML = `
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button type="button" data-action="show">Show status</button>
      <button type="button" data-action="clear">Clear status</button>
    </div>
    <div id="storybook-status-presenter" role="status" aria-live="polite" style="min-height:1.5rem;"></div>
  `;

  const presenter = createStatusPresenter({
    documentObj: document,
    elementId: 'storybook-status-presenter',
    hideWhenEmpty: args.hideWhenEmpty,
    loadingClassName: args.loadingClassName,
    visibleDisplay: args.visibleDisplay,
  });

  root.querySelector('[data-action="show"]')?.addEventListener('click', () => {
    presenter.setStatus(args.message, args.isLoading);
  });
  root.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    presenter.clear();
  });

  return root;
}

const meta = {
  title: 'Shared/Status Presenter',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Service-level Storybook coverage for `createStatusPresenter`, the app/generator status API layered over the inline-message primitive. This story demonstrates the presenter API directly, without page bootstrap.',
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Status message rendered when the presenter is asked to show status.',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the status presenter should apply its loading class while the status is visible.',
    },
    hideWhenEmpty: {
      control: 'boolean',
      description: 'Whether the status root is hidden when there is no message.',
    },
    loadingClassName: {
      control: 'text',
      description: 'Class applied while the presenter is showing a loading state.',
    },
    visibleDisplay: {
      control: 'text',
      description: 'Display style used when a previously hidden status root becomes visible.',
    },
  },
  args: {
    message: 'Preparing export...',
    isLoading: true,
    hideWhenEmpty: true,
    loadingClassName: 'is-loading',
    visibleDisplay: 'inline-block',
  },
};

export default meta;

export const LoadingStatus = {
  render: renderStatusPresenterStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click **Show status** to demonstrate the presenter-driven loading state used in app and generator flows. The status should show both text and a spinner indicator. Then click **Clear status** to confirm the message disappears, and click **Show status** again to verify the presenter can re-show the same status cleanly.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showButton = canvas.getByRole('button', { name: 'Show status' });
    const clearButton = canvas.getByRole('button', { name: 'Clear status' });
    const status = canvas.getByRole('status');

    await userEvent.click(showButton);
    await expect(status).toHaveTextContent('Preparing export...');
    await expect(status).toHaveClass('is-loading');
    expect(status.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');

    await userEvent.click(clearButton);
    await expect(status).toHaveTextContent('');
    await expect(status).not.toHaveClass('is-loading');

    await userEvent.click(showButton);
    await expect(status).toHaveTextContent('Preparing export...');
    await expect(status).toHaveClass('is-loading');
    expect(status.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');
  },
};
