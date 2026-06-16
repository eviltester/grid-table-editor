import { resolveDocumentObj } from '../dom/default-objects.js';
import { createSharedSchemaDefinitionComponent } from '../schema-definition/index.js';
import { createStoredSchemasManagerComponent } from '../stored-schemas-manager/index.js';
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
      createStoredSchemasManagerComponent:
        services.createStoredSchemasManagerComponent || createStoredSchemasManagerComponent,
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
    getStoredSchemasManager() {
      return view.getStoredSchemasManager();
    },
    recordCurrentSchemaAsLastUsed() {
      return view.getStoredSchemasManager()?.recordCurrentSchemaAsLastUsed?.() || null;
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createSchemaPanelComponent };
