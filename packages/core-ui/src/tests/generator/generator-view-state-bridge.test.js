import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorViewStateBridge } from '../../../js/gui_components/generator/runtime/generator-view-state-bridge.js';

describe('generator view state bridge', () => {
  test('reads and updates mounted controls/preview state through one focused bridge', () => {
    const controls = {
      getSelectedOutputType: jest.fn(() => 'json'),
      getState: jest.fn(() => ({ selectedFormat: 'markdown' })),
      syncFormatState: jest.fn(),
      getGenerateRowCount: jest.fn(() => ({ value: 12, valid: true, errors: [] })),
      setGenerationButtonsBusy: jest.fn(),
      clearStatus: jest.fn(),
      setStatus: jest.fn(),
      showLoadingStatus: jest.fn(),
      scheduleClearStatus: jest.fn(),
      setPairwiseVisible: jest.fn(),
    };
    const preview = {
      getPreviewRowCount: jest.fn(() => ({ value: 4, valid: true, errors: [] })),
      getPreviewGrid: jest.fn(() => ({ id: 'grid' })),
      getPreviewTableApi: jest.fn(() => ({ id: 'table-api' })),
      renderOutputPreview: jest.fn(),
      setPreviewDataTable: jest.fn(),
    };
    const exporter = { id: 'exporter' };
    const bridge = createGeneratorViewStateBridge({
      getGeneratorControls: () => controls,
      getGeneratorPreview: () => preview,
      getExporter: () => exporter,
      createUnavailableRowCountResult: (fieldLabel) => ({
        value: 0,
        valid: false,
        errors: [`${fieldLabel} invalid`],
      }),
    });

    expect(bridge.getSelectedOutputType()).toBe('json');
    expect(bridge.syncGeneratorControlsFormatStateIfChanged('json', 'json')).toBe(false);
    expect(bridge.syncGeneratorControlsFormatStateIfChanged('markdown', 'json')).toBe(true);
    expect(controls.syncFormatState).toHaveBeenCalledWith('markdown');

    expect(bridge.getPreviewRowCount()).toEqual({ value: 4, valid: true, errors: [] });
    expect(bridge.getGenerateRowCount()).toEqual({ value: 12, valid: true, errors: [] });
    expect(bridge.getPreviewGrid()).toEqual({ id: 'grid' });
    expect(bridge.getPreviewTableApi()).toEqual({ id: 'table-api' });

    expect(bridge.syncGeneratorControlsFormatState('csv')).toBe(true);
    expect(controls.syncFormatState).toHaveBeenCalledWith('csv');

    bridge.renderOutputPreviewForCurrentSelection();
    expect(preview.renderOutputPreview).toHaveBeenCalledWith('json', exporter);

    bridge.setGenerationButtonsBusy(true);
    bridge.clearGenerationStatus();
    bridge.setGenerationStatus('Applied.', { severity: 'info' });
    bridge.showGenerationLoadingStatus('Generating...');
    bridge.scheduleClearGenerationStatus(900);
    bridge.setPairwiseVisible(true);
    bridge.setPreviewDataTable({ id: 'table' });

    expect(controls.setGenerationButtonsBusy).toHaveBeenCalledWith(true);
    expect(controls.clearStatus).toHaveBeenCalled();
    expect(controls.setStatus).toHaveBeenCalledWith('Applied.', { severity: 'info' });
    expect(controls.showLoadingStatus).toHaveBeenCalledWith('Generating...');
    expect(controls.scheduleClearStatus).toHaveBeenCalledWith(900);
    expect(controls.setPairwiseVisible).toHaveBeenCalledWith(true);
    expect(preview.setPreviewDataTable).toHaveBeenCalledWith({ id: 'table' });
  });

  test('falls back cleanly when controls or preview are unavailable', () => {
    const bridge = createGeneratorViewStateBridge({
      getGeneratorControls: () => null,
      getGeneratorPreview: () => null,
      getExporter: () => null,
      createUnavailableRowCountResult: (fieldLabel) => ({
        value: 0,
        valid: false,
        errors: [`${fieldLabel} invalid`],
      }),
    });

    expect(bridge.getSelectedOutputType()).toBe('csv');
    expect(bridge.getPreviewRowCount()).toEqual({
      value: 0,
      valid: false,
      errors: ['Preview row count invalid'],
    });
    expect(bridge.getPreviewGrid()).toBeNull();
    expect(bridge.getPreviewTableApi()).toBeNull();
    expect(bridge.getGenerateRowCount()).toEqual({
      value: 0,
      valid: false,
      errors: ['Generate row count invalid'],
    });
    expect(() => bridge.renderOutputPreviewForCurrentSelection()).not.toThrow();
    expect(bridge.syncGeneratorControlsFormatState('csv')).toBe(true);
    expect(() => bridge.setGenerationStatus('noop')).not.toThrow();
    expect(() => bridge.setPairwiseVisible(true)).not.toThrow();
  });
});
