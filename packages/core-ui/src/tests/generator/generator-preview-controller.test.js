import { jest } from '@jest/globals';
import { GeneratorPreviewController } from '../../../js/gui_components/generator/preview/index.js';

describe('GeneratorPreviewController', () => {
  test('stores preview text and triggers preview callback', () => {
    const onPreview = jest.fn();
    const controller = new GeneratorPreviewController({
      props: { outputPreviewText: 'csv:sync:2' },
      callbacks: { onPreview },
    });

    expect(controller.getState().outputPreviewText).toBe('csv:sync:2');

    controller.setOutputPreviewText('json:sync:3');
    expect(controller.getState().outputPreviewText).toBe('json:sync:3');

    controller.triggerPreview();
    expect(onPreview).toHaveBeenCalledTimes(1);
  });
});
