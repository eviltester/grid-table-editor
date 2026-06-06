import { createTimedStatusPresenter } from '../../shared/timed-error-display.js';
import { createSharedSchemaDefinitionComponent } from '../../shared/schema-definition/index.js';
import { resolveDocumentObj } from '../../shared/dom/default-objects.js';
import { GeneratorSchemaPanelController } from './generator-schema-panel-controller.js';
import { GeneratorSchemaPanelView } from './generator-schema-panel-view.js';

function createGeneratorSchemaPanelComponent({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new GeneratorSchemaPanelController({ props });
  const view = new GeneratorSchemaPanelView({
    root,
    controller,
    documentObj: resolvedDocumentObj,
    services: {
      createTimedStatusPresenter: services.createTimedStatusPresenter || createTimedStatusPresenter,
      createSharedSchemaDefinitionComponent:
        services.createSharedSchemaDefinitionComponent || createSharedSchemaDefinitionComponent,
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
    getSchemaErrorDisplay() {
      return view.getSchemaErrorDisplay();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createGeneratorSchemaPanelComponent };
