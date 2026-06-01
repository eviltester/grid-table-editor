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
    expect(root.querySelector('[data-help="generator-screen-overview"]')).not.toBeNull();
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
