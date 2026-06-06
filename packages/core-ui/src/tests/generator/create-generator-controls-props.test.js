import { describe, expect, test } from '@jest/globals';
import { createGeneratorControlsProps } from '../../../js/gui_components/generator/runtime/create-generator-controls-props.js';

describe('createGeneratorControlsProps', () => {
  test('builds the default controls prop subtree', () => {
    expect(createGeneratorControlsProps()).toEqual({
      selectedFormat: 'csv',
      currentOptions: undefined,
      pairwiseVisible: false,
    });
  });
});
