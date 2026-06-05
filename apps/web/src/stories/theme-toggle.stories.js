import { expect, userEvent, within } from 'storybook/test';
import { createThemeToggleComponent } from '../../../../packages/core-ui/js/gui_components/shared/theme-toggle.js';

function clearThemeState() {
  document.body.classList.remove('theme-light', 'theme-dark');
  try {
    window.localStorage.removeItem('theme');
    window.localStorage.removeItem('anywaydata-theme');
  } catch {
    // ignore storage cleanup failures in Storybook
  }
}

function renderThemeToggleStory() {
  clearThemeState();

  const root = document.createElement('section');
  root.style.display = 'grid';
  root.style.gap = '0.75rem';
  root.innerHTML = `
    <div class="header" data-role="theme-toggle-host" style="position:relative; min-height:3rem;"></div>
    <output data-role="theme-result">Pending</output>
  `;

  const result = root.querySelector('[data-role="theme-result"]');
  const themeToggle = createThemeToggleComponent({
    documentObj: document,
    windowObj: window,
    rootElement: root,
    props: {
      onThemeChanged(theme) {
        result.textContent = theme;
      },
    },
  });

  root.__storybookCleanup = () => {
    themeToggle?.destroy?.();
    clearThemeState();
  };

  return root;
}

const meta = {
  title: 'Shared/Theme Toggle',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small page-shell feature component that owns the theme-toggle button lifecycle, persists the selected theme to storage, and applies `theme-light` / `theme-dark` classes on the document body.',
      },
    },
  },
};

export default meta;

export const ToggleBetweenThemes = {
  render: renderThemeToggleStory,
  parameters: {
    docs: {
      description: {
        story:
          'Click the moon/sun button in the header area to toggle themes. The output beneath the header shows the current theme, and the page body receives the matching `theme-light` or `theme-dark` class.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('light')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Switch to dark theme' }));
    await expect(canvas.getByText('dark')).toBeVisible();
  },
};
