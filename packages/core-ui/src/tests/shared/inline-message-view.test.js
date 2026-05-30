import { JSDOM } from 'jsdom';
import { createInlineMessageComponent } from '../../../js/gui_components/shared/primitives/inline-message/index.js';

describe('InlineMessageView', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="message"></div></body></html>');
    root = dom.window.document.getElementById('message');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('hideWhenEmpty hides the root until a message is shown', () => {
    const component = createInlineMessageComponent({
      root,
      props: {
        hideWhenEmpty: true,
        visibleDisplay: 'inline-block',
      },
    });

    expect(root.style.display).toBe('none');

    component.setStatus('Generating...', true);
    expect(root.textContent).toBe('Generating...');
    expect(root.style.display).toBe('inline-block');
    expect(root.classList.contains('is-loading')).toBe(true);
    expect(root.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('inline-block');
  });

  test('show applies severity and clear removes it', () => {
    const component = createInlineMessageComponent({ root });

    component.show('Bad schema', { severity: 'error', sticky: true });
    expect(root.textContent).toBe('Bad schema');
    expect(root.getAttribute('data-severity')).toBe('error');
    expect(root.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('none');

    component.clear();
    expect(root.textContent).toBe('');
    expect(root.hasAttribute('data-severity')).toBe(false);
  });

  test('destroy clears visible state from the root element', () => {
    const component = createInlineMessageComponent({
      root,
      props: {
        hideWhenEmpty: true,
      },
    });

    component.show('Warning', { severity: 'warning', sticky: true });
    component.destroy();

    expect(root.textContent).toBe('');
    expect(root.hasAttribute('data-severity')).toBe(false);
    expect(root.querySelector('[data-role="loading-indicator"]')?.style.display).toBe('none');
    expect(root.style.display).toBe('none');
  });
});
