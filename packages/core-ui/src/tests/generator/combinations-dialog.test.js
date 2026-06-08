import { describe, expect, jest, test } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createCombinationsDialogComponent } from '../../../js/gui_components/shared/combinations-dialog/index.js';
import { CombinationAlgorithm } from '../../../js/gui_components/generator/generation/n-wise-generation-options.js';

describe('combinations dialog', () => {
  test('limits n by enum column count and filters strategies by strength', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const onSubmit = jest.fn();
    const component = createCombinationsDialogComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
      callbacks: { onSubmit },
    });

    component.open({ enumColumnCount: 3, enumValueCounts: [2, 3, 4] });

    const strengthSelect = dom.window.document.querySelector('[data-role="n-wise-strength-select"]');
    const strategyOptions = () =>
      Array.from(dom.window.document.querySelectorAll('[data-role="n-wise-strategy-option"]'));
    const strategyOptionIds = () => strategyOptions().map((option) => option.getAttribute('data-strategy-id'));
    expect(Array.from(strengthSelect.options).map((option) => option.value)).toEqual(['2', '3']);
    expect(dom.window.document.querySelector('[data-role="n-wise-dialog"]').textContent).toContain(
      'Generate rows to cover the enum value combinations. Available n values are 2 through 3.'
    );
    expect(strategyOptionIds().slice(0, 2)).toEqual([CombinationAlgorithm.PICT_GCD, CombinationAlgorithm.AETG]);
    expect(strategyOptionIds()).toContain(CombinationAlgorithm.BACH_ALLPAIRS);
    expect(strategyOptionIds()).toContain(CombinationAlgorithm.PAIRWISE);
    expect(strategyOptionIds().at(-1)).toBe(CombinationAlgorithm.CARTESIAN_PRODUCT);
    expect(
      strategyOptions().find((option) => option.getAttribute('data-strategy-id') === CombinationAlgorithm.PAIRWISE)
        .textContent
    ).toContain('Pairwise (simple)');
    expect(
      strategyOptions().find((option) => option.getAttribute('data-strategy-id') === CombinationAlgorithm.BACH_ALLPAIRS)
        .textContent
    ).toContain('Bach AllPairs');
    expect(
      strategyOptions().find(
        (option) => option.getAttribute('data-strategy-id') === CombinationAlgorithm.CARTESIAN_PRODUCT
      ).textContent
    ).toContain('Will generate 24 rows to cover (2*3*4) combinations.');

    strengthSelect.value = '3';
    strengthSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(strategyOptionIds().slice(0, 2)).toEqual([CombinationAlgorithm.GREEDY, CombinationAlgorithm.IPOG]);
    expect(strategyOptionIds()).not.toContain(CombinationAlgorithm.PAIRWISE);
    expect(strategyOptionIds()).not.toContain(CombinationAlgorithm.BACH_ALLPAIRS);
    expect(strategyOptionIds().at(-1)).toBe(CombinationAlgorithm.CARTESIAN_PRODUCT);
    strategyOptions()
      .find((option) => option.getAttribute('data-strategy-id') === CombinationAlgorithm.GREEDY)
      .click();

    dom.window.document.querySelector('[data-role="n-wise-dialog-submit"]').click();
    expect(onSubmit).toHaveBeenCalledWith({
      strength: 3,
      algorithm: CombinationAlgorithm.GREEDY,
    });

    component.destroy();
    dom.window.close();
  });

  test('explains why no strengths are available for schemas with fewer than 2 enum columns', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const component = createCombinationsDialogComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
    });

    component.open({ enumColumnCount: 1 });

    expect(dom.window.document.querySelector('[data-role="n-wise-dialog"]').textContent).toContain(
      'Add at least 2 enum columns'
    );
    expect(dom.window.document.querySelector('[data-role="n-wise-dialog-submit"]').disabled).toBe(true);

    component.destroy();
    dom.window.close();
  });
});
