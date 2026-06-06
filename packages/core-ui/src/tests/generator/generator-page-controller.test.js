import * as generatorPageExports from '../../../js/gui_components/generator/page/index.js';
import { GeneratorPageController } from '../../../js/gui_components/generator/page/generator-page-controller.js';

describe('GeneratorPageController', () => {
  test('public barrel is component-factory-only for generator page features', () => {
    expect(typeof generatorPageExports.createGeneratorPageComponent).toBe('function');
    expect(generatorPageExports.createGeneratorPageShellComponent).toBeUndefined();
    expect(generatorPageExports.GeneratorPageController).toBeUndefined();
    expect(generatorPageExports.GeneratorPageView).toBeUndefined();
    expect(generatorPageExports.GeneratorPageShellController).toBeUndefined();
    expect(generatorPageExports.GeneratorPageShellView).toBeUndefined();
  });

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
