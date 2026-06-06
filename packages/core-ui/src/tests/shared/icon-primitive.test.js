import { JSDOM } from 'jsdom';
import * as iconPrimitiveExports from '../../../js/gui_components/shared/primitives/icon/icon-core.js';
import {
  createIconElement,
  decorateIconContainer,
  renderIconHtml,
} from '../../../js/gui_components/shared/primitives/icon/icon-core.js';

describe('shared icon primitive', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
  });

  afterEach(() => {
    dom.window.close();
  });

  test('shared icon helper module exposes the live runtime helpers directly', () => {
    expect(typeof iconPrimitiveExports.renderIconHtml).toBe('function');
    expect(typeof iconPrimitiveExports.decorateIconContainer).toBe('function');
    expect(typeof iconPrimitiveExports.createIconElement).toBe('function');
  });

  test('creates currentColor inline SVG icons hidden from assistive tech', () => {
    const icon = createIconElement(dom.window.document, 'pencil', {
      className: 'app-icon test-icon',
      size: 20,
    });

    expect(icon.tagName).toBe('svg');
    expect(icon.getAttribute('class')).toBe('app-icon test-icon');
    expect(icon.getAttribute('width')).toBe('20');
    expect(icon.getAttribute('height')).toBe('20');
    expect(icon.getAttribute('stroke')).toBe('currentColor');
    expect(icon.getAttribute('fill')).toBe('none');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  test('renders icon html for third-party formatter strings', () => {
    const html = renderIconHtml('trash', {
      className: 'app-icon danger-icon',
      size: 14,
    });

    expect(html).toContain('class="app-icon danger-icon"');
    expect(html).toContain('width="14"');
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('aria-hidden="true"');
  });

  test('decorates containers idempotently', () => {
    const button = dom.window.document.createElement('button');
    button.textContent = 'Help';

    decorateIconContainer(button, 'circle-help');
    decorateIconContainer(button, 'circle-help');

    expect(button.querySelectorAll('svg.app-icon')).toHaveLength(1);
    expect(button.textContent).toBe('Help');
  });

  test('rejects unknown icon names', () => {
    expect(() => renderIconHtml('missing-icon')).toThrow('Unknown icon "missing-icon"');
  });
});
