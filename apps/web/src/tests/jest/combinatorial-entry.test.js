import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';

function createCombinatorialDom() {
  return new JSDOM(`<!doctype html><html><body>
    <main id="combinatorial-root">
      <textarea id="combinatorial-schema"></textarea>
      <select id="combinatorial-strength"></select>
      <div id="combinatorial-estimates"></div>
      <div id="combinatorial-strategies"></div>
      <button id="generate-combinatorial" type="button">Generate Combinatorial</button>
      <p id="combinatorial-progress"></p>
      <p id="combinatorial-status"></p>
      <div id="combinatorial-summary"></div>
      <div id="combinatorial-details"></div>
    </main>
  </body></html>`);
}

describe('combinatorial entry', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    delete global.document;
    delete global.window;
  });

  test('buildEstimateSummary returns cartesian, lower-bound, and tuple totals', async () => {
    const originalDocument = global.document;
    delete global.document;

    const module = await import('../../combinatorial-entry.js');

    const summary = module.buildEstimateSummary(
      [
        { name: 'Browser', values: ['Chrome', 'Firefox', 'Safari'] },
        { name: 'OS', values: ['Windows', 'macOS', 'Linux'] },
        { name: 'Viewport', values: ['Desktop', 'Tablet', 'Mobile'] },
        { name: 'Auth', values: ['Guest', 'User', 'Admin'] },
      ],
      3
    );

    expect(summary).toEqual({
      cartesianRowCount: 81,
      theoreticalMinimumRows: 27,
      totalRequiredTuples: 108,
    });

    global.document = originalDocument;
  });

  test('filterAlgorithmsForCartesianConfirmation skips cartesian when the user cancels a large run', async () => {
    const originalDocument = global.document;
    delete global.document;

    const module = await import('../../combinatorial-entry.js');
    const requestConfirm = jest.fn(async () => false);

    const filtered = await module.filterAlgorithmsForCartesianConfirmation({
      algorithms: ['greedy', 'cartesian-product'],
      parameters: Array.from({ length: 5 }, (_, index) => ({
        name: `P${index + 1}`,
        values: Array.from({ length: 10 }, (_unused, valueIndex) => `${index}-${valueIndex}`),
      })),
      requestConfirm,
      threshold: 10000,
    });

    expect(filtered).toEqual(['greedy']);
    expect(requestConfirm).toHaveBeenCalledWith({
      title: 'Cartesian product generation',
      message: 'You included cartesian product generation. Are you sure? this will generate 100,000 data rows.',
      okLabel: 'Run cartesian product',
      cancelLabel: 'Skip cartesian product',
    });

    global.document = originalDocument;
  });

  test('initialises with cartesian product unchecked and updates estimates when n changes', async () => {
    const dom = createCombinatorialDom();
    global.window = dom.window;
    global.document = dom.window.document;

    await jest.isolateModulesAsync(async () => {
      await import('../../combinatorial-entry.js');
    });

    const cartesianCheckbox = global.document.querySelector('input[value="cartesian-product"]');
    const estimatesRoot = global.document.getElementById('combinatorial-estimates');
    const strengthSelect = global.document.getElementById('combinatorial-strength');

    expect(cartesianCheckbox.checked).toBe(false);
    expect(estimatesRoot.textContent).toContain('Cartesian product: 81 rows');
    expect(estimatesRoot.textContent).toContain('Theoretical minimum: at least 9 rows');
    expect(estimatesRoot.textContent).toContain('2-wise requires 54 target tuples');

    strengthSelect.value = '3';
    strengthSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(estimatesRoot.textContent).toContain('Cartesian product: 81 rows');
    expect(estimatesRoot.textContent).toContain('Theoretical minimum: at least 27 rows');
    expect(estimatesRoot.textContent).toContain('3-wise requires 108 target tuples');

    dom.window.close();
  });
});
