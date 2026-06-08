import { describe, expect, jest, test } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { createCombinationsDialogComponent } from '../../../js/gui_components/shared/combinations-dialog/index.js';
import { CombinationsDialogView } from '../../../js/gui_components/shared/combinations-dialog/combinations-dialog-view.js';
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

  test('accepts selectedStrength as a numeric string when opening the dialog', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const component = createCombinationsDialogComponent({
      root: dom.window.document.getElementById('root'),
      documentObj: dom.window.document,
    });

    component.open({ enumColumnCount: 3, enumValueCounts: [2, 3, 4], selectedStrength: '3' });

    const strengthSelect = dom.window.document.querySelector('[data-role="n-wise-strength-select"]');
    const strategyOptionIds = Array.from(
      dom.window.document.querySelectorAll('[data-role="n-wise-strategy-option"]'),
      (option) => option.getAttribute('data-strategy-id')
    );

    expect(component.getState().selectedStrength).toBe(3);
    expect(strengthSelect.value).toBe('3');
    expect(strategyOptionIds).toContain(CombinationAlgorithm.GREEDY);
    expect(strategyOptionIds).toContain(CombinationAlgorithm.IPOG);
    expect(strategyOptionIds).not.toContain(CombinationAlgorithm.PAIRWISE);

    component.destroy();
    dom.window.close();
  });

  test('keeps a caller-provided root in the document on destroy', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const root = dom.window.document.getElementById('root');
    const component = createCombinationsDialogComponent({
      root,
      documentObj: dom.window.document,
    });

    component.open({ enumColumnCount: 3, enumValueCounts: [2, 3, 4] });
    component.destroy();

    expect(dom.window.document.body.contains(root)).toBe(true);

    dom.window.close();
  });

  test('updates strength once when browsers fire input and change for a select interaction', () => {
    const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
    const state = {
      open: true,
      enumColumnCount: 3,
      strengths: [2, 3],
      selectedStrength: 2,
      selectedAlgorithm: CombinationAlgorithm.PICT_GCD,
      strategies: [
        {
          id: CombinationAlgorithm.PICT_GCD,
          label: 'PICT GCD',
          description: 'Greedy pairwise coverage using PICT-inspired candidate selection.',
        },
      ],
    };
    const controller = {
      getState: jest.fn(() => ({ ...state, strengths: [...state.strengths], strategies: [...state.strategies] })),
      setStrength: jest.fn((value) => {
        state.selectedStrength = Number.parseInt(value, 10);
      }),
      setAlgorithm: jest.fn(),
      submit: jest.fn(),
      close: jest.fn(),
    };
    const view = new CombinationsDialogView({
      root: dom.window.document.getElementById('root'),
      controller,
      documentObj: dom.window.document,
    });

    view.mount();

    const strengthSelect = dom.window.document.querySelector('[data-role="n-wise-strength-select"]');
    strengthSelect.value = '3';
    strengthSelect.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    strengthSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));

    expect(controller.setStrength).toHaveBeenCalledTimes(1);
    expect(controller.setStrength).toHaveBeenCalledWith('3');

    view.destroy();
    dom.window.close();
  });
});
