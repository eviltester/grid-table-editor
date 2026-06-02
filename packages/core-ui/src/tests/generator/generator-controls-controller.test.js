import { describe, expect, jest, test } from '@jest/globals';
import { GeneratorControlsController } from '../../../js/gui_components/generator/controls/index.js';

describe('GeneratorControlsController', () => {
  test('tracks selected format and pairwise visibility from props', () => {
    const onFormatChanged = jest.fn();
    const controller = new GeneratorControlsController({
      props: {
        selectedFormat: 'json',
        currentOptions: { options: { prettyPrint: true } },
        pairwiseVisible: true,
      },
      callbacks: { onFormatChanged },
    });

    expect(controller.getState()).toEqual({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
      pairwiseVisible: true,
    });

    controller.setSelectedFormat('csv');

    expect(controller.getState().selectedFormat).toBe('csv');
    expect(onFormatChanged).toHaveBeenCalledWith('csv');
  });

  test('forwards apply and action callbacks', () => {
    const onApplyOptions = jest.fn();
    const onGenerateData = jest.fn();
    const onGeneratePairwise = jest.fn();
    const controller = new GeneratorControlsController({
      callbacks: { onApplyOptions, onGenerateData, onGeneratePairwise },
    });

    const payload = { sanitized: { outputFormat: 'json' } };
    controller.applyOptions(payload);
    controller.triggerGenerateData();
    controller.triggerGeneratePairwise();

    expect(onApplyOptions).toHaveBeenCalledWith(payload);
    expect(onGenerateData).toHaveBeenCalled();
    expect(onGeneratePairwise).toHaveBeenCalled();
  });

  test('preserves pairwise visibility when updating unrelated props', () => {
    const controller = new GeneratorControlsController({
      props: {
        selectedFormat: 'csv',
        pairwiseVisible: true,
      },
    });

    controller.updateProps({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
    });

    expect(controller.getState()).toEqual({
      selectedFormat: 'json',
      currentOptions: { options: { prettyPrint: true } },
      pairwiseVisible: true,
    });
  });
});
