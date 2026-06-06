import { describe, expect, test } from '@jest/globals';
import { createGeneratorPreviewProps } from '../../../js/gui_components/generator/runtime/create-generator-preview-props.js';

describe('createGeneratorPreviewProps', () => {
  test('builds the default preview prop subtree', () => {
    expect(createGeneratorPreviewProps()).toEqual({
      outputPreviewText: '',
    });
  });
});
