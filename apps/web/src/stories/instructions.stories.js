import { expect, userEvent, within } from 'storybook/test';
import { createInstructionsComponent } from '../../../../packages/core-ui/js/gui_components/shared/instructions/index.js';
import { APP_PAGE_INSTRUCTIONS_PROPS } from '../../../../packages/core-ui/js/gui_components/shared/instructions/app-page-instructions.js';
import { GENERATOR_PAGE_INSTRUCTIONS_PROPS } from '../../../../packages/core-ui/js/gui_components/shared/instructions/generator-page-instructions.js';

function renderInstructionsStory(args) {
  const root = document.createElement('section');
  const log = document.createElement('pre');
  log.setAttribute('aria-label', 'Instructions action log');
  log.style.marginTop = '0.75rem';
  log.style.padding = '0.5rem';
  log.style.background = '#f3f4f6';
  log.textContent = 'No actions yet.';
  root.appendChild(log);

  const componentRoot = document.createElement('div');
  root.appendChild(componentRoot);

  const component = createInstructionsComponent({
    root: componentRoot,
    props: {
      ...(args.variant === 'generator' ? GENERATOR_PAGE_INSTRUCTIONS_PROPS : APP_PAGE_INSTRUCTIONS_PROPS),
      initiallyOpen: true,
    },
  });

  componentRoot.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-role="instructions-action-button"]');
    if (actionButton?.getAttribute('data-action-id') === 'copy-instructions-to-grid') {
      log.textContent = 'action:copy-instructions-to-grid';
    }
  });

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Shared/Instructions',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Instructions is the shared page-level guidance component now reused by both the app page and the generator page. It owns the instructions summary, help icon, list content, optional actions, and optional footer content while preserving the existing `.instructions` DOM contract used by the pages.',
      },
    },
  },
  args: {
    variant: 'app',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['app', 'generator'],
      description: 'Selects the shared instructions content profile used by the app page or generator page.',
    },
  },
  render: renderInstructionsStory,
};

export default meta;

export const App = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the app-page instructions variant, including the existing copy-to-grid action and footer links. Expand the details and click the copy button to confirm the shared component preserves the app behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Instructions')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Copy Instructions To Grid' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Copy Instructions To Grid' }));
    await expect(canvas.getByText('action:copy-instructions-to-grid')).toBeVisible();
  },
};

export const Generator = {
  args: {
    variant: 'generator',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the generator-page instructions variant. This version uses the shared generator overview help entry and list guidance, but does not render the app-only copy-to-grid action or footer.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Data Generator Instructions')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Copy Instructions To Grid' })).toBeNull();
    await expect(canvas.getByText(/Generate Pairwise combinations/i)).toBeVisible();
  },
};
