import { initThemeToggle } from '../../../js/gui_components/shared/theme-toggle.js';
import { JSDOM } from 'jsdom';

function createPage() {
  document.body.innerHTML = '<div class="header"></div>';
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
  });

  test('reads docusaurus theme preference from localStorage key "theme"', () => {
    window.localStorage.setItem('theme', 'dark');

    initThemeToggle();

    expect(document.body.classList.contains('theme-dark')).toBe(true);
    expect(document.querySelector('#theme-toggle-button')?.textContent).toBe('☀');
    expect(document.querySelector('#theme-toggle-button')?.getAttribute('aria-label')).toBe('Switch to light theme');
  });

  test('falls back to legacy key and migrates on toggle', () => {
    window.localStorage.setItem('anywaydata-theme', 'light');

    initThemeToggle();
    const button = document.querySelector('#theme-toggle-button');
    button.click();

    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(window.localStorage.getItem('anywaydata-theme')).toBe('dark');
  });

  test('does not throw when no document or window is available', () => {
    const originalDocument = global.document;
    const originalWindow = global.window;

    delete global.document;
    delete global.window;

    try {
      expect(() => initThemeToggle()).not.toThrow();
    } finally {
      global.document = originalDocument;
      global.window = originalWindow;
    }
  });
});
