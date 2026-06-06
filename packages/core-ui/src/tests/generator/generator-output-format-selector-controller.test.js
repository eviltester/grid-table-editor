import { describe, expect, jest, test } from '@jest/globals';
import { GeneratorOutputFormatSelectorController } from '../../../js/gui_components/generator/output-format-selector/generator-output-format-selector-controller.js';

describe('GeneratorOutputFormatSelectorController', () => {
  test('tracks selected format and emits changes', () => {
    const onFormatChange = jest.fn();
    const controller = new GeneratorOutputFormatSelectorController({
      props: {
        selectedFormat: 'json',
      },
      callbacks: {
        onFormatChange,
      },
    });

    expect(controller.getState()).toEqual({
      selectedFormat: 'json',
    });

    controller.setSelectedFormat('jest');

    expect(controller.getState()).toEqual({
      selectedFormat: 'jest',
    });
    expect(onFormatChange).toHaveBeenCalledWith('jest');
  });
});
