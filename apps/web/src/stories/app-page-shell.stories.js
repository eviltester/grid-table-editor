import { expect, userEvent, within } from 'storybook/test';
import { createAppPageComponent } from '../../../../packages/core-ui/js/gui_components/app/page/app-page-shell.js';

function createShellPlaceholder({ title, description, minHeight = '7rem' } = {}) {
  const card = document.createElement('section');
  card.style.minHeight = minHeight;
  card.style.padding = '0.9rem 1rem';
  card.style.border = '1px dashed #9ca3af';
  card.style.borderRadius = '0.75rem';
  card.style.background = '#f9fafb';

  const heading = document.createElement('h2');
  heading.textContent = title;
  heading.style.margin = '0 0 0.35rem';
  heading.style.fontSize = '1rem';

  const copy = document.createElement('p');
  copy.textContent = description;
  copy.style.margin = '0';
  copy.style.color = '#4b5563';

  card.append(heading, copy);
  return card;
}

function mountShellPlaceholders(root) {
  root.querySelector('#page-instructions')?.append(
    createShellPlaceholder({
      title: 'Instructions Mount Root',
      description: 'Shared instructions component mounts here in the real app runtime.',
      minHeight: '5.25rem',
    })
  );
  root.querySelector('#main-grid-view')?.append(
    createShellPlaceholder({
      title: 'Grid Editor Mount Root',
      description: 'The data-grid editor feature fills this area in the real page.',
      minHeight: '14rem',
    })
  );
  root.querySelector('#testDataGeneratorContainer')?.append(
    createShellPlaceholder({
      title: 'Test Data Panel Mount Root',
      description: 'The embedded test-data generation panel mounts inside the details shell.',
      minHeight: '8rem',
    })
  );
  root.querySelector('#import-export-controls')?.append(
    createShellPlaceholder({
      title: 'Import / Export Workspace Mount Root',
      description: 'Import/export workspace mounts directly here; its toolbar owns its own details shell.',
      minHeight: '10rem',
    })
  );
}

function renderAppPageShellStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'App page shell story');
  root.style.maxWidth = args.compactLayout ? '48rem' : 'none';

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'App page shell example');
  componentRoot.setAttribute('role', 'group');
  root.appendChild(componentRoot);

  const component = createAppPageComponent({
    root: componentRoot,
    props: {
      showTestDataOpen: args.showTestDataOpen,
    },
  });

  mountShellPlaceholders(componentRoot);

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/App/Page Shell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'AppPageShell owns only the reusable page layout roots for instructions, main grid, embedded test-data panel, and import/export workspace. Test Data uses a native details shell at page level; Import / Export mounts directly and its workspace owns a sync row plus a toolbar disclosure internally. The visible cards in these stories are explicit placeholders so reviewers can inspect shell composition without bootstrapping the full runtime.',
      },
    },
  },
  args: {
    showTestDataOpen: false,
    compactLayout: false,
  },
  argTypes: {
    showTestDataOpen: {
      control: 'boolean',
      description: 'Whether the embedded test-data details shell starts expanded.',
    },
    compactLayout: {
      control: 'boolean',
      description: 'Constrains the shell width so reviewers can inspect the stacked layout more easily.',
    },
  },
  render: renderAppPageShellStory,
};

export default meta;

export const ClosedByDefault = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the shell in its default app-page state with the embedded test-data panel collapsed. Review the four mount roots and their ordering without bringing in the full app runtime.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const shell = canvas.getByRole('group', { name: 'App page shell example' });
    const summary = canvas.getByText('Test Data');
    await expect(canvas.getByText('Instructions Mount Root')).toBeVisible();
    await expect(canvas.getByText('Grid Editor Mount Root')).toBeVisible();
    await expect(canvas.getByText('Import / Export Workspace Mount Root')).toBeVisible();
    const details = shell.querySelectorAll('details');
    await expect(details[0]?.open).toBe(false);
    await expect(details.length).toBe(1);
    await userEvent.click(summary);
    await expect(details[0]?.open).toBe(true);
  },
};

export const OpenByDefault = {
  args: {
    showTestDataOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the shell in the open test-data state used by the app Storybook page and many focused reviews. The test-data mount root is visible immediately, which makes the layout relationship between grid, panel, and import/export area easier to inspect.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Test Data Panel Mount Root')).toBeVisible();
    const details = canvas.getByRole('group', { name: 'App page shell example' }).querySelectorAll('details');
    await expect(details[0]?.open).toBe(true);
    await expect(details.length).toBe(1);
  },
};

export const CompactLayout = {
  args: {
    showTestDataOpen: true,
    compactLayout: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains the shell width so reviewers can inspect how the shell stacks before the real child features bring their own heavier UI. This is useful when judging whether a later feature split still belongs in the shell or in a child component.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Grid Editor Mount Root')).toBeVisible();
    await expect(canvas.getByText('Test Data Panel Mount Root')).toBeVisible();
  },
};
