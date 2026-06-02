import { GeneratorPageController } from '../../../js/gui_components/generator/page/index.js';

describe('GeneratorPageController', () => {
  test('stores child feature props and merges updates', () => {
    const controller = new GeneratorPageController({
      props: {
        controlsProps: { selectedFormat: 'csv', pairwiseVisible: false },
        previewProps: { outputPreviewText: '' },
        schemaDefinitionProps: { headingText: 'Schema' },
      },
    });

    controller.updateProps({
      controlsProps: { selectedFormat: 'json' },
      previewProps: { outputPreviewText: 'json:sync:2' },
    });

    const state = controller.getState();
    expect(state.controlsProps.selectedFormat).toBe('json');
    expect(state.controlsProps.pairwiseVisible).toBe(false);
    expect(state.previewProps.outputPreviewText).toBe('json:sync:2');
    expect(state.schemaDefinitionProps.headingText).toBe('Schema');
  });
});
