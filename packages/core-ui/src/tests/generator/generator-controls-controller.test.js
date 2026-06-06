import { describe, expect, jest, test } from '@jest/globals';
import * as generatorControlsExports from '../../../js/gui_components/generator/controls/index.js';
import { GeneratorControlsController } from '../../../js/gui_components/generator/controls/generator-controls-controller.js';

describe('GeneratorControlsController', () => {
  test('controls barrel is component-factory-only', () => {
    expect(typeof generatorControlsExports.createGeneratorControlsComponent).toBe('function');
    expect(generatorControlsExports.GeneratorControlsController).toBeUndefined();
    expect(generatorControlsExports.GeneratorControlsView).toBeUndefined();
  });

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
      generationButtonsBusy: false,
      statusMessage: '',
      statusOptions: {},
      loadingStatusMessage: '',
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
      generationButtonsBusy: false,
      statusMessage: '',
      statusOptions: {},
      loadingStatusMessage: '',
    });
  });

  test('supports explicit pairwise visibility updates', () => {
    const controller = new GeneratorControlsController({
      props: {
        selectedFormat: 'csv',
        pairwiseVisible: false,
      },
    });

    controller.setPairwiseVisible(true);
    expect(controller.getState().pairwiseVisible).toBe(true);

    controller.setPairwiseVisible(false);
    expect(controller.getState().pairwiseVisible).toBe(false);
  });

  test('supports explicit generation busy updates', () => {
    const controller = new GeneratorControlsController({
      props: {
        selectedFormat: 'csv',
        generationButtonsBusy: false,
      },
    });

    controller.setGenerationButtonsBusy(true);
    expect(controller.getState().generationButtonsBusy).toBe(true);

    controller.setGenerationButtonsBusy(false);
    expect(controller.getState().generationButtonsBusy).toBe(false);
  });

  test('tracks explicit status and loading state', () => {
    const controller = new GeneratorControlsController({
      props: {
        selectedFormat: 'csv',
      },
    });

    controller.setStatus('Applied.', { severity: 'info' });
    expect(controller.getState()).toEqual(
      expect.objectContaining({
        statusMessage: 'Applied.',
        statusOptions: { severity: 'info' },
        loadingStatusMessage: '',
      })
    );

    controller.showLoadingStatus('Generating...');
    expect(controller.getState()).toEqual(
      expect.objectContaining({
        statusMessage: '',
        statusOptions: {},
        loadingStatusMessage: 'Generating...',
      })
    );

    controller.clearStatus();
    expect(controller.getState()).toEqual(
      expect.objectContaining({
        statusMessage: '',
        statusOptions: {},
        loadingStatusMessage: '',
      })
    );
  });
});
