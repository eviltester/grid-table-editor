import { describe, expect, test } from '@jest/globals';
import { createGeneratorUnavailableRowCountResult } from '../../../js/gui_components/generator/runtime/create-generator-unavailable-row-count-result.js';

describe('createGeneratorUnavailableRowCountResult', () => {
  test('returns an explicit invalid row-count result with a reviewer-facing label', () => {
    expect(createGeneratorUnavailableRowCountResult('Preview row count')).toEqual({
      value: 0,
      valid: false,
      errors: ['Preview row count must be a number greater than or equal to 0.'],
    });
  });
});
