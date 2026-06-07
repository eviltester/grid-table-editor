import { expect, within } from 'storybook/test';
import { createGeneratorPageShellComponent } from '../../../../packages/core-ui/js/gui_components/generator/page/create-generator-page-shell-component.js';

function createShellPlaceholder({ title, description, minHeight = '8rem' } = {}) {
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
  root.querySelector('#generator-instructions')?.append(
    createShellPlaceholder({
      title: 'Generator Instructions Mount Root',
      description: 'Shared generator instructions mount here in the real page runtime.',
      minHeight: '5.25rem',
    })
  );
  root.querySelector('#generator-app')?.append(
    createShellPlaceholder({
      title: 'Generator Feature Mount Root',
      description: 'Generator schema, controls, and preview features mount here as one page-level feature tree.',
      minHeight: '18rem',
    })
  );
}

function renderGeneratorPageShellStory(args) {
  const root = document.createElement('main');
  root.setAttribute('aria-label', 'Generator page shell story');
  root.style.maxWidth = args.compactLayout ? '44rem' : 'none';

  const componentRoot = document.createElement('section');
  componentRoot.setAttribute('aria-label', 'Generator page shell example');
  componentRoot.setAttribute('role', 'group');
  root.appendChild(componentRoot);

  const component = createGeneratorPageShellComponent({
    root: componentRoot,
    props: {},
  });

  mountShellPlaceholders(componentRoot);

  root.__storybookCleanup = () => component.destroy();
  return root;
}

const meta = {
  title: 'Pages/Generator/Page Shell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'GeneratorPageShell owns the reusable shell layout for generator instructions and the generator feature mount root. The visible cards in these stories are explicit placeholders so reviewers can inspect shell composition separately from the real generator runtime.',
      },
    },
  },
  args: {
    compactLayout: false,
  },
  argTypes: {
    compactLayout: {
      control: 'boolean',
      description:
        'Constrains the shell width so reviewers can inspect the stacked generator shell layout more easily.',
    },
  },
  render: renderGeneratorPageShellStory,
};

export default meta;

export const DefaultShell = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows the generator shell in its normal layout with explicit placeholders for the instructions root and the generator feature root. This lets reviewers judge the shell structure without bootstrapping schema, controls, and preview behavior.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Generator Instructions Mount Root')).toBeVisible();
    await expect(canvas.getByText('Generator Feature Mount Root')).toBeVisible();
  },
};

export const CompactLayout = {
  args: {
    compactLayout: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Constrains the shell width so reviewers can inspect the generator page shell without the broader full-page horizontal space. This is useful when deciding whether future layout changes belong in the shell or in the generator feature tree.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Generator Feature Mount Root')).toBeVisible();
  },
};
