import { jest } from '@jest/globals';
import { RowCountControlController } from '../../../js/gui_components/shared/row-count-control/index.js';

describe('row-count-control controller', () => {
  test('normalizes invalid input to the minimum when configured to normalize on input', () => {
    const controller = new RowCountControlController({
      props: {
        inputId: 'generateCount',
        min: 1,
        value: 1,
        normalizeOnInput: true,
      },
    });

    controller.handleInput('-2');

    expect(controller.getState().inputValue).toBe('1');
    expect(controller.getParsedValue()).toEqual({
      value: 1,
      valid: true,
      errors: [],
    });
  });

  test('normalizes non-numeric text to the minimum when configured to normalize on input', () => {
    const controller = new RowCountControlController({
      props: {
        inputId: 'generateCount',
        min: 1,
        value: 1,
        normalizeOnInput: true,
      },
    });

    controller.handleInput('bob');

    expect(controller.getState().inputValue).toBe('1');
    expect(controller.getParsedValue()).toEqual({
      value: 1,
      valid: true,
      errors: [],
    });
  });

  test('preserves non-numeric text and reports validation errors when not normalizing on input', () => {
    const controller = new RowCountControlController({
      props: {
        inputId: 'previewRowsCount',
        min: 0,
        max: 50,
        value: 10,
        normalizeOnInput: false,
      },
    });

    controller.handleInput('bob');

    expect(controller.getState().inputValue).toBe('bob');
    expect(controller.getParsedValue()).toEqual({
      value: 0,
      valid: false,
      errors: ['previewRowsCount must be a number greater than or equal to 0.'],
    });
  });

  test('reports max validation errors when the raw value exceeds max', () => {
    const controller = new RowCountControlController({
      props: {
        inputId: 'previewRowsCount',
        min: 0,
        max: 50,
        value: 10,
      },
    });

    controller.handleInput('999');

    expect(controller.getState().inputValue).toBe('999');
    expect(controller.getParsedValue()).toEqual({
      value: 50,
      valid: false,
      errors: ['previewRowsCount must be less than or equal to 50.'],
    });
  });

  test('clamps max values during input when configured to clamp to max on input', () => {
    const controller = new RowCountControlController({
      props: {
        inputId: 'previewRowsCount',
        min: 0,
        max: 50,
        value: 10,
        normalizeOnInput: true,
        clampToMaxOnInput: true,
      },
    });

    controller.handleInput('999');

    expect(controller.getState().inputValue).toBe('50');
    expect(controller.getParsedValue()).toEqual({
      value: 50,
      valid: true,
      errors: [],
    });
  });

  test('emits raw, parsed, and state payloads on change', () => {
    const onChange = jest.fn();
    const controller = new RowCountControlController({
      props: {
        inputId: 'generateCount',
        min: 1,
        value: 1,
        normalizeOnInput: true,
      },
      callbacks: { onChange },
    });

    controller.handleInput('bob');

    expect(onChange).toHaveBeenCalledWith({
      rawValue: 'bob',
      parsed: {
        value: 1,
        valid: true,
        errors: [],
      },
      state: expect.objectContaining({
        inputId: 'generateCount',
        inputValue: '1',
        min: 1,
      }),
    });
  });

  test('uses the normalized fallback when value is explicitly updated to undefined', () => {
    const controller = new RowCountControlController({
      props: {
        inputId: 'generateCount',
        min: 10,
        value: 25,
      },
    });

    controller.updateProps({ value: undefined });

    expect(controller.getState()).toEqual(
      expect.objectContaining({
        value: 10,
        inputValue: '10',
        min: 10,
      })
    );
  });
});
