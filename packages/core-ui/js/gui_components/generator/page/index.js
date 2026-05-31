import { createTimedStatusPresenter } from '../../shared/timed-error-display.js';
import { createSharedSchemaDefinitionComponent } from '../../shared/schema-definition/index.js';
import { createGeneratorControlsComponent } from '../controls/index.js';
import { createGeneratorPreviewComponent } from '../preview/index.js';
import { GeneratorPageController } from './generator-page-controller.js';
import { GeneratorPageView } from './generator-page-view.js';

function createGeneratorPageComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj = document,
} = {}) {
  const controller = new GeneratorPageController({ props });
  const view = new GeneratorPageView({
    root,
    controller,
    documentObj,
    services: {
      createTimedStatusPresenter: services.createTimedStatusPresenter || createTimedStatusPresenter,
      createSharedSchemaDefinitionComponent:
        services.createSharedSchemaDefinitionComponent || createSharedSchemaDefinitionComponent,
      createGeneratorControlsComponent: services.createGeneratorControlsComponent || createGeneratorControlsComponent,
      createGeneratorPreviewComponent: services.createGeneratorPreviewComponent || createGeneratorPreviewComponent,
      generatorControlsServices: services.generatorControlsServices || {},
      generatorPreviewServices: services.generatorPreviewServices || {},
    },
    callbacks,
  });

  view.mount();

  return {
    update(nextProps) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
    },
    getSchemaDefinition() {
      return view.getSchemaDefinition();
    },
    getGeneratorControls() {
      return view.getGeneratorControls();
    },
    getGeneratorPreview() {
      return view.getGeneratorPreview();
    },
    getSchemaErrorDisplay() {
      return view.getSchemaErrorDisplay();
    },
  };
}

export { createGeneratorPageComponent, GeneratorPageController, GeneratorPageView };
