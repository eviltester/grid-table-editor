import { JSDOM } from 'jsdom';
import { createGridRowVisibilitySummaryComponent } from '../../../js/gui_components/data-grid-editor/grid-row-visibility-summary/index.js';

describe('GridRowVisibilitySummary', () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('renders the rooted status surface and updates the summary text', () => {
    const component = createGridRowVisibilitySummaryComponent({
      root,
      documentObj: document,
      props: {
        totalRowCount: 2,
        visibleRowCount: 2,
        hasActiveFilters: false,
      },
    });

    expect(root.getAttribute('data-role')).toBe('grid-total-rows');
    expect(root.getAttribute('role')).toBe('status');
    expect(root.getAttribute('aria-live')).toBe('polite');
    expect(root.textContent).toBe('Total rows: 2');

    component.update({
      totalRowCount: 8,
      visibleRowCount: 3,
      hasActiveFilters: true,
    });

    expect(root.textContent).toBe('Total rows: 8 | Filtered Visible: 3');

    component.destroy();
    expect(root.textContent).toBe('');
    expect(root.getAttribute('data-role')).toBeNull();
  });
});
