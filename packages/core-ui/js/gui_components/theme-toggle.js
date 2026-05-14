const LEGACY_THEME_STORAGE_KEY = 'anywaydata-theme';
const DOCUSAURUS_THEME_STORAGE_KEY = 'theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

function getStoredTheme(storage) {
  try {
    const docusaurusTheme = storage?.getItem?.(DOCUSAURUS_THEME_STORAGE_KEY) || '';
    if (docusaurusTheme === LIGHT_THEME || docusaurusTheme === DARK_THEME) {
      return docusaurusTheme;
    }
    return storage?.getItem?.(LEGACY_THEME_STORAGE_KEY) || '';
  } catch (_error) {
    return '';
  }
}

function setStoredTheme(storage, theme) {
  try {
    storage?.setItem?.(DOCUSAURUS_THEME_STORAGE_KEY, theme);
    storage?.setItem?.(LEGACY_THEME_STORAGE_KEY, theme);
  } catch (_error) {
    // ignore storage failures
  }
}

function resolveInitialTheme(windowObj) {
  const stored = getStoredTheme(windowObj?.localStorage);
  if (stored === LIGHT_THEME || stored === DARK_THEME) {
    return stored;
  }
  const prefersDark = windowObj?.matchMedia?.('(prefers-color-scheme: dark)')?.matches === true;
  return prefersDark ? DARK_THEME : LIGHT_THEME;
}

function applyTheme(documentObj, theme) {
  const body = documentObj?.body;
  if (!body) {
    return;
  }
  body.classList.remove('theme-light', 'theme-dark');
  body.classList.add(theme === DARK_THEME ? 'theme-dark' : 'theme-light');
}

function ensureThemeToggleButton(documentObj) {
  const header = documentObj?.querySelector?.('.header');
  if (!header) {
    return null;
  }

  let container = header.querySelector('.theme-toggle-container');
  if (!container) {
    container = documentObj.createElement('div');
    container.className = 'theme-toggle-container';
    header.appendChild(container);
  }

  let button = container.querySelector('#theme-toggle-button');
  if (!button) {
    button = documentObj.createElement('button');
    button.id = 'theme-toggle-button';
    button.type = 'button';
    button.className = 'theme-toggle-button';
    container.appendChild(button);
  }

  return button;
}

function updateToggleButtonLabel(button, theme) {
  if (!button) {
    return;
  }
  const isDark = theme === DARK_THEME;
  const nextThemeLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  button.textContent = isDark ? '☀' : '🌙';
  button.setAttribute('aria-label', nextThemeLabel);
  button.setAttribute('title', nextThemeLabel);
}

function initThemeToggle({ documentObj = document, windowObj = window } = {}) {
  const button = ensureThemeToggleButton(documentObj);
  if (!button) {
    return;
  }

  let currentTheme = resolveInitialTheme(windowObj);
  applyTheme(documentObj, currentTheme);
  updateToggleButtonLabel(button, currentTheme);

  button.addEventListener('click', () => {
    currentTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(documentObj, currentTheme);
    setStoredTheme(windowObj?.localStorage, currentTheme);
    updateToggleButtonLabel(button, currentTheme);
  });
}

export { initThemeToggle };
