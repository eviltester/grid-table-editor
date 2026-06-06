import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { createGeneratorControlsComponent } from '../controls/index.js';
import { createGeneratorPreviewComponent } from '../preview/index.js';
import { createGeneratorSchemaPanelComponent } from '../schema-panel/index.js';
import { GeneratorPageController } from './generator-page-controller.js';
import { GeneratorPageView } from './generator-page-view.js';

function createGeneratorPageComponent({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new GeneratorPageController({ props });
  const view = new GeneratorPageView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createGeneratorControlsComponent: services.createGeneratorControlsComponent || createGeneratorControlsComponent,
      createGeneratorPreviewComponent: services.createGeneratorPreviewComponent || createGeneratorPreviewComponent,
      createGeneratorSchemaPanelComponent:
        services.createGeneratorSchemaPanelComponent || createGeneratorSchemaPanelComponent,
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

export { createGeneratorPageComponent };
