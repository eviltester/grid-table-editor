import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createThemeToggleComponent } from '../../../js/gui_components/shared/theme-toggle.js';
import * as themeToggleModule from '../../../js/gui_components/shared/theme-toggle.js';

function createPage() {
  document.body.innerHTML = '<div class="header" data-role="theme-toggle-host"></div>';
}

describe('theme toggle', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body></body></html>`, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;
    window.localStorage.clear();
    createPage();
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    jest.restoreAllMocks();
  });

  test('shared theme-toggle module stays component-factory-only', () => {
    expect(typeof themeToggleModule.createThemeToggleComponent).toBe('function');
    expect(themeToggleModule.initThemeToggle).toBeUndefined();
  });

  test('reads docusaurus theme preference from localStorage key "theme"', () => {
    window.localStorage.setItem('theme', 'dark');

    const component = createThemeToggleComponent({
      documentObj: document,
      windowObj: window,
      hostElement: document.querySelector('[data-role="theme-toggle-host"]'),
    });
    const toggleButton = document.querySelector('[data-role="theme-toggle-button"]');

    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(component?.getState()).toEqual({ theme: 'dark' });
    expect(toggleButton?.textContent).toBe('☀');
    expect(toggleButton?.getAttribute('aria-label')).toBe('Switch to light theme');
  });

  test('falls back to legacy key and migrates on toggle', () => {
    window.localStorage.setItem('anywaydata-theme', 'light');

    const component = createThemeToggleComponent({
      documentObj: document,
      windowObj: window,
      hostElement: document.querySelector('[data-role="theme-toggle-host"]'),
    });
    component.toggleTheme();

    expect(component.getState()).toEqual({ theme: 'dark' });
    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(window.localStorage.getItem('anywaydata-theme')).toBe('dark');
  });

  test('createThemeToggleComponent scopes ownership, emits theme changes, and cleans up on destroy', () => {
    const root = document.createElement('section');
    root.innerHTML = '<div class="header" data-role="theme-toggle-host"></div>';
    document.body.appendChild(root);
    const onThemeChanged = jest.fn();

    const component = createThemeToggleComponent({
      documentObj: document,
      windowObj: window,
      rootElement: root,
      props: { onThemeChanged },
    });

    expect(component.getState()).toEqual({ theme: 'light' });
    expect(onThemeChanged).toHaveBeenCalledWith('light');

    const button = root.querySelector('[data-role="theme-toggle-button"]');
    expect(button).not.toBeNull();
    expect(button.getAttribute('data-role')).toBe('theme-toggle-button');

    button.click();

    expect(component.getState()).toEqual({ theme: 'dark' });
    expect(onThemeChanged).toHaveBeenLastCalledWith('dark');
    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(window.localStorage.getItem('theme')).toBe('dark');

    component.destroy();

    expect(root.querySelector('[data-role="theme-toggle-container"]')).toBeNull();
  });

  test('createThemeToggleComponent returns null when no explicit host is available', () => {
    const root = document.createElement('section');
    document.body.appendChild(root);

    const component = createThemeToggleComponent({
      documentObj: document,
      windowObj: window,
      rootElement: root,
    });

    expect(component).toBeNull();
  });

  test('createThemeToggleComponent can be recreated after destroy on the same host', () => {
    const hostElement = document.querySelector('[data-role="theme-toggle-host"]');
    const firstComponent = createThemeToggleComponent({
      documentObj: document,
      windowObj: window,
      hostElement,
    });
    const firstButton = document.querySelector('[data-role="theme-toggle-button"]');

    firstComponent.destroy();
    expect(firstButton?.isConnected).toBe(false);

    const secondComponent = createThemeToggleComponent({
      documentObj: document,
      windowObj: window,
      hostElement,
    });
    const secondButton = document.querySelector('[data-role="theme-toggle-button"]');

    expect(secondButton?.isConnected).toBe(true);
    expect(secondButton).not.toBe(firstButton);

    secondComponent.destroy();
    expect(document.querySelector('[data-role="theme-toggle-button"]')).toBeNull();
  });

  test('does not throw when no document or window is available', () => {
    const originalDocument = global.document;
    const originalWindow = global.window;

    delete global.document;
    delete global.window;

    try {
      expect(() => createThemeToggleComponent()).not.toThrow();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
    }
  });
});
