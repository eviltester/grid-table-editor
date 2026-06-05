import { JSDOM } from 'jsdom';
import {
  createInstructionsComponent,
  APP_PAGE_INSTRUCTIONS_PROPS,
  GENERATOR_PAGE_INSTRUCTIONS_PROPS,
} from '../../../js/gui_components/shared/instructions/index.js';
import { jest } from '@jest/globals';

describe('instructions view', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.Event = dom.window.Event;
  });

  afterEach(() => {
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.Event;
  });

  test('renders the app instructions variant with copy action and footer content', () => {
    const root = document.getElementById('root');
    createInstructionsComponent({
      root,
      props: APP_PAGE_INSTRUCTIONS_PROPS,
    });

    expect(root.querySelector('.instructions')).not.toBeNull();
    expect(root.textContent).toContain('Instructions');
    expect(root.textContent).toContain('Copy Instructions To Grid');
    expect(root.textContent).toContain('Alan Richardson');
    expect(root.querySelector('.instructions-copy-to-grid-button')).not.toBeNull();
    expect(root.querySelectorAll('.instruction-item-icon svg.instruction-action-icon')).toHaveLength(5);
    expect(root.querySelector('.instruction-item-icon[title="Rename column"]')).not.toBeNull();
  });

  test('renders the generator instructions variant without the app-only action button', () => {
    const root = document.getElementById('root');
    createInstructionsComponent({
      root,
      props: GENERATOR_PAGE_INSTRUCTIONS_PROPS,
    });

    expect(root.textContent).toContain('Data Generator Instructions');
    expect(root.textContent).toContain('Generate Pairwise combinations');
    expect(root.querySelector('.instructions-copy-to-grid-button')).toBeNull();
    const helpIcon = root.querySelector('[data-help="shared-generator-screen-overview"]');
    expect(helpIcon).not.toBeNull();
    expect(helpIcon.hasAttribute('data-help-text')).toBe(false);
  });

  test('falls back to text-only instructions when an icon name is unknown', () => {
    const root = document.getElementById('root');
    createInstructionsComponent({
      root,
      props: {
        title: 'Safe Instructions',
        helpKey: 'safe-help',
        items: [{ icon: 'not-a-real-icon', title: 'Missing icon', text: 'Still render this instruction' }],
      },
    });

    expect(root.textContent).toContain('Still render this instruction');
    expect(root.querySelector('.instruction-item-icon')).toBeNull();
  });

  test('updates rendered content when the variant props change', () => {
    const root = document.getElementById('root');
    const component = createInstructionsComponent({
      root,
      props: APP_PAGE_INSTRUCTIONS_PROPS,
    });

    component.update(GENERATOR_PAGE_INSTRUCTIONS_PROPS);

    expect(root.textContent).toContain('Data Generator Instructions');
    expect(root.querySelector('.instructions-copy-to-grid-button')).toBeNull();

    component.destroy();
    expect(root.children.length).toBe(0);
  });

  test('refreshes scoped help hints on mount and update', () => {
    const root = document.getElementById('root');
    const updateHelpHints = jest.fn();
    const component = createInstructionsComponent({
      root,
      props: APP_PAGE_INSTRUCTIONS_PROPS,
      services: { updateHelpHints },
    });

    expect(updateHelpHints).toHaveBeenCalledTimes(1);

    component.update(GENERATOR_PAGE_INSTRUCTIONS_PROPS);

    expect(updateHelpHints).toHaveBeenCalledTimes(2);
  });
});
