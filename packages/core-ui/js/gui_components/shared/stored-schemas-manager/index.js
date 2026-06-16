import { createStoredSchemasStorage } from '../stored-schemas/stored-schemas-storage.js';
import { createStoredSchemasDialogService } from '../dialog-services/stored-schemas-dialog-service.js';
import { createTextInputDialogService } from '../dialog-services/text-input-dialog-service.js';
import { StoredSchemasManagerController } from './stored-schemas-manager-controller.js';
import { StoredSchemasManagerView } from './stored-schemas-manager-view.js';

function resolveLocalStorage(windowObj) {
  try {
    return windowObj?.localStorage;
  } catch {
    return null;
  }
}

function createStoredSchemasManagerComponent({
  root,
  props = {},
  services = {},
  callbacks = {},
  documentObj,
  windowObj,
} = {}) {
  const resolvedWindowObj = windowObj || documentObj?.defaultView || globalThis;
  const storage =
    services.storage ||
    createStoredSchemasStorage({
      storage: resolveLocalStorage(resolvedWindowObj),
    });
  const textInputDialogService =
    services.textInputDialogService ||
    services.createTextInputDialogService?.({ documentObj, windowObj: resolvedWindowObj }) ||
    createTextInputDialogService({ documentObj, windowObj: resolvedWindowObj });
  const storedSchemasDialogService =
    services.storedSchemasDialogService ||
    services.createStoredSchemasDialogService?.({ documentObj, windowObj: resolvedWindowObj }) ||
    createStoredSchemasDialogService({ documentObj, windowObj: resolvedWindowObj });
  const controller = new StoredSchemasManagerController({
    props: {
      ...props,
      summary: props.summary || storage.getSummaryState(),
    },
    callbacks,
  });
  const view = new StoredSchemasManagerView({
    root,
    controller,
    documentObj,
    windowObj: resolvedWindowObj,
    services: {
      ...services,
      storage,
      requestTextInput: (options) => textInputDialogService.requestTextInput(options),
      openStoredSchemasDialog: (options) => storedSchemasDialogService.openStoredSchemasDialog(options),
    },
    callbacks,
  });

  view.mount();
  view.refreshFromStorage();

  return {
    update(nextProps = {}) {
      controller.updateProps(nextProps);
      view.render();
    },
    destroy() {
      view.destroy();
      storedSchemasDialogService.destroy?.();
      textInputDialogService.destroy?.();
    },
    refresh() {
      view.refreshFromStorage();
    },
    setCurrentSchemaText(schemaText) {
      view.setCurrentSchemaText(schemaText);
    },
    recordCurrentSchemaAsLastUsed() {
      return view.recordCurrentSchemaAsLastUsed();
    },
    getState() {
      return controller.getState();
    },
  };
}

export { createStoredSchemasManagerComponent };
