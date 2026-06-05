const LEGACY_THEME_STORAGE_KEY = 'anywaydata-theme';
const DOCUSAURUS_THEME_STORAGE_KEY = 'theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const THEME_TOGGLE_COMPONENT_OWNER = 'theme-toggle-component';
const THEME_TOGGLE_CONTAINER_ROLE = 'theme-toggle-container';
const THEME_TOGGLE_BUTTON_ROLE = 'theme-toggle-button';
const themeToggleInstances = new WeakMap();

function getDefaultDocumentObj() {
  return typeof document !== 'undefined' ? document : null;
}

function getDefaultWindowObj() {
  return typeof window !== 'undefined' ? window : null;
}

function getStoredTheme(storage) {
  try {
    const docusaurusTheme = storage?.getItem?.(DOCUSAURUS_THEME_STORAGE_KEY) || '';
    if (docusaurusTheme === LIGHT_THEME || docusaurusTheme === DARK_THEME) {
      return docusaurusTheme;
    }
    return storage?.getItem?.(LEGACY_THEME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function setStoredTheme(storage, theme) {
  try {
    storage?.setItem?.(DOCUSAURUS_THEME_STORAGE_KEY, theme);
    storage?.setItem?.(LEGACY_THEME_STORAGE_KEY, theme);
  } catch {
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

function resolveThemeToggleHost({ rootElement, hostElement } = {}) {
  if (hostElement) {
    return hostElement;
  }

  if (rootElement?.matches?.('.header, [data-role="theme-toggle-host"]')) {
    return rootElement;
  }

  return rootElement?.querySelector?.('.header, [data-role="theme-toggle-host"]') || null;
}

function ensureThemeToggleElements({ documentObj, hostElement } = {}) {
  if (!hostElement) {
    return null;
  }

  let container = hostElement.querySelector(`.theme-toggle-container[data-role="${THEME_TOGGLE_CONTAINER_ROLE}"]`);
  if (!container) {
    container = documentObj.createElement('div');
    container.className = 'theme-toggle-container';
    container.setAttribute('data-role', THEME_TOGGLE_CONTAINER_ROLE);
    container.setAttribute('data-owner', THEME_TOGGLE_COMPONENT_OWNER);
    hostElement.appendChild(container);
  }

  let button = container.querySelector(`[data-role="${THEME_TOGGLE_BUTTON_ROLE}"]`);
  if (!button) {
    button = documentObj.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle-button';
    button.setAttribute('data-role', THEME_TOGGLE_BUTTON_ROLE);
    container.appendChild(button);
  }

  return {
    container,
    button,
  };
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

function createThemeToggleComponent({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  rootElement = documentObj,
  hostElement,
  props = {},
} = {}) {
  if (!documentObj) {
    return null;
  }

  const resolvedHostElement = resolveThemeToggleHost({ rootElement, hostElement });
  const elements = ensureThemeToggleElements({
    documentObj,
    hostElement: resolvedHostElement,
  });
  if (!elements) {
    return null;
  }

  const { container, button } = elements;
  let currentProps = { ...props };
  let currentTheme = resolveInitialTheme(windowObj);

  function notifyThemeChanged() {
    currentProps.onThemeChanged?.(currentTheme);
  }

  function renderTheme(theme, { persist = false } = {}) {
    currentTheme = theme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
    applyTheme(documentObj, currentTheme);
    updateToggleButtonLabel(button, currentTheme);
    if (persist) {
      setStoredTheme(windowObj?.localStorage, currentTheme);
    }
    notifyThemeChanged();
  }

  function handleClick() {
    renderTheme(currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME, { persist: true });
  }

  button.addEventListener('click', handleClick);
  renderTheme(currentTheme);

  return {
    update(nextProps = {}) {
      currentProps = { ...currentProps, ...nextProps };
      notifyThemeChanged();
    },
    destroy() {
      button.removeEventListener('click', handleClick);
      if (container.getAttribute('data-owner') === THEME_TOGGLE_COMPONENT_OWNER) {
        container.remove();
      }
    },
    getState() {
      return {
        theme: currentTheme,
      };
    },
    setTheme(nextTheme, options = {}) {
      renderTheme(nextTheme, options);
    },
    toggleTheme() {
      handleClick();
    },
  };
}

function initThemeToggle({
  documentObj = getDefaultDocumentObj(),
  windowObj = getDefaultWindowObj(),
  rootElement = documentObj,
  hostElement,
  props = {},
} = {}) {
  if (!documentObj) {
    return null;
  }

  themeToggleInstances.get(documentObj)?.destroy?.();

  const component = createThemeToggleComponent({
    documentObj,
    windowObj,
    rootElement,
    hostElement,
    props,
  });
  if (!component) {
    return null;
  }

  themeToggleInstances.set(documentObj, component);
  return {
    ...component,
    destroy() {
      component.destroy();
      if (themeToggleInstances.get(documentObj) === component) {
        themeToggleInstances.delete(documentObj);
      }
    },
  };
}

export { createThemeToggleComponent, initThemeToggle };
