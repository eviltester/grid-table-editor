import { jest } from '@jest/globals';
import { FormatOptionsPanelController } from '../../../js/gui_components/shared/format-options-panel/format-options-panel-controller.js';

describe('FormatOptionsPanelController', () => {
  test('apply sanitizes options, clears dirty state, and emits the sanitized payload', () => {
    const onApplyOptions = jest.fn();
    const onDirtyStateChanged = jest.fn();
    const controller = new FormatOptionsPanelController({
      props: {
        selectedFormat: 'json',
      },
      services: {
        sanitizeOptionsForFormat: jest.fn((format, options) => ({
          outputFormat: format,
          options: {
            prettyPrint: options.prettyPrint === true,
          },
        })),
      },
      callbacks: {
        onApplyOptions,
        onDirtyStateChanged,
      },
    });

    controller.setDirty(true);
    const sanitized = controller.apply({ prettyPrint: true });

    expect(sanitized).toEqual({
      outputFormat: 'json',
      options: { prettyPrint: true },
    });
    expect(onApplyOptions).toHaveBeenCalledWith({
      type: 'json',
      sanitized,
      rawOptions: { prettyPrint: true },
    });
    expect(controller.getState().dirty).toBe(false);
    expect(onDirtyStateChanged).toHaveBeenLastCalledWith(false);
  });

  test('updateProps replaces selected format and current options and resets dirty state', () => {
    const controller = new FormatOptionsPanelController({
      props: {
        selectedFormat: 'csv',
        currentOptions: { outputFormat: 'csv', options: { header: true } },
      },
      services: {
        sanitizeOptionsForFormat: jest.fn(),
      },
    });

    controller.setDirty(true);
    controller.updateProps({
      selectedFormat: 'dsv',
      currentOptions: { outputFormat: 'dsv', options: { delimiter: '|' } },
    });

    expect(controller.getState()).toEqual({
      selectedFormat: 'dsv',
      currentOptions: { outputFormat: 'dsv', options: { delimiter: '|' } },
      supported: false,
      dirty: false,
    });
  });
});
