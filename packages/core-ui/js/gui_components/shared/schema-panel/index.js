import { resolveDocumentObj } from '../dom/default-objects.js';
import { createSharedSchemaDefinitionComponent } from '../schema-definition/index.js';
import { createTimedStatusPresenter } from '../timed-error-display.js';
import { SchemaPanelController } from './schema-panel-controller.js';
import { SchemaPanelView } from './schema-panel-view.js';

function createSchemaPanelComponent({ root, props = {}, services = {}, callbacks = {}, documentObj } = {}) {
  const resolvedDocumentObj = resolveDocumentObj(documentObj, root);
  const controller = new SchemaPanelController({ props });
  const view = new SchemaPanelView({
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

export { createSchemaPanelComponent };
