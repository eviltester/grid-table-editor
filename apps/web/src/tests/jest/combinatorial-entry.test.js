import { jest } from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
  buildEstimateSummary,
  filterAlgorithmsForCartesianConfirmation,
  initCombinatorialPage,
} from '../../combinatorial-entry.js';

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
    jest.restoreAllMocks();
    delete global.document;
    delete global.window;
  });

  test('buildEstimateSummary returns cartesian, lower-bound, and tuple totals', () => {
    const summary = buildEstimateSummary(
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
  });

  test('filterAlgorithmsForCartesianConfirmation skips cartesian when the user cancels a large run', async () => {
    const requestConfirm = jest.fn(async () => false);

    const filtered = await filterAlgorithmsForCartesianConfirmation({
      algorithms: ['greedy', 'cartesian-product'],
      parameters: Array.from({ length: 5 }, (_, index) => ({
        name: `P${index + 1}`,
        values: Array.from({ length: 10 }, (_unused, valueIndex) => `${index}-${valueIndex}`),
      })),
      requestConfirm,
      threshold: 10000,
    });

    expect(filtered).toEqual(['greedy']);
    expect(requestConfirm).toHaveBeenCalledTimes(1);
    const [confirmOptions] = requestConfirm.mock.calls[0];
    expect(confirmOptions.title).toBe('Cartesian product generation');
    expect(confirmOptions.okLabel).toBe('Run cartesian product');
    expect(confirmOptions.cancelLabel).toBe('Skip cartesian product');
    expect(confirmOptions.message).toContain('100,000');
  });

  test('initialises with cartesian product unchecked and updates estimates when n changes', async () => {
    const dom = createCombinatorialDom();
    global.window = dom.window;
    global.document = dom.window.document;
    initCombinatorialPage({ documentObj: global.document });

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
