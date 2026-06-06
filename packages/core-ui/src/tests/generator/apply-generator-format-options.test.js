import { jest } from '@jest/globals';
import { applyGeneratorFormatOptions } from '../../../js/gui_components/generator/options/apply-generator-format-options.js';

describe('applyGeneratorFormatOptions', () => {
  test('sanitizes exporter options and runs post-apply callbacks', () => {
    const exporter = {};
    const syncFormatStateIfChanged = jest.fn();
    const renderOutputPreviewForCurrentSelection = jest.fn();
    const setGenerationStatus = jest.fn();
    const scheduleClearGenerationStatus = jest.fn();

    const result = applyGeneratorFormatOptions({
      options: {
        outputFormat: 'json',
        options: { prettyPrint: true },
      },
      currentSelectedType: 'csv',
      exporter,
      syncFormatStateIfChanged,
      renderOutputPreviewForCurrentSelection,
      setGenerationStatus,
      scheduleClearGenerationStatus,
      sanitizeOptions: jest.fn(() => ({
        outputFormat: 'json',
        options: { prettyPrint: true },
      })),
    });

    expect(syncFormatStateIfChanged).toHaveBeenCalledWith('json', 'csv');
    expect(renderOutputPreviewForCurrentSelection).toHaveBeenCalledTimes(1);
    expect(setGenerationStatus).toHaveBeenCalledWith('JSON options applied.');
    expect(scheduleClearGenerationStatus).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      requestedType: 'json',
      resolvedType: 'json',
      sanitized: {
        outputFormat: 'json',
        options: { prettyPrint: true },
      },
    });
  });

  test('returns null when no options are provided', () => {
    expect(applyGeneratorFormatOptions()).toBeNull();
  });
});
